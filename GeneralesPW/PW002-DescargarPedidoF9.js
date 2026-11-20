import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    btnConfirmarDialogo,
    cerrarPestana360,
    cerrarSesion360,
    escribir,
    esVisible,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    textoExacto,
    TX_DOCUMENTO,
    TX_DOCUMENTO_TEXTO
} from '../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Documentos (test.hgi360.com, AutAdmin): crea un pedido (transacción 07), lo descarga con F9
// en una factura 01FE, valida que la factura traiga el valor y el IVA del pedido y elimina la factura y el pedido.
// El total NO se compara: la 01FE suma cargos propios de la transacción (Valor parámetro 1 = 0,5 y redondeo),
// p. ej. pedido 11,9 y factura 13 (revisado el 09-nov-2026).
const TX_PEDIDO = '07';
const TX_PEDIDO_TEXTO = '07 - PEDIDOS';
const TERCERO_PEDIDO = '222222222222';
const PRODUCTO_PEDIDO = '01';
const CANTIDAD_PEDIDO = '1';
const VALOR_UNITARIO_PEDIDO = '10';

const VALOR_DOCUMENTO = '#txtDocumento_Valor .dx-texteditor-input';
const IVA_DOCUMENTO = '#txtDocumento_Iva .dx-texteditor-input';
const TOTAL_DOCUMENTO = '#txtDocumento_Total .dx-texteditor-input';
const numeroDocumento = page => page.locator('#txtDocumento .dx-texteditor-input').first();
// Los totales se recalculan unos segundos después de grabar la línea o de cargar el pedido
const ESPERA_TOTALES = 15000;

/** Valor decimal de un campo numérico ("1.234,500000000" -> 1234.5). */
async function valorCampo(page, selector) {
    const texto = await page.locator(selector).first().inputValue();
    return Number(String(texto).replace(/[$\s.]/g, '').replace(',', '.')) || 0;
}

/** Espera hasta que el campo cumpla la condición y devuelve su valor. */
async function esperarCampo(page, selector, cumple, mensaje) {
    const inicio = Date.now();
    let valor = await valorCampo(page, selector);
    while (!cumple(valor) && Date.now() - inicio < ESPERA_TOTALES) {
        await page.waitForTimeout(500);
        valor = await valorCampo(page, selector);
    }
    expect(cumple(valor), `${mensaje} (valor actual: ${valor})`).toBeTruthy();
    return valor;
}

/**
 * Con el formulario en blanco (después de Nuevo o de Eliminar) la app valida el tercero por defecto y,
 * unos segundos después, abre "Validación tercero"; mientras está abierta bloquea F9 y los clics.
 */
async function cerrarValidacionTercero(page) {
    const cancelar = page.locator('#Documento_ModalValidacionDIAN_BtnCancelar').filter({ visible: true });
    if (await esVisible(cancelar, 8000)) {
        await cancelar.first().click();
        await expect(cancelar, 'No se cerró la validación del tercero').toHaveCount(0, { timeout: 10000 });
    }
}

/** Movimientos > Documentos > Nuevo con la transacción indicada. */
async function nuevoDocumento(page, transaccion, transaccionTexto) {
    await abrirMovimientos360(page, 'Documentos');
    await expect(page.locator('.erp-page-skeleton-toolbar').filter({ visible: true })).toHaveCount(0, { timeout: 20000 });
    await page.locator('#BtnNuevoDocumento .dx-button-content').first().click();
    await expect(page.locator('#Documento_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de nuevo documento')
        .toBeVisible({ timeout: 15000 });
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await filtrarPor(page, transaccion);
    await seleccionarOpcion(page, textoExacto(transaccionTexto));
}

/** Crea el pedido. Anota su número en `creados` apenas se graba el encabezado (para limpiarlo si algo falla). */
async function crearPedido(page, creados) {
    await nuevoDocumento(page, TX_PEDIDO, TX_PEDIDO_TEXTO);
    await page.locator('#Documento_Tercero .dx-lookup-field').first().click();
    await filtrarPor(page, TERCERO_PEDIDO);
    await seleccionarOpcion(page, new RegExp(`^\\s*${TERCERO_PEDIDO} -`));
    await page.locator('#BtnGuardarDocumento_btn').filter({ visible: true }).first().click();
    await expect(numeroDocumento(page), 'El pedido no quedó con número').not.toHaveValue('', { timeout: 15000 });
    creados.pedido = await numeroDocumento(page).inputValue();

    // Al confirmar el producto la app lo carga, reinicia cantidad/valor y pasa el foco a Cantidad
    // (la transacción 07 no tiene columna Remesa): se espera eso antes de escribir cantidad y valor.
    const producto = page.locator('#txtDocumento_Detalle_Producto_cursor_1');
    await escribir(producto, PRODUCTO_PEDIDO);
    await producto.press('Enter');
    await expect(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), `No terminó de cargar el producto ${PRODUCTO_PEDIDO}`)
        .toBeFocused({ timeout: 10000 });
    await page.waitForTimeout(500);
    await escribir(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), CANTIDAD_PEDIDO);
    await escribir(page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1'), VALOR_UNITARIO_PEDIDO);
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon-save').first().click();

    const total = await esperarCampo(page, TOTAL_DOCUMENTO, valor => valor > 0, 'El total del pedido quedó en 0');
    const pedido = {
        numero: creados.pedido,
        valor: await valorCampo(page, VALOR_DOCUMENTO),
        iva: await valorCampo(page, IVA_DOCUMENTO),
        total
    };
    await cerrarPestana360(page);
    return pedido;
}

/** En la factura nueva, F9 abre "Cargar pedido". Justo después de Nuevo el formulario puede ignorar la tecla: se reintenta. */
async function abrirCargarPedido(page) {
    const aceptarPedido = page.locator('#Btn_Documento_Pedido_Aceptar_btn').filter({ visible: true });
    // Con el navegador visible, si la ventana no es la activa del sistema el campo no recibe el foco ni la tecla
    await page.bringToFront();
    for (let intento = 0; intento < 3 && !await esVisible(aceptarPedido); intento++) {
        await numeroDocumento(page).click();
        await numeroDocumento(page).focus();
        await page.waitForTimeout(1500);
        await numeroDocumento(page).press('F9');
        await esVisible(aceptarPedido, 5000);
    }
    await expect(aceptarPedido.first(), 'F9 no abrió "Cargar pedido"').toBeVisible();
    await expect(page.locator('span').filter({ hasText: 'Cargar pedido' }).filter({ visible: true }).first()).toBeVisible();
    return aceptarPedido;
}

async function eliminarDocumentoAbierto(page, numero, descripcion) {
    await page.locator('#BtnEliminarDocumento_btn').filter({ visible: true }).first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await expect(numeroDocumento(page), `No se eliminó ${descripcion} ${numero}`).toHaveValue('', { timeout: 15000 });
}

/** Abre el documento por número (validando que sea del tercero del pedido) y lo elimina. */
async function eliminarDocumento(page, transaccion, transaccionTexto, numero, descripcion) {
    await nuevoDocumento(page, transaccion, transaccionTexto);
    await cerrarValidacionTercero(page);
    await escribir(numeroDocumento(page), numero);
    await numeroDocumento(page).press('Enter');
    await expect(numeroDocumento(page), `No cargó ${descripcion} ${numero}`).toHaveValue(numero, { timeout: 15000 });
    await expect(page.locator('#Documento_Tercero').filter({ hasText: TERCERO_PEDIDO }).first(),
        `${descripcion} ${numero} no es del tercero ${TERCERO_PEDIDO}: no se elimina`).toBeAttached({ timeout: 15000 });
    await eliminarDocumentoAbierto(page, numero, descripcion);
    await cerrarValidacionTercero(page);
    await cerrarPestana360(page);
}

/** Si la prueba falla a mitad de camino, borra lo que alcanzó a crear (primero la factura, después el pedido). */
async function limpiarCreados(page, creados) {
    const pendientes = [
        creados.factura && [TX_DOCUMENTO, TX_DOCUMENTO_TEXTO, creados.factura, 'la factura'],
        creados.pedido && [TX_PEDIDO, TX_PEDIDO_TEXTO, creados.pedido, 'el pedido']
    ].filter(Boolean);
    for (const [transaccion, transaccionTexto, numero, descripcion] of pendientes) {
        try {
            await page.keyboard.press('Escape');
            await eliminarDocumento(page, transaccion, transaccionTexto, numero, descripcion);
        } catch (error) {
            console.log(`No se pudo eliminar ${descripcion} ${numero}: bórrelo a mano (${error.message.split('\n')[0]})`);
        }
    }
}

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);
    const creados = {};
    try {
        const pedido = await crearPedido(page, creados);

        // Factura 01FE: descargar el pedido con F9
        await nuevoDocumento(page, TX_DOCUMENTO, TX_DOCUMENTO_TEXTO);
        await cerrarValidacionTercero(page);
        const aceptarPedido = await abrirCargarPedido(page);
        await expect(page.locator('#Documento_Transaccion_Pedido').first(), 'La transacción del pedido no es 07 - PEDIDOS')
            .toContainText(TX_PEDIDO_TEXTO);
        await expect(page.locator('#Documento_Inicial_Pedido .dx-texteditor-input').first(),
            `"Cargar pedido" no propone el pedido creado (${pedido.numero})`).toHaveValue(pedido.numero);
        await aceptarPedido.first().click();
        const aceptar = page.locator('button').filter({ hasText: textoExacto('Aceptar') }).filter({ visible: true });
        await expect(aceptar.first(), 'No apareció la confirmación de la carga del pedido').toBeVisible({ timeout: 15000 });
        await aceptar.first().click();

        await expect(numeroDocumento(page), 'La factura no quedó con número').not.toHaveValue('', { timeout: 15000 });
        creados.factura = await numeroDocumento(page).inputValue();
        await expect(page.locator('#Documento_Tercero').first(), 'La factura no quedó con el tercero del pedido')
            .toContainText(TERCERO_PEDIDO);
        await esperarCampo(page, VALOR_DOCUMENTO, valor => valor === pedido.valor,
            `El valor de la factura (${creados.factura}) no es igual al del pedido (${pedido.numero}: ${pedido.valor})`);
        await esperarCampo(page, IVA_DOCUMENTO, iva => iva === pedido.iva,
            `El IVA de la factura (${creados.factura}) no es igual al del pedido (${pedido.numero}: ${pedido.iva})`);
        console.log(`Pedido ${pedido.numero}: total ${pedido.total} | Factura ${creados.factura}: total ${await valorCampo(page, TOTAL_DOCUMENTO)}`);

        // Eliminar la factura y después el pedido (con la factura viva el pedido queda descargado)
        await eliminarDocumentoAbierto(page, creados.factura, 'la factura');
        delete creados.factura;
        await cerrarValidacionTercero(page);
        await cerrarPestana360(page);
        await eliminarDocumento(page, TX_PEDIDO, TX_PEDIDO_TEXTO, pedido.numero, 'el pedido');
        delete creados.pedido;
    } catch (error) {
        await limpiarCreados(page, creados);
        throw error;
    }

    await cerrarSesion360(page);
}

test.describe('Prueba Descargar Pedido con F9 - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Descargar pedido con F9 en factura y comparar valores - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig);
    });
});
