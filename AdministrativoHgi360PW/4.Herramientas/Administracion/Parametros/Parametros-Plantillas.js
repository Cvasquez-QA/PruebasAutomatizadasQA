import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

const TIPO_PLANTILLA = 'Nómina';
const NOMBRE_PLANTILLA = 'pruebaNomina';
const MENSAJE_PLANTILLA = 'pruebaMensajeNomina';
const MENSAJE_PLANTILLA_EDIT = 'nuevoMensajepruebaNomina';

/** Elige una opción de la lista desplegable abierta dentro del iframe de la pestaña. */
async function seleccionarOpcionEnFrame(frame, texto) {
    await frame.locator('.dx-overlay-content')
        .filter({ visible: true })
        .locator('.dx-item-content')
        .filter({ hasText: texto })
        .first()
        .click();
}

async function ejecutarPruebaParametrosPlantillas(page, config) {
    // El contenido de la pestaña Parámetros se carga dentro de este iframe
    const frame = page.locator('iframe[id^="iframe_tab_"]').first().contentFrame();
    const inputPlantillas = n => frame.locator('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(n);

    await ingresarAplicacion(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.waitForTimeout(1500);
    await page.waitForTimeout(3000);
    await frame.locator('#tabs_parametros_Plantilla').first().click();
    await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-icon.dx-icon-edit-button-addrow').first().click();
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon').nth(1).click();
    await seleccionarOpcionEnFrame(frame, TIPO_PLANTILLA);
    await escribir(inputPlantillas(4), NOMBRE_PLANTILLA, { reemplazar: false });
    await escribir(inputPlantillas(5), MENSAJE_PLANTILLA, { reemplazar: false });
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
    await page.waitForTimeout(2000);
    //'Consultar Parametro - Plantilla';
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await frame.locator('#tabs_parametros_Plantilla').first().click();
    await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcionEnFrame(frame, TIPO_PLANTILLA);
    await escribir(inputPlantillas(1), NOMBRE_PLANTILLA, { reemplazar: false });
    await page.waitForTimeout(2000);
    await expect(frame.locator('#gridParametrosGeneralesPlantillas td').filter({ hasText: NOMBRE_PLANTILLA }).first(), 'El registro existe').toBeAttached();
    //'Editar Parametro - Plantilla';
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await frame.locator('#tabs_parametros_Plantilla').first().click();
    await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcionEnFrame(frame, TIPO_PLANTILLA);
    await escribir(inputPlantillas(1), NOMBRE_PLANTILLA, { reemplazar: false });
    await page.waitForTimeout(2000);
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon').first().click();
    await inputPlantillas(5).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(inputPlantillas(5), MENSAJE_PLANTILLA_EDIT, { reemplazar: false });
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-link.dx-link-save.dx-icon-save.dx-link-icon').first().click();
    await frame.locator('#PanelParametrosGenerales div').filter({ hasText: 'Guardar' }).first().click();
    //'Eliminar Parametro - Plantilla';
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await frame.locator('#tabs_parametros_Plantilla').first().click();
    await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcionEnFrame(frame, TIPO_PLANTILLA);
    await escribir(inputPlantillas(1), NOMBRE_PLANTILLA, { reemplazar: false });
    await page.waitForTimeout(2000);
    await frame.locator('#gridParametrosGeneralesPlantillas .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon').first().click();
    await frame.locator('span').filter({ hasText: 'Sí' }).first().click();
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Parametros-Plantillas - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Crear Parámetro - Plantilla - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaParametrosPlantillas(page, testAdminConfig);
    });
});

test.describe('Parametros-Plantillas - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Crear Parámetro - Plantilla - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaParametrosPlantillas(page, hgiAdminConfig);
    });
});
