import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    existe,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const ANO = '2023';
const VALOR_ADMIN = '01';
const VALOR_ADMIN_EDIT = '12';
const VALOR_CONTABLE = '02';
const VALOR_CONTABLE_EDIT = '13';
const SALARIO_MINIMO = '800000';
const AUX_TRANSPORTE = '1000';
const VALOR_UVT = '50000';
const PENSION = '10';
const SALUD = '7';
const CCF = '1';
const IBCF = '9825';
const SENA = '78';
const ESAP = '99';
const MIN_EDU = '55';
const PENSION_E = '78';
const SALUD_E = '54';
const MENSAJE_CODIGO_EXISTENTE = 'Ya existe un registro con el código ingresado.';

async function ejecutarPruebaValidaciNValoresAOPorDefecto(page, config, ingresar) {
    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parametros Año');
    await page.locator('#gridParametrosAno .dx-icon.dx-icon-add').first().click();
    await escribir(page.locator('#txtParametrosAno_Año').nth(1), ANO, { reemplazar: false });
    await page.locator('#BtnCargarParametrosAno div').filter({ hasText: 'Cargar' }).first().click();
    await page.waitForTimeout(3000);
    if (await existe(page.locator('.swal2-content div'))) {
        let existeMensaje = await page.locator('.swal2-content div').first().innerText();
        if (existeMensaje == MENSAJE_CODIGO_EXISTENTE) {
            await page.waitForTimeout(2000);
            await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
            await cerrarPestana360(page);
            await abrirHerramientas360(page, 'Parametros Año');
            await escribir(page.locator('#gridParametrosAno .dx-texteditor-input'), ANO, { reemplazar: false });
            await page.waitForTimeout(2000);
            await eliminarRegistroDesdeGrid(page, '#gridParametrosAno');

            await cerrarPestana360(page);
            await abrirHerramientas360(page, 'Parametros Año');
            await page.locator('#gridParametrosAno .dx-icon.dx-icon-add').first().click();
            await escribir(page.locator('#txtParametrosAno_Año').nth(1), ANO, { reemplazar: false });
            await page.locator('#BtnCargarParametrosAno div').filter({ hasText: 'Cargar' }).first().click();
            await page.waitForTimeout(3000);
        }
    }
    const admin = page.locator('#txtParametrosAno_Adm .dx-texteditor-input');
    let valorCampo = await admin.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const contable = page.locator('#txtParametrosAno_Con .dx-texteditor-input');
    valorCampo = await contable.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const salarioMinimo = page.locator('#txtParametrosAno_SalaMini .dx-texteditor-input');
    valorCampo = await salarioMinimo.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '').replace(',', '.');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const auxTrans = page.locator('#txtParametrosAno_AuxTransporte .dx-texteditor-input');
    valorCampo = await auxTrans.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '').replace(',', '.');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const valorUVT = page.locator('#txtParametrosAno_ValorUVT .dx-texteditor-input');
    valorCampo = await valorUVT.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '').replace(',', '.');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    //'Tarifas de Seguridad Social'
    const pension = page.locator('#txtParametrosAno_Pension .dx-texteditor-input');
    valorCampo = await pension.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const salud = page.locator('#txtParametrosAno_Salud .dx-texteditor-input');
    valorCampo = await salud.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const ccf = page.locator('#txtParametrosAno_Ccf .dx-texteditor-input');
    valorCampo = await ccf.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const ibcf = page.locator('#txtParametrosAno_Ibcf .dx-texteditor-input');
    valorCampo = await ibcf.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const sena = page.locator('#txtParametrosAno_Sena .dx-texteditor-input');
    valorCampo = await sena.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);
    //Deben estar en 0
    const esap = page.locator('#txtParametrosAno_Esap .dx-texteditor-input');
    valorCampo = await esap.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toEqual(0);
    //Deben estar en 0
    const minEdu = page.locator('#txtParametrosAno_MinEdu .dx-texteditor-input');
    valorCampo = await minEdu.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toEqual(0);
    //Empleados
    const pensionE = page.locator('#txtParametrosAno_PensionE .dx-texteditor-input');
    valorCampo = await pensionE.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const saludE = page.locator('#txtParametrosAno_SaludE .dx-texteditor-input');
    valorCampo = await saludE.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);
    await page.waitForTimeout(3000);
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

/** Vacía el campo que tiene el foco (Ctrl+A, Backspace) y escribe el valor al final del campo indicado. */
async function limpiarYEscribir(page, selector, valor) {
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator(selector), valor, { reemplazar: false });
}

async function ejecutarPruebaCRUDParametrosAO(page, config, ingresar) {
    await ingresar(page, config);
    await abrirHerramientas360(page, 'Parametros Año');
    await page.locator('#gridParametrosAno .dx-icon.dx-icon-add').first().click();
    await escribir(page.locator('#txtParametrosAno_Año .dx-texteditor-input'), ANO, { reemplazar: false });
    await page.locator('#BtnCargarParametrosAno div').filter({ hasText: 'Cargar' }).first().click();
    await page.waitForTimeout(2000);
    await page.locator('#txtParametrosAno_Adm .dx-texteditor-input').first().click();
    await limpiarYEscribir(page, '#txtParametrosAno_Adm .dx-texteditor-input', VALOR_ADMIN);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Con .dx-texteditor-input', VALOR_CONTABLE);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_SalaMini .dx-texteditor-input', SALARIO_MINIMO);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_AuxTransporte .dx-texteditor-input', AUX_TRANSPORTE);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_ValorUVT .dx-texteditor-input', VALOR_UVT);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Pension .dx-texteditor-input', PENSION);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Salud .dx-texteditor-input', SALUD);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Ccf .dx-texteditor-input', CCF);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Ibcf .dx-texteditor-input', IBCF);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Sena .dx-texteditor-input', SENA);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Esap .dx-texteditor-input', ESAP);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_MinEdu .dx-texteditor-input', MIN_EDU);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_PensionE .dx-texteditor-input', PENSION_E);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_SaludE .dx-texteditor-input', SALUD_E);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parametros Año');
    await escribir(page.locator('#gridParametrosAno .dx-texteditor-input'), ANO, { reemplazar: false });
    await page.waitForTimeout(2000);
    await expect(page.locator('#gridParametrosAno td').filter({ hasText: ANO }).first(), 'No se creó el registro').toBeAttached();
    await page.locator('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1).click();
    await page.waitForTimeout(2000);
    await limpiarYEscribir(page, '#txtParametrosAno_Adm .dx-texteditor-input', VALOR_ADMIN_EDIT);
    await page.keyboard.press('Enter');
    await limpiarYEscribir(page, '#txtParametrosAno_Con .dx-texteditor-input', VALOR_CONTABLE_EDIT);
    await page.locator('#BtnGuardarParametrosAno span').filter({ hasText: 'Guardar' }).first().click();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parametros Año');
    await escribir(page.locator('#gridParametrosAno .dx-texteditor-input'), ANO, { reemplazar: false });
    await page.waitForTimeout(2000);
    await expect(page.locator('#gridParametrosAno td').filter({ hasText: ANO }).first(), 'No se ha creado el registro').toBeAttached();
    // Se edita el registro
    await page.locator('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1).click();
    await page.waitForTimeout(2000);
    await page.waitForTimeout(3000);
    const admin = page.locator('#txtParametrosAno_Adm .dx-texteditor-input');
    let valorCampo = await admin.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const contable = page.locator('#txtParametrosAno_Con .dx-texteditor-input');
    valorCampo = await contable.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const salarioMinimo = page.locator('#txtParametrosAno_SalaMini .dx-texteditor-input');
    valorCampo = await salarioMinimo.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const auxTrans = page.locator('#txtParametrosAno_AuxTransporte .dx-texteditor-input');
    valorCampo = await auxTrans.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const valorUVT = page.locator('#txtParametrosAno_ValorUVT .dx-texteditor-input');
    valorCampo = await valorUVT.first().inputValue();
    valorCampo = valorCampo.replace(/\./g, '');
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    //'Tarifas de Seguridad Social'
    const pension = page.locator('#txtParametrosAno_Pension .dx-texteditor-input');
    valorCampo = await pension.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const salud = page.locator('#txtParametrosAno_Salud .dx-texteditor-input');
    valorCampo = await salud.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const ccf = page.locator('#txtParametrosAno_Ccf .dx-texteditor-input');
    valorCampo = await ccf.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const ibcf = page.locator('#txtParametrosAno_Ibcf .dx-texteditor-input');
    valorCampo = await ibcf.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const sena = page.locator('#txtParametrosAno_Sena .dx-texteditor-input');
    valorCampo = await sena.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const esap = page.locator('#txtParametrosAno_Esap .dx-texteditor-input');
    valorCampo = await esap.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const minEdu = page.locator('#txtParametrosAno_MinEdu .dx-texteditor-input');
    valorCampo = await minEdu.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);
    //Empleados
    const pensionE = page.locator('#txtParametrosAno_PensionE .dx-texteditor-input');
    valorCampo = await pensionE.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);

    const saludE = page.locator('#txtParametrosAno_SaludE .dx-texteditor-input');
    valorCampo = await saludE.first().inputValue();
    valorCampo = valorCampo.replace('%', '').replace(',', '.');
    valorCampo = parseFloat(valorCampo);
    expect(Number(valorCampo), 'El valor es menor o igual a 0').toBeGreaterThan(0);
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parametros Año');
    await escribir(page.locator('#gridParametrosAno .dx-texteditor-input'), ANO, { reemplazar: false });
    await page.waitForTimeout(2000);
    //Se elimina el registro
    await page.locator('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-delete dx"]').first().click();
    await page.keyboard.press('Enter');
    await page.locator('#gridParametrosAno .dx-icon.dx-icon-refresh').first().click();
    await page.waitForTimeout(2000);
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba ParametrosAño - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba validación valores año por defecto - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaValidaciNValoresAOPorDefecto(page, testAdminConfig, ingresarAplicacion);
    });

    test('Prueba CRUD ParametrosAño - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaCRUDParametrosAO(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba ParametrosAño - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba validación valores año por defecto - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaValidaciNValoresAOPorDefecto(page, hgiAdminConfig, ingresarAplicacion);
    });

    test('Prueba CRUD ParametrosAño - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaCRUDParametrosAO(page, hgiAdminConfig, ingresarAplicacion);
    });
});
