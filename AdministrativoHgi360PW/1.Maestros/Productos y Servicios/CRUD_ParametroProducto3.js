import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro33 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// El nombre del menú (Parametro33) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro33',
    grupo: 'productos',
    grid: 'gridProdParametro3',
    guardar: 'BtnGuardarProdParametro3_btn',
    campoCodigo: 'txtProdParametro3_Id',
    codigo: 'QAPP3',
    crear: [
        { id: 'txtProdParametro3_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro3_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

test.describe('Prueba CRUD_ParametroProducto3', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD_ParametroProducto3 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
