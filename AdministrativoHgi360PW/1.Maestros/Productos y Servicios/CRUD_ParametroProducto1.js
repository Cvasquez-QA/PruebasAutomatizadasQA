import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro11 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// El nombre del menú (Parametro11) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro11',
    grupo: 'productos',
    grid: 'gridProdParametro1',
    guardar: 'BtnGuardarProdParametro1_btn',
    campoCodigo: 'txtProdParametro1_ID',
    codigo: 'QAPP1',
    crear: [
        { id: 'txtProdParametro1_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro1_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

test.describe('CRUD_ParametroProducto1 - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD ParametroProd1 miERP - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
