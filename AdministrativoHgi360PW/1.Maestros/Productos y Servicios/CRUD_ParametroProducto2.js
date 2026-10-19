import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro22 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// El nombre del menú (Parametro22) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro22',
    grupo: 'productos',
    grid: 'gridProdParametro2',
    guardar: 'BtnGuardarProdParametro2_btn',
    campoCodigo: 'txtProdParametro2_Id',
    codigo: 'QAPP2',
    crear: [
        { id: 'txtProdParametro2_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro2_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

test.describe('Prueba CRUD_ParametroProducto2', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD_ParametroProducto2 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
