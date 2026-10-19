import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Cargos - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Cargos',
    grupo: 'terceros',
    grid: 'gridCargos',
    guardar: 'BtnGuardarCargos_btn',
    campoCodigo: 'txtCargos_StrIdCargo',
    codigo: 'QACRG1',
    crear: [
        { id: 'txtCargos_StrNombre', valor: 'NombreCargo' },
        { id: 'txtCargos_TxtFunciones', tipo: 'area', valor: 'FUNCIONESCARGO' },
        { id: 'txtCargos_TxtPerfil', tipo: 'area', valor: 'PerfilCargo' }
    ],
    editar: [
        { id: 'txtCargos_StrNombre', valor: 'Cargo Pérez' }
    ],
    validarEditado: 'Cargo Pérez'
};

test.describe('CRUD_CargosUX - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Cargo testerp - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
