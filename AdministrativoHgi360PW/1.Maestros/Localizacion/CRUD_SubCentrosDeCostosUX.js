import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// SubCentro de Costo - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'SubCentro de Costo',
    grupo: 'localizacion',
    grid: 'gridSubCentrosCostos',
    guardar: 'BtnActualizarSubCentroCosto_btn',
    campoCodigo: 'txtSubCentroCosto_Codigo',
    codigo: 'QASCC1',
    crear: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('Prueba SUBCENTROS DE COSTO - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba SUBCENTROS DE COSTO Test Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
