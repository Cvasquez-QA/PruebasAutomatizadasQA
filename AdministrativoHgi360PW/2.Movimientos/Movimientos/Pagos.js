import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    parseValorNumerico,
    textoExacto,
    escribir as escribirCampo,
    TX_DOCUMENTO,
    TERCERO,
    PRODUCTO
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Pagos - Recibo de caja (test.hgi360.com, empresa 8902)
 *  1. Crea una factura 01FE al tercero 1000099598 (producto 010203, 1 x 1000).
 *  2. Crea un recibo "01 - RECIBO DE CAJA", descarga la factura desde la cartera,
 *     registra el movimiento bancario por el total y valida diferencia 0.
 *  3. Guarda el recibo, lo elimina y elimina la factura.
 *
 * Selectores validados contra la versión React de test.hgi360.com.
 */

const TX_PAGO = '01 - RECIBO DE CAJA';
const FILTRO_TX_PAGO = 'RECIBO DE CAJA';
const FORMA_PAGO = '01';
const BANCO = '01';
const NATURALEZA = '1';
const CANTIDAD = '1';
const VALOR_UNITARIO = '1000';

const btnConfirmarDialogo = page => page.locator('button.swal2-confirm').filter({ visible: true });
const esqueleto = page => page.locator('.erp-page-skeleton-toolbar').filter({ visible: true });

/** Opción visible de un lookup cuyo texto empieza por el prefijo (p. ej. "1000099598 - ..."). */
const opcionQueEmpieza = (page, prefijo) => page.locator('.dx-overlay-content')
    .filter({ visible: true })
    .locator('.dx-item-content')
    .filter({ hasText: new RegExp(`^\\s*${prefijo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) });

/** Opción visible de un lookup con el texto exacto. */
const opcionExacta = (page, texto) => page.locator('.dx-overlay-content')
    .filter({ visible: true })
    .locator('.dx-item-content')
    .filter({ hasText: textoExacto(texto) });

async function elegirEnLookup(page, lookup, filtro, opcion) {
    await page.locator(`${lookup} .dx-lookup-field`).first().click();
    await filtrarPor(page, filtro);
    await expect(opcion.first(), `No apareció la opción buscada con "${filtro}" en ${lookup}`).toBeAttached({ timeout: 10000 });
    await opcion.first().click();
}

async function escribir(page, selector, valor) {
    await escribirCampo(page.locator(selector), String(valor));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
}

/* ----------------------------------------------------------------------------
 * Factura (Movimientos > Documentos)
 * --------------------------------------------------------------------------*/

async function abrirNuevoDocumento(page) {
    await abrirMovimientos360(page, 'Documentos');
    await expect(esqueleto(page)).toHaveCount(0, { timeout: 20000 });
    await page.locator('#BtnNuevoDocumento').filter({ visible: true }).first().click();
    await expect(page.locator('#Documento_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de documentos')
        .toBeVisible({ timeout: 15000 });
    await elegirEnLookup(page, '#Documento_Transaccion', TX_DOCUMENTO, opcionQueEmpieza(page, `${TX_DOCUMENTO} -`));
}

async function crearFactura(page) {
    await abrirNuevoDocumento(page);
    await elegirEnLookup(page, '#Documento_Tercero', TERCERO, opcionQueEmpieza(page, `${TERCERO} -`));

    // Encabezado
    await page.locator('#BtnGuardarDocumento_btn').first().click();
    await page.waitForTimeout(3000);

    // Detalle: producto, cantidad y valor unitario
    // Al confirmar el producto la app lo carga (~0,7 s), reinicia cantidad/valor y pasa el foco a Remesa
    await escribirCampo(page.locator('#txtDocumento_Detalle_Producto_cursor_1'), PRODUCTO);
    await page.keyboard.press('Enter');
    await expect(page.locator('#txtDocumento_Detalle_Producto_Remesa_1').first(), `No terminó de cargar el producto ${PRODUCTO}`)
        .toBeFocused({ timeout: 10000 });
    await page.waitForTimeout(500);
    await escribirCampo(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), CANTIDAD);
    await escribirCampo(page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1'), VALOR_UNITARIO);
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon-save').first().click();

    // El total se recalcula entre 2 y 5 s después de grabar la línea
    let valorDocumento = 0;
    for (const inicio = Date.now(); valorDocumento <= 0 && Date.now() - inicio < 15000;) {
        await page.waitForTimeout(500);
        valorDocumento = await parseValorNumerico(page, '#txtDocumento_Total .dx-texteditor-input');
    }
    expect(valorDocumento, 'El total de la factura quedó en 0').toBeGreaterThan(0);

    await page.locator('#BtnGuardarDocumento_btn').first().click();
    await page.waitForTimeout(4000);

    const numeroDocumento = await page.locator('#txtDocumento .dx-texteditor-input').first().inputValue();
    expect(numeroDocumento, 'La factura no quedó con número de documento').toBeTruthy();

    await cerrarPestana360(page);
    return { valorDocumento, numeroDocumento };
}

async function eliminarFactura(page, numeroDocumento) {
    await abrirNuevoDocumento(page);
    await escribirCampo(page.locator('#txtDocumento .dx-texteditor-input'), numeroDocumento);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await expect(page.locator('#Documento_Tercero').filter({ hasText: TERCERO }).first(), `No cargó la factura ${numeroDocumento} para eliminarla`)
        .toBeAttached();
    await page.locator('#BtnEliminarDocumento_btn').first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await page.waitForTimeout(3000);
    await cerrarPestana360(page);
}

/* ----------------------------------------------------------------------------
 * Recibo de caja (Movimientos > Pagos)
 * --------------------------------------------------------------------------*/

async function ejecutarPruebaPagos(page, config) {
    await ingresarAplicacion(page, config);

    const { valorDocumento, numeroDocumento } = await crearFactura(page);

    // Encabezado del recibo
    await abrirMovimientos360(page, 'Pagos');
    await expect(esqueleto(page)).toHaveCount(0, { timeout: 20000 });
    await page.locator('#BtnNuevoDocumentosPagoConsulta').first().click();
    await expect(page.locator('#TxtDocumentosPago_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de pagos')
        .toBeVisible({ timeout: 15000 });
    await elegirEnLookup(page, '#TxtDocumentosPago_Transaccion', FILTRO_TX_PAGO, opcionExacta(page, TX_PAGO));
    await elegirEnLookup(page, '#TxtDocumentosPago_Tercero', TERCERO, opcionQueEmpieza(page, `${TERCERO} -`));

    // Guardar el encabezado carga la cartera del tercero
    await page.locator('#BtnGrabarDocumentosPago').first().click();
    await page.waitForTimeout(4000);
    const numeroRecibo = await page.locator('#TxtDocumentosPago_Documento .dx-texteditor-input').first().inputValue();
    expect(numeroRecibo, 'El recibo no quedó con número de documento').toBeTruthy();

    // Descargar la factura desde la cartera.
    // La cartera del tercero tiene más de 100 líneas y la factura nueva queda muy abajo del área visible,
    // así que primero se filtra el grid con su buscador para que la línea quede de primera.
    await expect(page.locator('#gridCartera tr.dx-data-row').first(), 'No cargó la cartera del tercero')
        .toBeAttached({ timeout: 15000 });
    await escribirCampo(page.locator('#gridCartera .dx-datagrid-search-panel .dx-texteditor-input'), String(numeroDocumento));
    await page.waitForTimeout(2500);

    const filaCartera = page.locator('#gridCartera tr.dx-data-row')
        .locator('td')
        .filter({ hasText: textoExacto(String(numeroDocumento)) })
        .locator('xpath=ancestor::tr[1]')
        .nth(0);
    await expect(filaCartera, `No se encontró la factura ${numeroDocumento} en la cartera`).toBeAttached({ timeout: 15000 });
    await filaCartera.locator('[aria-label="Descargar Documento"]').first().click();
    await expect(page.locator('#gridDocumentos_DetallePago td').filter({ hasText: textoExacto(String(numeroDocumento)) }).first(),
        `La factura ${numeroDocumento} no pasó al detalle del recibo`).toBeAttached({ timeout: 10000 });

    // Movimiento bancario por el total de la factura
    await escribir(page, '#txtDocPago_Banco_FormaPago_cursor_1', FORMA_PAGO);
    await escribir(page, '#txtDocPago_Banco_Banco_cursor_1', BANCO);
    await escribir(page, '#txtdocumento_DocRef_pago_DocRef_cursor_1', numeroDocumento);
    await escribir(page, '#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA);
    await escribir(page, '#txtdocumento_banco_pago_Valor_cursor_1', valorDocumento);
    // El foco queda en el botón de guardar la línea bancaria: Enter la graba
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    const diferencia = await parseValorNumerico(page, '#TxtDocumentosPago_Diferencia .dx-texteditor-input');
    expect(diferencia, `La diferencia del pago debe ser 0 (quedó en ${diferencia})`).toEqual(0);

    // Guardar y eliminar el recibo
    await page.locator('#BtnGrabarDocumentosPago').first().click();
    await page.waitForTimeout(3000);
    await page.locator('#BtnAnularDocumentosPago').first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await page.waitForTimeout(3000);
    await expect(page.locator('#TxtDocumentosPago_Documento .dx-texteditor-input').first(), `No se eliminó el recibo ${numeroRecibo}`)
        .toHaveValue('');
    await cerrarPestana360(page);

    // Eliminar la factura
    await eliminarFactura(page, numeroDocumento);
    await cerrarSesion360(page);
}

test.describe('CRUD_Pagos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Pago - Recibo de Caja - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaPagos(page, testAdminConfig);
    });
});
