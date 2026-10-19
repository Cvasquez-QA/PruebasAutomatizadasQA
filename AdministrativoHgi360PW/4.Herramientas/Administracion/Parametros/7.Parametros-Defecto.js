import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

const TIPO_TERCERO = '0 - GENERAL';
const FILTRO_TIPO_TERCERO = 'GENERAL';
const TIPO_ID = 'CC - Cedula de Ciudadania';
const TELEFONO = '123456';
const DIRECCION = 'cra5123565';
const COD_POSTAL = '050005 - 050005';
const COD_POSTAL_ESPERADO = '050005';
const EMAIL = 'miemail';
const VENDEDOR = '45 - HGI SAS';
const VENDEDOR_ESPERADO = 'HGI SAS';
const FILTRO_VENDEDOR = '45';
const CIUDAD = '01 - MEDELLIN';
const CIUDAD_ESPERADA = 'MEDELLIN';
const FILTRO_CIUDAD = 'MEDELL';
const SECTOR = '01 - INDUSTRIAL';
const SECTOR_ESPERADO = 'INDUSTRIAL';
const FILTRO_SECTOR = 'INDUSTR';
const BARRIO = '0 - GENERAL';
const BARRIO_ESPERADO = 'GENERAL';
const ENTIDAD = '02 - BANCOLOMBIA';
const ENTIDAD_ESPERADA = 'BANCOLOMBIA';
const FILTRO_ENTIDAD = '02';
const SUCURSAL = '01 - MEDELLIN';
const CCOSTO = '01 - ADMINISTRACION';
const CCOSTO_ESPERADO = 'ADMINISTRACION';
const SUB_CCOSTO = '01 - MEDELLIN';
const LINEA = '01 - ON PREMISE';
const LINEA_ESPERADA = 'ON PREMISE';
const FILTRO_LINEA = '01';
const GRUPO = '01 - ADMINISTRATIVO';
const GRUPO_ESPERADO = 'ADMINISTRATIVO';
const UNIDAD = 'Und - Unidad';
const UNIDAD_ESPERADA = 'Unidad';
const TARIFA_IVA = '16 - 19 %';
const TARIFA_IVA_ESPERADA = '19 %';
const FORMA_PAGO = '2 - Transferencia';
const FORMA_PAGO_ESPERADA = 'Transferencia';
const FILTRO_SUCURSAL = 'MEDELLIN';
const TIPO_TERCERO_ESPERADO = 'GENERAL';
const TIPO_ID_ESPERADO = 'CC - Cedula de Ciudadania';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
        await abrirHerramientas360(page, 'Parámetros');
        await page.waitForTimeout(3000);
        await page.locator('#tabs_parametros_Defecto').first().click();
        await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
        await page.waitForTimeout(2000);
        await page.locator('#txt_lista_PG_TipoTercero .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_TIPO_TERCERO);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, TIPO_TERCERO);
            await page.locator('#txt_lista_PG_TipoIdDefecto .dx-lookup-field').first().click();
    await seleccionarOpcion(page, TIPO_ID);
            await page.locator('#PG_TelefonoDef .dx-texteditor-input').first().click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');
            await escribir(page.locator('#PG_TelefonoDef .dx-texteditor-input'), TELEFONO, { reemplazar: false });
            await page.locator('#TxtParametrosGenerales_IntTerTelefonoDef .dx-checkbox-icon').first().click();
            await page.locator('#PG_DireccionDef .dx-texteditor-input').first().click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');
            await escribir(page.locator('#PG_DireccionDef .dx-texteditor-input'), DIRECCION, { reemplazar: false });
            await page.locator('#TxtParametrosGenerales_IntTerDireccionDef .dx-checkbox-icon').first().click();
            await page.locator('#txt_lista_PG_CodPostalDIANDef .dx-lookup-field').first().click();
    await seleccionarOpcion(page, COD_POSTAL);
            await page.locator('#TxtParametrosGenerales_IntTerCodPostalDef .dx-checkbox-icon').first().click();
            await page.locator('#txtPG_EmailFE .dx-texteditor-input').first().dblclick();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');
            await escribir(page.locator('#txtPG_EmailFE .dx-texteditor-input'), EMAIL, { reemplazar: false });
            await page.locator('#TxtParametrosGenerales_IntTerMailDef .dx-checkbox-icon').first().click();
            await page.locator('#txt_lista_PG_Vendedor .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_VENDEDOR);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, VENDEDOR);
            await page.locator('#txt_lista_PG_Ciudad .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_CIUDAD);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, CIUDAD);
            await page.locator('#txt_lista_PG_Sector .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_SECTOR);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, SECTOR);
            await page.locator('#txt_lista_PG_Barrio .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_TIPO_TERCERO);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, BARRIO);
            await page.locator('#txt_lista_PG_Entidad .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_ENTIDAD);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, ENTIDAD);
            await page.locator('#txt_lista_PG_Sucursal .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_SUCURSAL);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, SUCURSAL);
            await page.locator('#txt_lista_PG_CCosto .dx-lookup-field').first().click();
    await seleccionarOpcion(page, CCOSTO);
            await page.locator('#txt_lista_PG_SubCCosto .dx-lookup-field').first().click();
    await seleccionarOpcion(page, SUB_CCOSTO);
            await page.locator('#txt_lista_PG_Linea .dx-lookup-field').first().click();
    
            await filtrarPor(page, FILTRO_LINEA);
            await page.waitForTimeout(3000);
    await seleccionarOpcion(page, LINEA);
            await page.locator('#txt_lista_PG_Grupo .dx-lookup-field').first().click();
    await seleccionarOpcion(page, GRUPO);
            await page.locator('#txt_lista_PG_Unidad .dx-lookup-field').first().click();
    await seleccionarOpcion(page, UNIDAD);
            await page.locator('#txtPG_TarifaIva .dx-lookup-field').first().click();
    await seleccionarOpcion(page, TARIFA_IVA);
            await page.locator('#txtPG_FormasDePagoDef .dx-lookup-field').first().click();
    await seleccionarOpcion(page, FORMA_PAGO);
            await page.locator('#BtnGuardar div').filter({ hasText: 'Guardar' }).first().click();
            await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
            await page.waitForTimeout(2000);
    
        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Parámetros');
        await page.locator('#tabs_parametros_Defecto').first().click();
        await page.locator('#BtnEditar span').filter({ hasText: 'Editar' }).first().click();
        await page.waitForTimeout(2000);
        await expect(page.locator('#txt_lista_PG_TipoTercero .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(TIPO_TERCERO_ESPERADO);
        await expect(page.locator('#txt_lista_PG_TipoIdDefecto .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(TIPO_ID_ESPERADO);
        await expect(page.locator('#PG_TelefonoDef .dx-texteditor-input').first(), 'El sistema no guardó los cambios').toHaveValue(TELEFONO);
        await expect(page.locator('#PG_DireccionDef .dx-texteditor-input').first(), 'El sistema no guardó los cambios').toHaveValue(DIRECCION);
        await expect(page.locator('#txt_lista_PG_CodPostalDIANDef .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(COD_POSTAL_ESPERADO);
        await expect(page.locator('#txtPG_EmailFE .dx-texteditor-input').first(), 'El sistema no guardó los cambios').toHaveValue(EMAIL);
        await expect(page.locator('#txt_lista_PG_Vendedor .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(VENDEDOR_ESPERADO);
        await expect(page.locator('#txt_lista_PG_Ciudad .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(CIUDAD_ESPERADA);
        await expect(page.locator('#txt_lista_PG_Sector .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(SECTOR_ESPERADO);
        await expect(page.locator('#txt_lista_PG_Barrio .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(BARRIO_ESPERADO);
        await expect(page.locator('#txt_lista_PG_Entidad .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(ENTIDAD_ESPERADA);
        await expect(page.locator('#txt_lista_PG_Sucursal .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(CIUDAD_ESPERADA);
        await expect(page.locator('#txt_lista_PG_CCosto .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(CCOSTO_ESPERADO);
        await expect(page.locator('#txt_lista_PG_SubCCosto .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(CIUDAD_ESPERADA);
        await expect(page.locator('#txt_lista_PG_Linea .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(LINEA_ESPERADA);
        await expect(page.locator('#txt_lista_PG_Grupo .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(GRUPO_ESPERADO);
        await expect(page.locator('#txt_lista_PG_Unidad .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(UNIDAD_ESPERADA);
        await expect(page.locator('#txtPG_TarifaIva .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(TARIFA_IVA_ESPERADA);
        await expect(page.locator('#txtPG_FormasDePagoDef .dx-lookup-field').first(), 'El sistema no guardó los cambios').toHaveText(FORMA_PAGO_ESPERADA);
        await page.locator('#BtnGuardar div').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(2000);
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Parametros - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parametros - Defecto - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Parametros - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parametros - Defecto - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
