import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro55 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// El nombre del menú (Parametro55) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro55',
    grupo: 'productos',
    grid: 'gridProdParametro5',
    guardar: 'BtnGuardarProdParametro5_btn',
    campoCodigo: 'txtProdParametro5_Id',
    codigo: 'QAPP5',
    crear: [
        { id: 'txtProdParametro5_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro5_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

test.describe('Prueba CRUD_ParametroProducto5', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD_ParametroProducto5 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
