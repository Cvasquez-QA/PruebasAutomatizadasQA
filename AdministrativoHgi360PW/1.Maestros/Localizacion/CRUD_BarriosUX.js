import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Barrios - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Barrios',
    grupo: 'localizacion',
    grid: 'gridBarrios',
    guardar: 'BtnActualizarBarrio_btn',
    campoCodigo: 'txtBarrio_Codigo',
    codigo: 'QABAR1',
    crear: [
        { id: 'txtBarrio_Descripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtBarrio_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('Prueba BARRIOS - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba BARRIOS Test Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
