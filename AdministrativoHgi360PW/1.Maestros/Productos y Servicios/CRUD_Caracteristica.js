import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Característica - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Característica',
    grupo: 'productos',
    grid: 'gridCaracteristicas',
    guardar: 'BtnGuardarCaracteristicas_btn',
    campoCodigo: 'txtCaracteristicas_StrIdCaracteristica',
    codigo: 'QACAR1',
    crear: [
        { id: 'txtCaracteristicas_StrDescripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtCaracteristicas_StrLinea', tipo: 'lookup', opcion: '0 - GENERAL' },
        { id: 'txtCaracteristicas_IntCaracteristica', tipo: 'lookup', opcion: '1 - Característica 1' }
    ],
    editar: [
        { id: 'txtCaracteristicas_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('CRUD_Caracteristica - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CARACTERÍSTICA testerp CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
