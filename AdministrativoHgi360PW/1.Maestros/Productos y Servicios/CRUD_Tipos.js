import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tipos - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Tipos',
    grupo: 'productos',
    grid: 'gridTipos',
    guardar: 'BtnGuardarTipo_btn',
    campoCodigo: 'txtIdTipo',
    codigo: 'QATIP1',
    crear: [
        { id: 'txtTipo_Descripcion', valor: 'MiDescripcionTipo' }
    ],
    editar: [
        { id: 'txtTipo_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtMaestroTipo_Concepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' }
    ],
    validarEditado: 'minuevadescripcion'
};

test.describe('Prueba Tipos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Tipos Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
