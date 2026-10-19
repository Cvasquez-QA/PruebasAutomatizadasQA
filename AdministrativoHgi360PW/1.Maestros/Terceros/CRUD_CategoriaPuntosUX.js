import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Categoria Puntos - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Categoria Puntos',
    grupo: 'terceros',
    grid: 'gridCategoriaPuntos',
    guardar: 'BtnGuardarCategoriaPuntos_btn',
    campoCodigo: 'txtCategoriaPuntos_StrIdCategoriaPuntos',
    codigo: 'QACPT1',
    crear: [
        { id: 'txtCategoriaPuntos_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtCategoriaPuntos_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('CRUD_CategoriaPuntosUX - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CATEGORIA PUNTOS testerp CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
