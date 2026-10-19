import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_FORMATO = '1973';
const TIPO_FORMATO = '1 - Documentos';
const DESCRIPCION = 'midesc';
const TIPO_ANEXO = '2 - Pago';
const TRANSACCION_PRUEBA = '01 - FACTURA DE VENTA ELECTRÓNICA';
const DOCUMENTO_PRUEBA = '10203040';
const DESCRIPCION_EDIT = 'minuevadesc';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
    await page.waitForTimeout(3000);

    await abrirHerramientas360(page, 'Formatos');
    await page.locator('#gridFormatos .dx-button-content').nth(1).click();
    await escribir(page.locator('#txtIntIdFormato'), CODIGO_FORMATO, { reemplazar: false });
    await page.locator('#txtFormato_TipoFormato .dx-lookup-field').first().click();
    await seleccionarOpcion(page, TIPO_FORMATO);
    await escribir(page.locator('#txtFormato_Descripcion .dx-texteditor-input'), DESCRIPCION, { reemplazar: false });
    await page.locator('#txtFormatosNet_ImprimeAnexo span').filter({ hasText: 'Imprime anexo' }).first().click();
    await page.locator('#txtFormato_TipoAnexo div').filter({ hasText: 'Pago' }).nth(1).click();
    await seleccionarOpcion(page, TIPO_ANEXO);
    await page.locator('#txtFormato_TransaccionPrueba .dx-lookup-field').first().click();
    await seleccionarOpcion(page, TRANSACCION_PRUEBA);
    await escribir(page.locator('#txtFormato_DocumentoPrueba .dx-texteditor-input'), DOCUMENTO_PRUEBA, { reemplazar: false });
    await page.locator('#BtnGuardarFormato span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Cancelar' }).first().click();

    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Formatos');
    await escribir(page.locator('#gridFormatos .dx-texteditor-input'), CODIGO_FORMATO, { reemplazar: false });
    await expect(page.locator('#gridFormatos td').filter({ hasText: CODIGO_FORMATO }).first(), 'no se creó el formato').toBeAttached();
    await page.waitForTimeout(1000);
    await page.locator('#gridFormatos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(2).click();
    await page.locator('#txtFormato_Descripcion .dx-texteditor-input').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator('#txtFormato_Descripcion .dx-texteditor-input'), DESCRIPCION_EDIT, { reemplazar: false });
    await page.locator('#BtnGuardarFormato div').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('button').filter({ hasText: 'Cancelar' }).first().click();
    await page.waitForTimeout(3000);
    await eliminarRegistroDesdeGrid(page, '#gridFormatos');
    await page.locator('#gridFormatos .dx-icon.dx-icon-refresh').first().click();
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Formatos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parametros - Formatos - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Formatos - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parametros - Formatos - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
