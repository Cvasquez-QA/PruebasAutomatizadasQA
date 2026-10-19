import { test } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const PERFIL = '0001 - MiNuevaDescPerfilQA2';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Permisos X Perfil');
        await page.waitForTimeout(3000);
        await page.locator('#PermisosPerfil_Perfil .dx-lookup-field').first().click();
    await seleccionarOpcion(page, PERFIL);
        await page.waitForTimeout(3000);
        await page.locator('#treeListOpcionesPermisosPerfil .dx-treelist-empty-space.dx-treelist-collapsed').first().click();
        await page.locator('#Consultar_23 .dx-checkbox-icon').first().click();
        await page.locator('#Editar_23101 .dx-checkbox-icon').first().click();
        await page.locator('#Crear_23102 .dx-checkbox-icon').first().click();
        await page.locator('#Eliminar_231023 .dx-checkbox-icon').first().click();
        await page.locator('#Anular_23103 .dx-checkbox-icon').first().click();
        await page.locator('#Imprimir_23104 .dx-checkbox-icon').first().click();
        await page.locator('#Gestion_23105 .dx-checkbox-icon').first().click();
        await page.locator('#Servicios_23106 .dx-checkbox-icon').first().click();
        await page.locator('#BtnGuardarPermisosPerfil span').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Herramientas Permisos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Herramientas - Permisos x Perfil - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Herramientas Permisos - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Herramientas - Permisos x Perfil - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
