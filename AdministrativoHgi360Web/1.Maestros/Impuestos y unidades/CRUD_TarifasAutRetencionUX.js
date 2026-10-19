import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tarifas Aut. Retención - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tarifas Aut. Retención',
    grupo: 'impuestos',
    grid: 'gridTarifasCree',
    guardar: 'BtnGuardarTarifaCree_btn',
    campoCodigo: 'txtTarifaCree_Id',
    codigo: '9876',
    crear: [
        { id: 'txtTarifaCree_Descripcion', valor: 'MIDESC123' },
        { id: 'txtTarifaCree_PorTar', valor: '87500' }
    ],
    editar: [
        { id: 'txtTarifaCree_Descripcion', valor: 'MINUEVADESC' },
        { id: 'txtTarifaCree_PorTar', valor: '10278' }
    ],
    validarEditado: 'MINUEVADESC'
};

fixture `Prueba Tarifa AUT. RETENCION - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Tarifa AUT. RETENCIÓN Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
