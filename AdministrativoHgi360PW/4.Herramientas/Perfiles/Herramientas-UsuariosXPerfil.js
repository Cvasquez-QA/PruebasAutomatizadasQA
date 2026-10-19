import { test } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    selectorOpcion,
    existe
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const PERFIL = '0001 - MiNuevaDescPerfilQA2';
const USUARIO = 'H11';
const USUARIO_TEXTO = 'H11 - H11';
const FILTRO_USUARIO = 'h11';

async function ejecutarPruebaUsuariosXPerfil(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Usuarios X Perfil');
        await page.locator('#txtUsuariosPerfil_Perfil .dx-lookup-field').first().click();
    await seleccionarOpcion(page, PERFIL);
        await page.locator('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow').first().click();
        await page.locator('#gridUsuariosPerfil .dx-dropdowneditor-icon').nth(2).click();
        await page.waitForTimeout(6000);
    await seleccionarOpcion(page, USUARIO);
        await page.locator('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
        await page.waitForTimeout(3000);
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(3000);

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Usuarios X Perfil');
        await page.locator('#txtUsuariosPerfil_Perfil .dx-lookup-field').first().click();
    await seleccionarOpcion(page, PERFIL);
        await page.locator('#gridUsuariosPerfil .dx-texteditor-input').first().click();
        await page.waitForTimeout(9000);
    await seleccionarOpcion(page, USUARIO_TEXTO);
        await page.waitForTimeout(9000);
        await page.locator('#gridUsuariosPerfil .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon').first().click();
        await page.locator('#gridUsuariosPerfil .dx-checkbox-icon').first().click();
        await page.locator('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(9000);

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Usuarios X Perfil');
        await page.locator('#txtUsuariosPerfil_Perfil .dx-lookup-field').first().click();
    await seleccionarOpcion(page, PERFIL);
        await page.locator('#gridUsuariosPerfil .dx-texteditor-input').first().click();
        await page.waitForTimeout(3000);
    await seleccionarOpcion(page, USUARIO_TEXTO);
        await page.waitForTimeout(3000);
        await page.locator('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon').first().click();
        await page.locator('span').filter({ hasText: 'Sí' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

async function ejecutarPruebaPermisosDesdePestaAUsuario(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Usuarios X Perfil');
        await page.locator('#txtUsuariosPerfil_Perfil_Usuario .dx-radiobutton-icon').nth(1).click();
        await page.locator('#txtUsuariosPerfil_Usuario .dx-lookup-field').first().click();

            await filtrarPor(page, FILTRO_USUARIO);
            await page.waitForTimeout(200);
    await seleccionarOpcion(page, USUARIO_TEXTO);
                var existePerfil = existe(selectorOpcion(page, PERFIL));
            if(!existePerfil){
                await page.locator('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow').first().click();
                await page.locator('#gridUsuariosPerfil .dx-texteditor-input').nth(2).click();
    await seleccionarOpcion(page, PERFIL);
                await page.locator('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
                await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
                await page.waitForTimeout(2000);

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Usuarios X Perfil');
        await page.locator('#txtUsuariosPerfil_Perfil_Usuario .dx-radio-value-container').nth(1).click();
                await page.locator('#txtUsuariosPerfil_Usuario .dx-lookup-field').first().click();
                await page.waitForTimeout(2000);
    await seleccionarOpcion(page, USUARIO_TEXTO);
                await page.waitForTimeout(2000);
                await page.locator('#gridUsuariosPerfil .dx-texteditor-input').first().click();
    await seleccionarOpcion(page, PERFIL);
                 await page.locator('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon').first().click();
                 await page.locator('div').filter({ hasText: 'Sí' }).nth(9).click();
                 await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
            }
            await page.waitForTimeout(3000);
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Herramientas Permisos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Herramientas - Usuarios x Perfil - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaUsuariosXPerfil(page, testAdminConfig, ingresarAplicacion);
    });

    test('Prueba Permisos desde pestaña Usuario - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaPermisosDesdePestaAUsuario(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Herramientas Permisos - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Herramientas - Usuarios x Perfil - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaUsuariosXPerfil(page, hgiAdminConfig, ingresarAplicacion);
    });

    test('Prueba Permisos desde pestaña Usuario - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaPermisosDesdePestaAUsuario(page, hgiAdminConfig, ingresarAplicacion);
    });
});
