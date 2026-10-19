import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Transacciones - test.hgi360.com (Maestros > configuracion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Transacciones',
    grupo: 'configuracion',
    grid: 'gridTransacciones',
    guardar: 'BtnGuardarTransaccion',
    campoCodigo: 'TxtTransaccion_Codigo',
    codigo: 'QAT01',
    crear: [
        { id: 'TxtTransaccion_Descripcion', valor: 'midesctransaccion' }
    ],
    editar: [
        { id: 'TxtTransaccion_Descripcion', valor: 'minuevadesc' }
    ],
    validarEditado: 'minuevadesc'
};

test.describe('Prueba CRUD Transaccion - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Transaccion Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
