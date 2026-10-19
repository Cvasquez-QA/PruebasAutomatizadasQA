import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Denominaciones - test.hgi360.com, módulo POS (Maestros > impuestos).
// Selectores validados en el navegador. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Denominaciones',
    grupo: 'impuestos',
    grid: 'gridDenominaciones',
    guardar: 'BtnGuardarDenominaciones_btn',
    campoCodigo: 'txtDenominaciones_StrIdDenominacion',
    codigo: 'QADEN1',
    crear: [
        { id: 'txtDenominaciones_StrDescripcion', valor: 'descDenominacion' },
        { id: 'txtDenominaciones_IntValor', valor: '50000' }
    ],
    editar: [
        { id: 'txtDenominaciones_StrDescripcion', valor: 'nuevaDescDenominacion' }
    ],
    validarEditado: 'nuevaDescDenominacion'
};

fixture `Prueba Denominaciones testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Denominaciones CRUD mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
