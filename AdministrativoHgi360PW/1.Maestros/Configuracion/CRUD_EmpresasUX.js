import { test, expect } from '@playwright/test';
import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    buscarEnGrid360,
    filaGrid360
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// test.hgi360.com (React): el grid es [data-testid="gridEmpresas"] (Maestros > Configuración).
const GRID = 'gridEmpresas';
const IDENTIFICACION = '811021438';

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
    await abrirMaestros360(page, 'Empresas');
    await buscarEnGrid360(page, GRID, IDENTIFICACION);
    await expect(filaGrid360(page, GRID, IDENTIFICACION).first(), `No se encontró la empresa con identificación ${IDENTIFICACION}`)
        .toBeAttached({ timeout: 15000 });
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Empresas - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Empresas Consulta Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});
