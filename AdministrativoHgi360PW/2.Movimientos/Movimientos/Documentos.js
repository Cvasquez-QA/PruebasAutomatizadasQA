import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    parseValorNumerico,
    escribir,
    TX_DOCUMENTO,
    TX_DOCUMENTO_TEXTO,
    TERCERO,
    TERCERO_TEXTO,
    PRODUCTO
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const DEPENDENCIA = '0';
const TOTAL_DOCUMENTO = '#txtDocumento_Total .dx-texteditor-input';
const NUMERO_DOCUMENTO = page => page.locator('#txtDocumento .dx-texteditor-input');
const accionesDetalle = page => page.locator('.erp-grid-action-glyph').filter({ visible: true });
const btnConfirmarEliminar = page => page.locator('button.swal2-confirm').filter({ visible: true });

// Al confirmar el producto, la app lo carga (~0,7 s), reinicia cantidad/valor unitario
// y pasa el foco al campo Remesa. Hay que esperar eso antes de escribir cantidad y valor.
const campoRemesa = page => page.locator('#txtDocumento_Detalle_Producto_Remesa_1');
// El total se recalcula varios segundos después de grabar o eliminar una línea (2 a 5 s).
const ESPERA_TOTAL = 15000;

/** Espera hasta que el total del documento cumpla la condición (o falla con el mensaje). */
async function esperarTotal(page, cumple, mensaje) {
    const inicio = Date.now();
    let total = await parseValorNumerico(page, TOTAL_DOCUMENTO);
    while (!cumple(total) && Date.now() - inicio < ESPERA_TOTAL) {
        await page.waitForTimeout(500);
        total = await parseValorNumerico(page, TOTAL_DOCUMENTO);
    }
    expect(cumple(total), `${mensaje} (total actual: ${total})`).toBeTruthy();
    return total;
}

async function nuevoDocumento(page) {
    await abrirMovimientos360(page, 'Documentos');
    await expect(page.locator('.erp-page-skeleton-toolbar').filter({ visible: true })).toHaveCount(0, { timeout: 20000 });
    await page.locator('#BtnNuevoDocumento .dx-button-content').first().click();
    await expect(page.locator('#Documento_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de nuevo documento')
        .toBeVisible({ timeout: 15000 });
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await filtrarPor(page, TX_DOCUMENTO);
    await seleccionarOpcion(page, TX_DOCUMENTO_TEXTO);
}

async function guardarDocumento(page) {
    await page.locator('#BtnGuardarDocumento_btn span').filter({ hasText: 'Guardar' }).first().click();
    await page.waitForTimeout(3000);
}

/** Guarda el encabezado y valida que quede con número; si el primer clic no guarda, reintenta una vez. */
async function guardarEncabezado(page) {
    await guardarDocumento(page);
    if (!await NUMERO_DOCUMENTO(page).first().inputValue()) {
        await guardarDocumento(page);
    }
    expect(await NUMERO_DOCUMENTO(page).first().inputValue(), 'El documento no quedó guardado (sin número)').toBeTruthy();
}

async function guardarDetalle(page) {
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save').first().click();
    await page.waitForTimeout(1000);
}

async function escribirCampoDetalle(page, selector, valor) {
    await page.locator(selector).first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator(selector), valor, { reemplazar: false });
}

async function escribirProducto(page, producto) {
    await escribir(page.locator('#txtDocumento_Detalle_Producto_cursor_1'), producto);
    await page.keyboard.press('Enter');
    await expect(campoRemesa(page).first(), `No terminó de cargar el producto ${producto}`).toBeFocused({ timeout: 10000 });
    await page.waitForTimeout(500);
}

async function editarCantidadPrimerDetalle(page, cantidad) {
    await accionesDetalle(page).nth(0).click();
    // La línea tarda ~0,7 s en subir a la fila de captura
    await expect(page.locator('#txtDocumento_Detalle_Producto_cursor_1').first(), 'La línea no cargó para editarla')
        .toHaveValue(PRODUCTO, { timeout: 10000 });
    await page.waitForTimeout(500);
    await escribirCampoDetalle(page, '#txtDocumento_Detalle_Cantidad_cursor_1', cantidad);
    await guardarDetalle(page);
}

async function eliminarPrimerDetalle(page) {
    await accionesDetalle(page).nth(1).click();
    await btnConfirmarEliminar(page).first().click();
}

async function ejecutarPruebaDocumentos(page, config) {
    await ingresarAplicacion(page, config);

    // Encabezado: transacción 01FE con dependencia 0
    await nuevoDocumento(page);
    await escribir(page.locator('#Documento_Dependencia .dx-texteditor-input'), DEPENDENCIA);
    await guardarEncabezado(page);

    // Detalle: producto 010203, cantidad 1, valor unitario 100
    await escribirProducto(page, PRODUCTO);
    await escribirCampoDetalle(page, '#txtDocumento_Detalle_Cantidad_cursor_1', '1');
    await escribirCampoDetalle(page, '#txtDocumento_Detalle_ValorUnitario_cursor_1', '100');
    await guardarDetalle(page);
    const totalInicial = await esperarTotal(page, total => total >= 100, 'El total del documento debería ser al menos 100');

    // Editar el detalle: cantidad 2
    await editarCantidadPrimerDetalle(page, '2');
    await esperarTotal(page, total => total >= 200 && total > totalInicial, 'El total del documento debería ser al menos 200');

    // Eliminar el detalle: el total vuelve a 0
    await eliminarPrimerDetalle(page);
    await esperarTotal(page, total => total === 0, 'El total del documento debería ser 0');

    // Cambiar el tercero y guardar
    await page.locator('#Documento_Tercero .dx-lookup-field').first().click();
    await filtrarPor(page, TERCERO);
    // Por el código: el nombre trae doble espacio y según el combo se ve con uno o con dos
    await seleccionarOpcion(page, new RegExp(`^\\s*${TERCERO} -`));
    await guardarDocumento(page);

    // Recargar el documento y validar el tercero
    await page.locator('#txtDocumento .dx-texteditor-input').first().click();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await expect(page.locator('#Documento_Tercero').filter({ hasText: TERCERO }).first(), `El documento no quedó con el tercero ${TERCERO_TEXTO}`)
        .toBeVisible();

    // Eliminar el documento
    await page.locator('#BtnEliminarDocumento_btn span').filter({ hasText: 'Eliminar' }).first().click();
    await btnConfirmarEliminar(page).first().click();
    await page.waitForTimeout(2000);

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}
/*
async function ejecutarPruebaUltimoDocumento(page, config) {
    await ingresarAplicacion(page, config);

    await nuevoDocumento(page);

    await page.locator('#lbl_documento_ultimo_documento').first().click();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    await editarCantidadPrimerDetalle(page, '2');
    await expect(page.locator(TOTAL_DOCUMENTO).first(), 'No se ve el total del documento').toBeVisible();
    await eliminarPrimerDetalle(page);

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}
*/
test.describe('Prueba Documentos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Último Documento - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaDocumentos(page, testAdminConfig);
    });
});
