import { test, expect } from '@playwright/test';
import {
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

async function ejecutarPruebaAyuda1(page, config) {
    await ingresarAplicacion(page, config);
        await page.waitForTimeout(3000);
        await page.locator('a').filter({ hasText: 'Ayuda' }).first().click();
        await page.waitForTimeout(2000);
        const [youtube] = await Promise.all([
            page.waitForEvent('popup'),
            page.locator('span').filter({ hasText: 'CANAL YOUTUBE' }).first().click()
        ]);
        await youtube.waitForTimeout(12000);
        await expect(youtube.locator('#page-header [class^="yt-core-attributed-string yt-core-attributed-strin"]').first(),
            'No se dirigió al canal de youtube de Hgi360').toBeAttached();
        await youtube.close();
        await cerrarSesion360(page);
}

async function ejecutarPruebaAyuda2(page, config) {
    await ingresarAplicacion(page, config);
        await page.locator('a').filter({ hasText: 'Ayuda' }).first().click();
        const [soporte] = await Promise.all([
            page.waitForEvent('popup'),
            page.locator('span').filter({ hasText: 'SOPORTE REMOTO' }).first().click()
        ]);
        await soporte.waitForTimeout(5000);
        await expect(soporte.locator('h3').filter({ hasText: 'Términos y condiciones para la conexión remota' }).first(),
            'No se dirigió al Apartado de Soporte Remoto de Hgi360').toBeAttached();
        await soporte.close();
        await cerrarSesion360(page);
}

async function ejecutarPruebaAyuda3(page, config) {
    await ingresarAplicacion(page, config);
                    //Se ingresa al maestro de ayuda
        //Documentacion
            await page.waitForTimeout(3000);
            await page.locator('#MenuPrincipal a').filter({ hasText: 'Ayuda' }).first().click();
            await page.waitForTimeout(2000);
            const [documentacion] = await Promise.all([
                page.waitForEvent('popup'),
                page.locator('#LinkManualUsuarioApp3 span').filter({ hasText: 'DOCUMENTACIÓN' }).first().click()
            ]);
            await documentacion.waitForTimeout(8000);
            await expect(documentacion.locator('main h1').filter({ hasText: 'Centro de ayuda Hgi360' }).first(),
                'No se dirigió al Centro de ayuda Hgi360').toBeAttached();
            await documentacion.close();
        await cerrarSesion360(page);
}

test.describe('Ayuda - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Redireccionamiento canal de Youtube testerp - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaAyuda1(page, testAdminConfig);
    });

    test('Prueba Conexion Remota testerp - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaAyuda2(page, testAdminConfig);
    });

    test('Prueba Documentacion - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaAyuda3(page, testAdminConfig);
    });
});

test.describe('Ayuda - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Redireccionamiento canal de Youtube Hgi360 Admin - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaAyuda1(page, hgiAdminConfig);
    });

    test('Prueba Conexion Remota Hgi360 Admin - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaAyuda2(page, hgiAdminConfig);
    });

    test('Prueba Documentacion - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaAyuda3(page, hgiAdminConfig);
    });
});
