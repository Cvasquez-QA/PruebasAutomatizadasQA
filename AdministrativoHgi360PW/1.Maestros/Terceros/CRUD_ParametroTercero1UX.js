import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// PT11 - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// El nombre del menú (PT11) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'PT11',
    grupo: 'terceros',
    grid: 'gridTerParametro1',
    guardar: 'BtnGuardarTerParametro1_btn',
    campoCodigo: 'txtTerParametro1_StrIdParametro',
    codigo: 'QAPT1',
    crear: [
        { id: 'txtTerParametro1_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtTerParametro1_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('CRUD_ParametroTercero1UX - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba PARAMETRO TERCERO 1 testerp CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
