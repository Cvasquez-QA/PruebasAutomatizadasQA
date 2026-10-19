import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_PERFIL = '0001';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Perfiles');
        await escribir(page.locator('#gridPerfiles .dx-texteditor-input'), CODIGO_PERFIL, { reemplazar: false });
        await page.waitForTimeout(3000);
        await expect(page.locator('#gridPerfiles td').filter({ hasText: CODIGO_PERFIL }).first(), 'El perfil no existe').toBeAttached();
        await eliminarRegistroDesdeGrid(page, '#gridPerfiles');

        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Herramientas Perfiles - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Herramientas - Eliminar Registros - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Herramientas Perfiles - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Herramientas - Eliminar Registros - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
