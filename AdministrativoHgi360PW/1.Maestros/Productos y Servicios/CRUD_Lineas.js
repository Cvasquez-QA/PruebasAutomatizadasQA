import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Lineas - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Lineas',
    grupo: 'productos',
    grid: 'gridLineas',
    guardar: 'BtnGuardarLinea_btn',
    campoCodigo: 'txtIdLinea',
    codigo: 'QALIN1',
    crear: [
        { id: 'txtLineas_Descripcion', valor: 'MiDescripciónLinea' }
    ],
    editar: [
        { id: 'txtLineas_Descripcion', valor: 'MiNuevaDescripciónLinea' }
    ],
    validarEditado: 'MiNuevaDescripciónLinea'
};

test.describe('Prueba Lineas - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Líneas Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
