import { test, expect } from '@playwright/test';
import {
    abrirMaestros360,
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const iframeTab = page => page.locator('iframe[id^="iframe_tab_"]').first().contentFrame();
const celdaSaldoBodega = page => page.locator('#gridProductosSaldos .dx-data-row td[aria-colindex="2"]');

const PRODUCTO = '010202';
const BODEGA = '0 - GENERAL';
const BODEGA_FILTRO = '0';
const valorTomaFisica = 10;
const TX_AJUSTE_ENTRADA = 'AJUSTE ENTRADA';
const TX_AJUSTE_SALIDA = 'AJUSTE SALIDA';
const FILTRO_AJUSTE = 'ajuste';
const FILTRO_SALIDA = 'salida';
const OBSERVACION_TOMA_FISICA = 'PruebaObs';

const parseNumeroTexto = texto => parseFloat(String(texto).replace(/\./g, '').replace(/,/g, '.')) || 0;

/** Abre la toma física y devuelve el iframe de la pestaña, donde está la pantalla. */
const abrirTomaFisica = async page => {
    await page.locator('a').filter({ hasText: 'Movimiento' }).first().click();
    await page.locator('span').filter({ hasText: 'INVENTARIO - TOMA FÍSICA' }).first().click();
    await page.waitForTimeout(1500);
    const frame = iframeTab(page);
    await page.waitForTimeout(1500);
    return frame;
};

const filtrarYEditarProducto = async page => {
    await escribir(page.locator('#gridProductos .dx-texteditor-input'), PRODUCTO, { reemplazar: false });
    await page.waitForTimeout(2000);
    await page.locator('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1).click();
};

const filtrarSaldoBodega = async page => {
    await page.locator('#gridProductosSaldos .dx-button-content').first().click();
    await escribir(page.locator('#gridProductosSaldos .dx-texteditor-input'), BODEGA_FILTRO, { reemplazar: false });
    await page.waitForTimeout(2000);
};

const obtenerSaldoProducto = async page => {
    const texto = await celdaSaldoBodega(page).first().innerText();
    return parseNumeroTexto(texto);
};

const seleccionarTransaccionAjuste = async (page, valorSaldoProducto) => {
    if (valorTomaFisica < valorSaldoProducto) {
        await filtrarPor(page, FILTRO_AJUSTE);
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TX_AJUSTE_ENTRADA);

    } else {
        await filtrarPor(page, FILTRO_SALIDA);
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TX_AJUSTE_SALIDA);

    }
};

const ingresarValorFisicoTomaFisica = async (page, frame, indice, valor) => {
    const campo = frame.locator(`#txtTomaFisica_Detalle_Fisico_cursor_${indice}`);

    await campo.first().click();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(campo, String(valor), { reemplazar: false });
    await page.keyboard.press('Enter');
};

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirMaestros360(page, 'Productos');
        await filtrarYEditarProducto(page);
        await filtrarSaldoBodega(page);

        const valorSaldoProducto = await obtenerSaldoProducto(page);

        await page.locator('#BtnGuardarProducto').first().click();
        await page.waitForTimeout(2000);

        await cerrarPestana360(page);
        const frame = await abrirTomaFisica(page);

        await frame.locator('#TomaFisica_Bodega .dx-lookup-field').first().click();
        await frame.locator('.dx-item.dx-list-item').filter({ hasText: BODEGA }).first().click();
        await frame.locator('#BtnEliminarTF div').filter({ hasText: 'Eliminar' }).first().click();
        await frame.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await frame.locator('#txtTomaFisica_Detalle_Producto_1 .dx-button-content').first().click();
        await escribir(frame.locator('#txtFiltroCodigo_'), PRODUCTO, { reemplazar: false });
        await frame.locator('td').filter({ hasText: PRODUCTO }).first().click();
        await page.keyboard.press('Enter');

        await ingresarValorFisicoTomaFisica(page, frame, 1, valorTomaFisica);

        await escribir(frame.locator('#txtTomaFisica_Detalle_Observaciones_1 .dx-texteditor-input'), OBSERVACION_TOMA_FISICA, { reemplazar: false });
        await frame.locator('#txtTomaFisica_Detalle_Boton_1 .dx-button-content').first().click();
        await frame.locator('#BtnFinalizarTF span').filter({ hasText: 'Finalizar' }).first().click();
        await expect(frame.locator('.swal2-content div').filter({ hasText: 'Se ha ejecutado el proceso de toma física correcta' }).first()).toBeAttached();
        await frame.locator('button').filter({ hasText: 'Aceptar' }).first().click();

        await cerrarPestana360(page);
        await abrirMovimientos360(page, 'Documentos');

        await page.locator('#ListagridDocumentos .dx-icon.dx-icon-add').first().click();
        await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();

        await seleccionarTransaccionAjuste(page, valorSaldoProducto);

        await page.locator('#Documento_Bodega .dx-lookup-field').first().click();
        await page.locator('.dx-item.dx-list-item').filter({ hasText: BODEGA }).first().click();
        await page.locator('#BtnGuardarDocumento div').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('#BtnAjuste span').filter({ hasText: 'AJUSTE' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await expect(page.locator('[class^="dx-overlay-content dx-toast-success dx-toast-conte"] div').filter({ hasText: 'Documento guardado con exito' }).first()).toBeAttached();

        await cerrarPestana360(page);
        await abrirMaestros360(page, 'Productos');
        await filtrarYEditarProducto(page);
        await filtrarSaldoBodega(page);

        const saldoFinal = await obtenerSaldoProducto(page);

        expect(saldoFinal).toEqual(valorTomaFisica);

        await page.locator('#BtnGuardarProducto').first().click();
        await page.waitForTimeout(2000);

        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Inventario - Toma Fisica - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Toma fisica y ajuste de inventario Admin - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Inventario - Toma Fisica - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Toma fisica y ajuste de inventario Admin - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
