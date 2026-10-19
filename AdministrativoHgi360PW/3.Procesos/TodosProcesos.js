import { test } from '@playwright/test';
import {
    cerrarPestana360,
    cerrarSesion360,
    abrirProcesos360,
    confirmarProceso,
    aceptarValidacionesSiExisten,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
    
        // CARTERA
        await abrirProcesos360(page, 'Cartera');
        await page.waitForTimeout(15000);
        await confirmarProceso(page);
    
        // PEDIDOS
        await abrirProcesos360(page, 'Pedidos');
        await page.waitForTimeout(5000);
        await confirmarProceso(page);

        // INVENTARIO
        await abrirProcesos360(page, 'Inventario');
        await page.waitForTimeout(3000);
        await page.locator('#ModalValidaciones button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(1500);
        await page.locator('#ModalValidaciones button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(1500);
        await confirmarProceso(page);
    

        // INVENTARIO CON SALDO INICIAL
        await abrirProcesos360(page, 'Inventario con saldo inicial');
        await page.waitForTimeout(15000);
        await page.locator('#ModalValidaciones button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(1500);
        await page.locator('#ModalValidaciones button').filter({ hasText: 'Aceptar' }).first().click();
        await page.waitForTimeout(1500);
        await confirmarProceso(page);
        await cerrarSesion360(page);
}

test.describe('Prueba Procesos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba ejecucion todos los procesos Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Prueba Procesos - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba ejecucion todos los procesos - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba(page, hgiAdminConfig, ingresarAplicacion);
    });
});
