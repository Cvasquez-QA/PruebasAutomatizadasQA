import { test, expect } from '@playwright/test';
import {
    abrirUtilitarios360,
    cerrarSesion360,
    filtrarPor,
    filtrarPorInput,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const BANCO = 'BANCOLOMBIA';
const ENTIDAD_FINANCIERA = 'BANCOLOMBIA';
const FILTRO_EMPLEADO = '1000099598';
const EMPLEADO = '1000099598';
const SUCURSAL = 'GENERAL';
const REGISTRO_EMPLEADO = '1000099598';

async function ejecutarPruebaDispersionFondos(page, config) {
    await ingresarAplicacion(page, config);
    await abrirUtilitarios360(page, 'Dispersión De Fondos');
    await page.locator('#txt_lista_DispersionFondoAd_Banco .dx-lookup-field').first().click();
    await seleccionarOpcion(page, BANCO);
    await page.locator('#txt_lista_DispersionFondoAd_Entidad div').filter({ hasText: 'Todos' }).nth(1).click();
    await seleccionarOpcion(page, ENTIDAD_FINANCIERA);
    await page.locator('#txt_lista_DispersionFondoAd_Empleado div').filter({ hasText: 'Todos' }).nth(1).click();
    await filtrarPorInput(page).first().click();

    await filtrarPor(page, FILTRO_EMPLEADO);
    await page.waitForTimeout(2000);
    await seleccionarOpcion(page, EMPLEADO);
    await page.locator('#txt_lista_DispersionFondoAd_Sucursal div').filter({ hasText: 'Todos' }).nth(1).click();
    await seleccionarOpcion(page, SUCURSAL);
    await page.locator('#txt_lista_DispersionFondoAd_cCosto div').filter({ hasText: 'Todos' }).nth(1).click();
    await seleccionarOpcion(page, SUCURSAL);
    await page.locator('#txt_lista_DispersionFondoAd_subcCosto div').filter({ hasText: 'Todos' }).nth(1).click();
    await seleccionarOpcion(page, SUCURSAL);
    await page.locator('#dispersionFondo_General .dx-checkbox-icon').first().click();
    await page.locator('#BtnConsultarDispersionFondos span').filter({ hasText: 'Consultar' }).first().click();
    await expect(page.locator('#dispersionFondo_GridConsignacionElectronica td').filter({ hasText: REGISTRO_EMPLEADO }).first(),
        'No se encontró el registro en el grid').toBeAttached();
    await page.locator('#dispersionFondo_MatricularCuentas .dx-checkbox-icon').first().click();
    await page.locator('#DispersionFondo_BtnGenerarPlano span').filter({ hasText: 'Generar plano' }).first().click();
    await page.waitForTimeout(5000);
    // await page.locator('#dispersionFondo_GridConsignacionElectronica .centrarTextoVerticalmente').nth(19).click();
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('DispersionFondos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Formatos - Nomina - Test Hgi360', async ({ page }) => {
        await ejecutarPruebaDispersionFondos(page, testAdminConfig);
    });
});

test.describe('DispersionFondos - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Formatos - Nomina - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaDispersionFondos(page, hgiAdminConfig);
    });
});
