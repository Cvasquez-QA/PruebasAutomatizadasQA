import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro66 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// El nombre del menú (Parametro66) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro66',
    grupo: 'productos',
    grid: 'gridProdParametro6',
    guardar: 'BtnGuardarProdParametro6_btn',
    campoCodigo: 'txtProdParametro6_Id',
    codigo: 'QAPP6',
    crear: [
        { id: 'txtProdParametro6_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro6_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

test.describe('Prueba CRUD_ParametroProducto6', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD_ParametroProducto6 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
