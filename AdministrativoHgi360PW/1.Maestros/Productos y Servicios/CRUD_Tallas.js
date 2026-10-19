import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tallas - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Tallas',
    grupo: 'productos',
    grid: 'gridTallas',
    guardar: 'BtnGuardarTallas_btn',
    campoCodigo: 'txtTallas_StrIdTalla',
    codigo: 'QATAL1',
    crear: [
        { id: 'txtTallas_StrDescripcion', valor: 'descTalla' },
        { id: 'txtTallas_IntOrden', valor: '87' }
    ],
    editar: [
        { id: 'txtTallas_StrDescripcion', valor: 'nuevaDescTalla' },
        { id: 'txtTallas_IntOrden', valor: '5' }
    ],
    validarEditado: 'nuevaDescTalla'
};

test.describe('CRUD_Tallas - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Tallas mierp - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
