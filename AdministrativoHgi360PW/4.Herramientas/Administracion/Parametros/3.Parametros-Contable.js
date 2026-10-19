import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
const DECIMALES = '5';
const FORMATO_VALOR = '5';
const FORMATO_VALOR_GUARDADO = 'n5';
const FORMATO_DOCUMENTO = '8 - Comprobante Contable';
const FORMATO_DOCUMENTO_TEXTO = 'Comprobante Contable';
const DECIMALES_RESTAURAR = '0';
const FORMATO_VALOR_RESTAURAR = '0';

async function ejecutarPrueba3ParametrosContable(page, config) {
    await ingresarAplicacion(page, config);
        await abrirHerramientas360(page, 'Parámetros');
        const frame = page.frameLocator('iframe[id^="iframe_tab_"]');
        await page.waitForTimeout(1500);
        await frame.locator('#tabs_parametros_Contable').first().click();
        await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
        //
        await frame.locator('#TxtPrm_Contable_IntInterfazLinea .dx-checkbox-icon').first().click();
        await frame.locator('#TxtPrm_Contable_IntConCuadra .dx-checkbox-icon').first().click();
        await frame.locator('#TxtPrm_Contable_IntDescuadreInterfaz .dx-checkbox-icon').first().click();
        //
        await frame.locator('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input'), DECIMALES, { reemplazar: false });
        await frame.locator('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input'), FORMATO_VALOR, { reemplazar: false });
        //
        await frame.locator('#TxtPrm_Contable_IntFormatoDocumentoCon div').filter({ hasText: FORMATO_DOCUMENTO_TEXTO }).nth(1).click();
    await seleccionarOpcion(frame, FORMATO_DOCUMENTO);
        await frame.locator('#BtnGuardar .dx-icon.dx-icon-save').first().click();
        await frame.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
        await page.waitForTimeout(2000);
        await frame.locator('#tabs_parametros_Contable').first().click();
        await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
        //Se validan los cambios
            const mensajeValidacion = 'No se guardó el cambio'
            await expect(frame.locator('#TxtPrm_Contable_IntInterfazLinea').first(), mensajeValidacion).toHaveAttribute('aria-checked', 'true');
            await expect(frame.locator('#TxtPrm_Contable_IntConCuadra').first(), mensajeValidacion).toHaveAttribute('aria-checked', 'true');
            await expect(frame.locator('#TxtPrm_Contable_IntDescuadreInterfaz').first(), mensajeValidacion).toHaveAttribute('aria-checked', 'true');
            //
            await expect(frame.locator('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(DECIMALES);
            await expect(frame.locator('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(FORMATO_VALOR_GUARDADO);
            //
            await expect(frame.locator('#TxtPrm_Contable_IntFormatoDocumentoCon .dx-lookup-field').first(), mensajeValidacion).toHaveText(FORMATO_DOCUMENTO_TEXTO);
        //Se restauran los valores
            await frame.locator('#TxtPrm_Contable_IntInterfazLinea .dx-checkbox-icon').first().click();
            await frame.locator('#TxtPrm_Contable_IntConCuadra .dx-checkbox-icon').first().click();
            await frame.locator('#TxtPrm_Contable_IntDescuadreInterfaz .dx-checkbox-icon').first().click();
            //
            await frame.locator('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input').first().click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');
            await escribir(frame.locator('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input'), DECIMALES_RESTAURAR, { reemplazar: false });
            await frame.locator('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input').first().click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');
            await escribir(frame.locator('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input'), FORMATO_VALOR_RESTAURAR, { reemplazar: false });
            //
            await frame.locator('#TxtPrm_Contable_IntFormatoDocumentoCon div').filter({ hasText: FORMATO_DOCUMENTO_TEXTO }).nth(1).click();
    await seleccionarOpcion(frame, FORMATO_DOCUMENTO);
            await frame.locator('#BtnGuardar .dx-icon.dx-icon-save').first().click();
            await frame.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
            await page.waitForTimeout(2000);
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('3.Parametros-Contable - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parametros Contable ERP POS - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba3ParametrosContable(page, testAdminConfig);
    });
});

test.describe('3.Parametros-Contable - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parametros Contable ERP POS - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba3ParametrosContable(page, hgiAdminConfig);
    });
});
