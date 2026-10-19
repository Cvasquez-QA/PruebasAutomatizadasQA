import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const TRANSACCION = '01 - FACTURA DE VENTA ELECTRÓNICA';
const GRUPO = '10';
const MENSAJE_PROCESO_FINALIZADO = 'Proceso finalizado.';

async function ejecutarPruebaHerramientasContabilidad(page, config) {
    await ingresarAplicacion(page, config);
        await abrirHerramientas360(page, 'Contabilidad');
        // La lista del lookup se abre dentro del iframe: seleccionarOpcion recibe el frame
        const frame = page.frameLocator('iframe[id^="iframe_tab_"]').first();
        await page.waitForTimeout(1500);
        //
        await frame.locator('#TxtContabilidad_Transaccion .dx-lookup-field').first().click();
    await seleccionarOpcion(frame, TRANSACCION);
        //await frame.locator('#txtContabilidad_Grupo .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(frame.locator('#txtContabilidad_Grupo .dx-texteditor-input'), GRUPO, { reemplazar: false });
        await frame.locator('#BtnContabilidad_Generar span').filter({ hasText: 'Generar' }).first().click();
        await expect(frame.locator('#swal2-content').first(), 'Ocurrió algun error').toHaveText(MENSAJE_PROCESO_FINALIZADO);
        await frame.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Herramientas-Contabilidad - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Contabilidad - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaHerramientasContabilidad(page, testAdminConfig);
    });
});

test.describe('Herramientas-Contabilidad - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Contabilidad - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaHerramientasContabilidad(page, hgiAdminConfig);
    });
});
