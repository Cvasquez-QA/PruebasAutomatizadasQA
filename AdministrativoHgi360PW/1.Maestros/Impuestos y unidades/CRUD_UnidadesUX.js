import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Unidades - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Unidades',
    grupo: 'impuestos',
    grid: 'gridUnidades',
    guardar: 'BtnGuardarUnidad_btn',
    campoCodigo: 'txtUnidad_Id',
    codigo: 'QAUN',
    crear: [
        { id: 'txtUnidad_Descripcion', valor: 'midescunidad' },
        { id: 'txtUnidad_Codigo_DIAN', tipo: 'lookup', filtro: '91', opcion: /^\s*91 -/ }
    ],
    editar: [
        { id: 'txtUnidad_Descripcion', valor: 'minuevadescunidad' },
        { id: 'txtUnidad_Codigo_DIAN', tipo: 'lookup', filtro: 'A1', opcion: /^\s*A1 -/ }
    ],
    validarEditado: 'minuevadescunidad'
};

test.describe('Prueba Unidades - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Unidades CRUD Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
