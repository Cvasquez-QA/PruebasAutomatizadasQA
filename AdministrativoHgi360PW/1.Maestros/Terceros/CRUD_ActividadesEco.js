import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Actividades Eco - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Actividades Eco',
    grupo: 'terceros',
    grid: 'gridActividadesEconomicas',
    guardar: 'BtnGuardarActividadEconomica_btn',
    campoCodigo: 'txtActividadEconomica_Id',
    codigo: 'QAACT1',
    crear: [
        { id: 'txtActividadEconomica_Descripcion', valor: 'descActividadEco' }
    ],
    editar: [
        { id: 'txtActividadEconomica_Descripcion', valor: 'nuevaDescActividadEco' }
    ],
    validarEditado: 'nuevaDescActividadEco'
};

test.describe('Prueba ActividadesEco - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD ActividadesEco Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
