import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Centro de Costo - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Centro de Costo',
    grupo: 'localizacion',
    grid: 'gridCentrosCostos',
    guardar: 'BtnActualizarCentroCosto_btn',
    campoCodigo: 'txtCentroCosto_Codigo',
    codigo: 'QACC1',
    crear: [
        { id: 'txtCentroCosto_Descripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtCentroCosto_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('Prueba CENTROS DE COSTO - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CENTROS DE COSTO Test Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
