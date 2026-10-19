import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Formas de Pago - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Formas de Pago',
    grupo: 'impuestos',
    grid: 'gridFormasPago',
    guardar: 'BtnGuardarFormaPago_btn',
    campoCodigo: 'txtFormaPago_Id',
    codigo: '3276',
    crear: [
        { id: 'txtFormaPago_Descripcion', valor: 'MiDescripcionFormadepago' },
        { id: 'txtFormaPago_Grupo', tipo: 'lookup', opcion: '6 - Bono' },
        { id: 'txt_lista_FormaPagoFPagoDian', tipo: 'lookup', filtro: 'Bono', opcion: 'Bono' },
        { id: 'FormasPago_Banco', tipo: 'lookup', opcion: '0 - GENERAL' }
    ],
    editar: [
        { id: 'txtFormaPago_Descripcion', valor: 'minuevadescripcionformadepago' },
        { id: 'txtFormaPago_Consulta', tipo: 'check' }
    ],
    validarEditado: 'minuevadescripcionformadepago'
};

test.describe('Prueba Formas de Pago - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Formas de Pago Test Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
