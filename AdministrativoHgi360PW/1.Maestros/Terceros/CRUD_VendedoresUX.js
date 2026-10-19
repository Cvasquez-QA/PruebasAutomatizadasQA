import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Vendedores - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Vendedores',
    grupo: 'terceros',
    grid: 'gridVendedores',
    guardar: 'BtnGuardarVendedor_btn',
    campoCodigo: 'txtVendedor_Codigo',
    codigo: 'QAVEN1',
    crear: [
        { id: 'txtVendedores_Nombre', valor: 'VENDEDORCITO' },
        { id: 'txtVendedores_ReporteA', tipo: 'lookup', filtro: 'General', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_Sucursal', tipo: 'lookup', filtro: 'General', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_Activo', tipo: 'check' }
    ],
    editar: [
        { id: 'txtVendedores_Nombre', valor: 'Vendedor Pérez' }
    ],
    validarEditado: 'Vendedor Pérez'
};

test.describe('Prueba Vendedores - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Vendedor Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
