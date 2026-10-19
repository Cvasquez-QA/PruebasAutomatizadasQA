import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_PERFIL = '0001';
const DESCRIPCION = 'MiDescPerfilQA';
const DESCRIPCION_EDIT = 'MiNuevaDescPerfilQA2';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Perfiles');
                await eliminarRegistroSiExiste(page, '#gridPerfiles', CODIGO_PERFIL);
        await page.waitForTimeout(2000);
        await page.locator('#gridPerfiles .dx-icon.dx-icon-add').first().click();
        await page.waitForTimeout(2000);
        await escribir(page.locator('#txtIdPerfilesfocus'), CODIGO_PERFIL, { reemplazar: false });
        await escribir(page.locator('#txtDescripcionPerfil .dx-texteditor-input'), DESCRIPCION, { reemplazar: false });
        await page.locator('#BtnGuardarPerfiles span').filter({ hasText: 'Guardar' }).first().click();

        await cerrarPestana360(page);
        //Se edita el perfil
        await abrirHerramientas360(page, 'Perfiles');
        await escribir(page.locator('#gridPerfiles .dx-texteditor-input'), CODIGO_PERFIL, { reemplazar: false });
        await page.waitForTimeout(3000);
        await expect(page.locator('#gridPerfiles td').filter({ hasText: CODIGO_PERFIL }).first()).toBeAttached();
        await page.waitForTimeout(2000);
        await page.locator('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1).click();
        await page.waitForTimeout(2000);
        await page.locator('#txtDescripcionPerfil .dx-texteditor-input').first().click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await escribir(page.locator('#txtDescripcionPerfil .dx-texteditor-input'), DESCRIPCION_EDIT, { reemplazar: false });
        await page.locator('#BtnGuardarPerfiles span').filter({ hasText: 'Guardar' }).first().click();

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Perfiles');
        await escribir(page.locator('#gridPerfiles .dx-texteditor-input'), CODIGO_PERFIL, { reemplazar: false });
        await page.waitForTimeout(3000);
        await eliminarRegistroDesdeGrid(page, '#gridPerfiles');
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Herramientas Perfiles - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Herramientas - CRUD Perfiles - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Herramientas Perfiles - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Herramientas - CRUD Perfiles - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
