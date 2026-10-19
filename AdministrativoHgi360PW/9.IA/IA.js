import { test, expect } from '@playwright/test';
import {
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    escribir
} from '../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const CONSULTA_IA = 'hola';

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);
    await page.locator('a').filter({ hasText: /IA/ }).first().click();
    await page.locator('span').filter({ hasText: 'INTELIGENCIA ARTIFICIAL' }).first().click();
    await page.waitForTimeout(1500);
    const frame = page.frameLocator('iframe[id^="iframe_tab_"]').first();
    await page.waitForTimeout(1500);
    await escribir(frame.locator('#ConsultaIA .dx-texteditor-input'), CONSULTA_IA, { reemplazar: false });
    await frame.locator('#IAConsultar .dx-icon.dx-icon-arrowup').first().click();
    await page.waitForTimeout(5000);
    await expect(frame.locator('#RespuestaIA .text').nth(1)).toBeAttached();
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba IA - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Respuesta IA - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig);
    });
});

test.describe('Prueba IA - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Respuesta IA - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig);
    });
});
