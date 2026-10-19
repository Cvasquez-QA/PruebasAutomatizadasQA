import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Maestro de Retención - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Maestro de Retención',
    grupo: 'impuestos',
    grid: 'gridTarifasRetenciones',
    guardar: 'BtnGuardarTarifasRetencion_btn',
    campoCodigo: 'txtTarifasRetencion_Id',
    codigo: 'QARTF1',
    crear: [
        { id: 'txtTarifasRetencion_Descripcion', valor: 'DESCRIPCIONRETEFUENTE' },
        { id: 'txtTarifasRetencion_BaseRteFte', valor: '5314' },
        { id: 'txtTarifasRetencion_PorcentajeND', valor: '801' },
        { id: 'txtTarifasRetencion_PorcentajeDecl', valor: '100' },
        { id: 'txtTarifasRetencion_BaseRteIca', valor: '896' },
        { id: 'txtTarifasRetencion_Porcentaje', valor: '5664' }
    ],
    editar: [
        { id: 'txtTarifasRetencion_Descripcion', valor: 'NuevaDescripciónReteFuente' },
        { id: 'txtTarifasRetencion_BaseRteFte', valor: '5000' },
        { id: 'txtTarifasRetencion_BaseRteIca', valor: '800069' },
        { id: 'txtTarifasRetencion_Porcentaje', valor: '8411' }
    ],
    validarEditado: 'NuevaDescripciónReteFuente'
};

test.describe('Prueba Tablas de Rte Fnte - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Rte Fnte CRUD Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
