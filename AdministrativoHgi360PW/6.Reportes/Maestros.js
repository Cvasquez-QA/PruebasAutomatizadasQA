import { test, expect } from '@playwright/test';
import {
    abrirReportes360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const PLANTILLAS = [
    { nombre: 'Indicadores', nth: 0, validarDatos: false, waitMs: 10000 },
    { nombre: 'Terceros', nth: 1, validarDatos: true, waitMs: 12000 },
    { nombre: 'Productos', nth: 2, validarDatos: true, waitMs: 12000 },
];

/** Prefijo de controles de reporte varía por aplicativo (2350001, 2650001, etc.) */
const listaPlantillas = page => page.locator('[id$="_SlbListaPlantillas"]');
const btnGenerar = page => page.locator('[id$="_BtnGenerar"] span').filter({ hasText: 'Generar' });
const gridSinDatos = page => page.locator('[id$="_GridReportes"] span').filter({ hasText: 'Sin datos' });

async function generarReporte(page, { nombre, nth, validarDatos, waitMs }) {
    await listaPlantillas(page).first().click();

    const opcion =
        nth > 0
            ? page.locator('.dx-item.dx-list-item').nth(nth).locator('div').filter({ hasText: nombre })
            : page.locator('.dx-item.dx-list-item div').filter({ hasText: nombre });

    await opcion.first().click();
    await btnGenerar(page).first().click();

    if (waitMs > 0) {
        await page.waitForTimeout(waitMs);
    }

    if (validarDatos) {
        await expect(gridSinDatos(page).first(), `El reporte ${nombre} no devolvió datos`).toBeHidden();
    }
}

async function ejecutarPruebaMaestros(page, config, ingresar) {
    await ingresar(page, config);
    await abrirReportes360(page, 'Maestros');
    await page.waitForTimeout(6000);

    for (const plantilla of PLANTILLAS) {
        await generarReporte(page, plantilla);
    }

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Reportes Maestros - Test Happgi', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Reportes Maestros - Test Happgi', async ({ page }) => {
        await ejecutarPruebaMaestros(page, testAdminConfig, ingresarAplicacion);
    });
});

test.describe('Reportes Maestros - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Reportes Maestros - Hgi360 Admin', async ({ page }) => {
        await ejecutarPruebaMaestros(page, hgiAdminConfig, ingresarAplicacion);
    });
});
