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

const FILTRO_TX = '01';
const TX_DOCUMENTO = '01H - FACTURA DE VENTA ELECTRÓNICA';
const FILTRO_TERCERO = 'hgi';
const TERCERO = '811021438 - HGI S.A.S - HGI S.A.S';
const PRODUCTO = '02';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirMovimientos360(page, 'Documentos');
        await page.locator('#ListagridDocumentos .dx-icon.dx-icon-add').first().click();
        await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
        await page.waitForTimeout(3000);
    
        await filtrarPor(page, FILTRO_TX);
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TX_DOCUMENTO);
    await page.locator('#txtDocumento').first().click();
    await escribir(page.locator('#txtDocumento'), config.docFacturaE, { reemplazar: false });
    await page.locator('#Documento_Tercero .dx-lookup-field').first().click();
    
        await filtrarPor(page, FILTRO_TERCERO);
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TERCERO);
    await page.locator('#txtDocumento_Fecha_Vence .dx-texteditor-input').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator('#txtDocumento_Fecha_Vence .dx-texteditor-input'), config.fecha, { reemplazar: false });
    await page.locator('#BtnGuardarDocumento span').filter({ hasText: 'Guardar' }).first().click();
    await page.waitForTimeout(3000);
    
        await cerrarPestana360(page);
        await page.locator('a').filter({ hasText: 'Facturación Electrónica' }).first().click();
        await page.locator('span').filter({ hasText: 'FACTURA E' }).first().click();
        await page.locator('#Documentos_Electronicos_Transaccion .dx-lookup-field').first().click();
    
        await filtrarPor(page, FILTRO_TX);
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TX_DOCUMENTO);
    await page.locator('#DocumentosElectronicosConsultaController span').filter({ hasText: 'Cargar' }).first().click();
    await page.waitForTimeout(2000);
    await escribir(page.locator('#ListagridDocumentosElectronicos .dx-texteditor-input'), config.docFacturaE, { reemplazar: false });
    await page.waitForTimeout(2000);
    await expect(page.locator('#ListagridDocumentosElectronicos td').filter({ hasText: config.docFacturaE }).first(),
        'no existe el documento').toBeAttached();
    
        await cerrarPestana360(page);
        await abrirMovimientos360(page, 'Documentos');
        await page.locator('#ListagridDocumentos .dx-texteditor-input').nth(1).click();
        await escribir(page.locator('#ListagridDocumentos .dx-texteditor-input').nth(1), config.docFacturaE, { reemplazar: false });
        await page.waitForTimeout(3000);
        await page.locator('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').first().click();
        await page.waitForTimeout(2000);
        await escribir(page.locator('#txtDocumento_Detalle_Producto_cursor_1'), PRODUCTO, { reemplazar: false });
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        await page.locator('#BtnGuardarDocumento div').filter({ hasText: 'Guardar' }).first().click();
    
        await cerrarPestana360(page);
        await page.locator('a').filter({ hasText: 'Facturación Electrónica' }).first().click();
        await page.locator('span').filter({ hasText: 'FACTURA E' }).first().click();
        await page.locator('#Documentos_Electronicos_Transaccion .dx-lookup-field').first().click();
    
        await filtrarPor(page, FILTRO_TX);
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TX_DOCUMENTO);
    await page.locator('#DocumentosElectronicosConsultaController span').filter({ hasText: 'Cargar' }).first().click();
    await page.waitForTimeout(2000);
    await escribir(page.locator('#ListagridDocumentosElectronicos .dx-texteditor-input'), config.docFacturaE, { reemplazar: false });
    await page.waitForTimeout(2000);
    await page.locator('#ListagridDocumentosElectronicos td').filter({ hasText: config.docFacturaE }).first().click();
    await page.locator('#BtnEnvioDian span').filter({ hasText: 'ENVIAR' }).first().click();
    await page.waitForTimeout(5000);
    await page.locator('#tabs_documento_Consulta').first().click();
    await page.locator('#tabs_documento_electronico_content_Consulta span').filter({ hasText: 'Consultar' }).first().click();
    await page.waitForTimeout(5000);
    await expect(page.locator('#ListagridDocumentosElectronicosEnviados td').filter({ hasText: config.docFacturaE }).first(),
        'No se encontró el documento enviado').toBeAttached();
    
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba FacturaE - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Factura E Admin Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba FacturaE - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Factura E Admin Hgi360 - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
