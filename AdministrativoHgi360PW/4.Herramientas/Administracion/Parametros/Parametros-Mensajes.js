import { test } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

const TIPO_CORREO = 'Administrativo';
const CORREO_REMITENTE = 'CorreoRemitente';
const NOMBRE_REMITENTE = 'NombreRemitente';
const CUENTA = '123';
const EMAIL = 'mail';
const CORREO_REMITENTE_EDIT = 'NuevoCorreoRemitente';
const NOMBRE_REMITENTE_EDIT = 'NuevoNombreRemitente';
const CUENTA_EDIT = 'NuevaCuenta';
const EMAIL_EDIT = 'NuevoEmailccco';

async function ejecutarPrueba(page, config, ingresar) {
    const inputCorreos = n => page.locator('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(n);

    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.waitForTimeout(3000);
    await page.locator('#tabs_parametros_Mensajes').first().click();
    await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
    await page.locator('#ParametrosGeneralesCorreos .dx-icon.dx-icon-edit-button-addrow').first().click();
    await page.locator('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon').nth(1).click();
    await page.waitForTimeout(2000);
    await seleccionarOpcion(page, TIPO_CORREO);
    await escribir(inputCorreos(6), CORREO_REMITENTE, { reemplazar: false });
    await escribir(inputCorreos(7), NOMBRE_REMITENTE, { reemplazar: false });
    await escribir(inputCorreos(8), CUENTA, { reemplazar: false });
    await escribir(inputCorreos(9), EMAIL, { reemplazar: false });
    await page.locator('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
    await page.waitForTimeout(2000);
    await page.locator('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcion(page, TIPO_CORREO);
    await page.locator('#ParametrosGeneralesCorreos .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon').first().click();
    await inputCorreos(6).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(inputCorreos(6), CORREO_REMITENTE_EDIT, { reemplazar: false });
    await inputCorreos(7).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(inputCorreos(7), NOMBRE_REMITENTE_EDIT, { reemplazar: false });
    await inputCorreos(8).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(inputCorreos(8), CUENTA_EDIT, { reemplazar: false });
    await inputCorreos(9).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(inputCorreos(9), EMAIL_EDIT, { reemplazar: false });
    await page.locator('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
    await page.waitForTimeout(2000);
    await page.locator('#ParametrosGeneralesCorreos .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon').first().click();
    await page.locator('div').filter({ hasText: 'Sí' }).nth(9).click();
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Parámetros - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parámetros - Mensajes - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Parámetros - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parámetros - Mensajes - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
