import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    escribir
} from '../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const TX_DOCUMENTO = '01FE';
const TERCERO = '811021438';
const PRODUCTO = '010203';

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);
    await abrirMovimientos360(page, 'Documentos');

    // Se crea el documento electrónico
    await page.waitForTimeout(2000);
    await page.locator('#ListagridDocumentos .dx-icon.dx-icon-add').first().click();
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await filtrarPor(page, TX_DOCUMENTO);
    await seleccionarOpcion(page, TX_DOCUMENTO);
    await page.locator('#Documento_Tercero .dx-lookup-field').first().click();
    await filtrarPor(page, TERCERO);
    await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TERCERO);

    await page.locator('#BtnGuardarDocumento .dx-icon.dx-icon-save').first().click();
    await page.waitForTimeout(3000);
    await escribir(page.locator('#txtDocumento_Detalle_Producto_cursor_1'), PRODUCTO, { reemplazar: false });
    await page.keyboard.press('Enter');
    await page.locator('#txtDocumento_Detalle_Cantidad_cursor_1').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), '1', { reemplazar: false });
    await page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1'), '1000', { reemplazar: false });
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check').first().click();
    await page.waitForTimeout(4000);
    await page.locator('#BtnGuardarDocumento .dx-icon.dx-icon-save').first().click();
    await page.waitForTimeout(7000);

    const numeroDocumento = await page.locator('#txtDocumento .dx-texteditor-input').first().inputValue();

    // Se envía el documento a la DIAN directamente desde el formulario de Documentos
    // (botón desplegable #BtnDian → opción "Enviar"), sin pasar por Facturación Electrónica > FACTURA E
    const opcionEnviar = page.locator('.dx-overlay-content').filter({ visible: true }).locator('div').filter({ hasText: 'Enviar' });

    await page.locator('#BtnDian .dx-icon.dx-icon-spindown').first().click();
    await page.waitForTimeout(1000);
    await opcionEnviar.first().click();
    await page.waitForTimeout(8000);

    // No debe quedar un mensaje de error tras el envío
    await expect(page.locator('.dx-toast-error'), 'El envío a la DIAN mostró un mensaje de error').toHaveCount(0);

    // El botón de imprimir se habilita una vez el documento fue enviado/aceptado por la DIAN
    const botonImprimir = page.locator('#BtnImprimirDocumento');
    const imprimirDeshabilitado = await botonImprimir.first().getAttribute('aria-disabled');
    expect(imprimirDeshabilitado, `El documento ${numeroDocumento} no quedó habilitado para imprimir tras el envío a la DIAN`).not.toEqual('true');

    // Verificación cruzada: el documento debe figurar como enviado en Facturación Electrónica > FACTURA E > Consultar
    await cerrarPestana360(page);
    await page.locator('a').filter({ hasText: 'Facturación Electrónica' }).first().click();
    await page.locator('span').filter({ hasText: 'FACTURA E' }).first().click();
    await page.locator('#Documentos_Electronicos_Transaccion .dx-lookup-field').first().click();
    await filtrarPor(page, TX_DOCUMENTO);
    await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TX_DOCUMENTO);
    await page.locator('#tabs_documento_Consulta').first().click();
    await page.locator('#tabs_documento_electronico_content_Consulta span').filter({ hasText: 'Consultar' }).first().click();
    await page.waitForTimeout(5000);
    await expect(page.locator('#ListagridDocumentosElectronicosEnviados td').filter({ hasText: numeroDocumento }).first(),
        `No se encontró el documento ${numeroDocumento} en los documentos enviados a la DIAN`).toBeAttached();

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Envío a la DIAN desde Documentos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Envío de documento a la DIAN desde Movimientos-Documentos - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig);
    });
});

test.describe('Prueba Envío a la DIAN desde Documentos - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Envío de documento a la DIAN desde Movimientos-Documentos - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig);
    });
});
