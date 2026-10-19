import { test } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const USUARIO_TEXTO = 'MiUsuarioQA - NombreMiUsuarioQA';
const TRANSACCION = 'FACTURA DE VENTA ELECTRÓNICA';
const GENERAL = 'General';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Permisos X Usuario');
        await page.waitForTimeout(2000);
        await page.locator('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field').first().click();
        await page.keyboard.press('m');
        await page.keyboard.press('i');
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, USUARIO_TEXTO);
        await page.locator('#treeListOpcionesPermisos .dx-treelist-empty-space.dx-treelist-collapsed').first().click();
        await page.locator('#Consultar_23 .dx-checkbox-icon').first().click();
        await page.locator('#Editar_23101 .dx-checkbox-icon').first().click();
        await page.locator('#Crear_23102 .dx-checkbox-icon').first().click();
        await page.locator('#Eliminar_231023 .dx-checkbox-icon').first().click();
        await page.locator('#Anular_23103 .dx-checkbox-icon').first().click();
        await page.locator('#Imprimir_23104 .dx-checkbox-icon').first().click();
        await page.locator('#Gestion_23105 .dx-checkbox-icon').first().click();
        await page.locator('#Servicios_23106 .dx-checkbox-icon').first().click();
        await page.waitForTimeout(2000);
        await page.locator('#tabs_UsuariosPermisos_extras').first().click();
        await page.locator('#grid_opc_extras_usuario .dx-icon.dx-icon-edit-button-addrow').first().click();
        await page.locator('#grid_opc_extras_usuario .dx-dropdowneditor-icon').nth(10).click();
    await seleccionarOpcion(page, TRANSACCION);
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').first().click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(1).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(2).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(3).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(4).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(5).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(6).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(7).click();
        await page.locator('#grid_opc_extras_usuario .dx-dropdowneditor-icon').nth(11).click();
    await seleccionarOpcion(page, GENERAL);
        await page.locator('#grid_opc_extras_usuario .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
        await page.waitForTimeout(2000);
        await page.locator('#BtnGuardarPermisosUsuario span').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Permisos X Usuario');
        await page.locator('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field').first().click();
        await page.keyboard.press('m');
        await page.keyboard.press('i');
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, USUARIO_TEXTO);
        await page.locator('#tabs_UsuariosPermisos_extras').first().click();
        await page.locator('#tabs_UsuariosPermisos_content_extras .nav.nav-tabs').first().click();
        await page.keyboard.press('Enter');
        await page.locator('#grid_opc_extras_usuario .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon').first().click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').first().click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(1).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(2).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(3).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(4).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(5).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(6).click();
        await page.locator('#grid_opc_extras_usuario .dx-checkbox-icon').nth(7).click();
        await page.locator('#grid_opc_extras_usuario .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
        await page.locator('#BtnGuardarPermisosUsuario span').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();

        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Permisos X Usuario');
        await page.locator('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field').first().click();
        await page.keyboard.press('m');
        await page.keyboard.press('i');
        await page.waitForTimeout(2000);
    await seleccionarOpcion(page, USUARIO_TEXTO);
        await page.locator('#tabs_UsuariosPermisos_extras').first().click();
        await page.locator('#tabs_UsuariosPermisos_content_extras .nav.nav-tabs').first().click();
        await page.keyboard.press('Enter');
        await page.locator('#grid_opc_extras_usuario .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon').first().click();
        await page.locator('span').filter({ hasText: 'Sí' }).first().click();
        await page.locator('#BtnGuardarPermisosUsuario span').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(3000);
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Permisos x Usuario - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba crear permisos x usuario - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Permisos x Usuario - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba crear permisos x usuario - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
