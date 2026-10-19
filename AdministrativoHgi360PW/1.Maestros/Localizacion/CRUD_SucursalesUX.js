import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Sucursales - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Sucursales',
    grupo: 'localizacion',
    grid: 'gridSucursales',
    guardar: 'BtnActualizarSucursal_btn',
    campoCodigo: 'txtStrIdSucursal',
    codigo: 'QASUC1',
    crear: [
        { id: 'txtSucursales_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtSucursales_IntEstado', tipo: 'check' }
    ],
    editar: [
        { id: 'txtSucursales_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('Prueba Sucursales - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Sucursales Test Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
