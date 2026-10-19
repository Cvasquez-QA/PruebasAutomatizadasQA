import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_USUARIO = 'MiUsuarioQA';
const NOMBRE = 'NombreMiUsuarioQA';
const CORREO = 'MICORREO@gmail.COM';
const CORREO_SUFIJO_EDIT = '.co';
const VENDEDOR = '0 - GENERAL';
const CLAVE = '123';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Usuarios');
        await eliminarRegistroSiExiste(page, '#gridUsuarios', CODIGO_USUARIO);
        await page.waitForTimeout(2000);
        await page.locator('#gridUsuarios .dx-icon.dx-icon-add').first().click();
        await escribir(page.locator('#StrIdUsuario'), CODIGO_USUARIO, { reemplazar: false });
        await escribir(page.locator('#Gestion_Usuario_Nombre'), NOMBRE, { reemplazar: false });
        await escribir(page.locator('#txtUsuarios_StrMail .dx-texteditor-input'), CORREO, { reemplazar: false });
        await page.locator('#txtUsuario_Activo .dx-checkbox-icon').first().click();
        await page.locator('#Usuarios_Vendedor .dx-lookup-field').first().click();
    await seleccionarOpcion(page, VENDEDOR);
        await escribir(page.locator('#txtUsuarios_StrClave_cursor_'), CLAVE, { reemplazar: false });
        await page.locator('#BtnGuardarUsuario div').filter({ hasText: 'Guardar' }).first().click();
        await page.waitForTimeout(3000);

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Usuarios');
        await page.locator('.dx-texteditor-input-container .dx-texteditor-input').first().click();
        await escribir(page.locator('#gridUsuarios .dx-texteditor-input'), CODIGO_USUARIO, { reemplazar: false });
        await page.waitForTimeout(3000);
        await expect(page.locator('#gridUsuarios td').filter({ hasText: CODIGO_USUARIO }).first()).toBeAttached();
        await page.locator('#gridUsuarios [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1).click();
        await page.waitForTimeout(2000);
        await page.locator('#txtUsuarios_StrMail .dx-texteditor-input').first().click();
        await escribir(page.locator('#txtUsuarios_StrMail .dx-texteditor-input'), CORREO_SUFIJO_EDIT, { reemplazar: false });
        await page.locator('#BtnGuardarUsuario span').filter({ hasText: 'Guardar' }).first().click();
        await page.waitForTimeout(2000);
            /*
        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Usuarios');
        await escribir(page.locator('#gridUsuarios .dx-texteditor-input'), CODIGO_USUARIO, { reemplazar: false });
        await page.waitForTimeout(3000);
        await eliminarRegistroDesdeGrid(page, '#gridUsuarios');
            */
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Usuarios - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Usuarios - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Usuarios - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Usuarios - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
