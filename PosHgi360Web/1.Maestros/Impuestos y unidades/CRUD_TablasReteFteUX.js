import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Maestro de Retención - test.hgi360.com (POS > Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
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

fixture `Prueba Tablas de Rte Fnte testErp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Rte Fnte CRUD mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
