import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Transacciones - test.hgi360.com (POS > Maestros > configuracion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Transacciones',
    grupo: 'configuracion',
    grid: 'gridTransacciones',
    guardar: 'BtnGuardarTransaccion',
    campoCodigo: 'TxtTransaccion_Codigo',
    codigo: 'QAT01',
    crear: [
        { id: 'TxtTransaccion_Descripcion', valor: 'midesctransaccion' }
    ],
    editar: [
        { id: 'TxtTransaccion_Descripcion', valor: 'minuevadesc' }
    ],
    validarEditado: 'minuevadesc'
};

fixture `Prueba CRUD Transaccion testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba CRUD Transaccion mihgi360', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
