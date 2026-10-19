import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tarifas de Iva - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Tarifas de Iva',
    grupo: 'impuestos',
    grid: 'gridTarifasIva',
    guardar: 'BtnGuardarTarifaIva_btn',
    campoCodigo: 'txtTarifaIva_Id',
    codigo: 'QAIVA1',
    crear: [
        { id: 'txtTarifaIva_Descripcion', valor: 'MiDescTarifaIva123' },
        { id: 'txtTarifaIva_Porcentaje', valor: '40' },
        { id: 'txtTarifaIva_Porcentaje2', valor: '1' }
    ],
    editar: [
        { id: 'txtTarifaIva_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtTarifaIva_Porcentaje2', valor: '8' }
    ],
    validarEditado: 'minuevadescripcion'
};

test.describe('Prueba Tarifas de IVA - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Tarifas de IVA CRUD Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
