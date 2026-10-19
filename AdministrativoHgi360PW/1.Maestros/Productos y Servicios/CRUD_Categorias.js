import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Categorias - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Categorias',
    grupo: 'productos',
    grid: 'gridCategoriasProd',
    guardar: 'BtnGuardarCategoriasProd_btn',
    campoCodigo: 'txtCategoriasProd_StrIdCategoria',
    codigo: 'QACAT1',
    crear: [
        { id: 'txtCategoriasProd_StrDescripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtMaestroCategorias_CodigoPadre', tipo: 'lookup', opcion: '0 - GENERAL' },
        { id: 'txtCategoriasProd_IntEstado', tipo: 'check' },
        { id: 'txtCategoriasProd_IntMenu', tipo: 'check' }
    ],
    editar: [
        { id: 'txtCategoriasProd_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('CRUD_Categorias - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CATEGORIAS testerp CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
