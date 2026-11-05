import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// ParametroPos1 - test.hgi360.com (POS > Maestros > Productos y/o Servicios).
// Selectores validados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'ParametroPos1',
    grupo: 'productos',
    grid: 'gridPOSParametro1',
    guardar: 'BtnGuardarPOSParametro1_btn',
    campoCodigo: 'txtPOSParametro1_StrIdParametro',
    codigo: 'QAPP1',
    crear: [
        { id: 'txtPOSParametro1_StrDescripcion', valor: 'descParametro1' }
    ],
    editar: [
        { id: 'txtPOSParametro1_StrDescripcion', valor: 'nuevaDescParametro1' }
    ],
    validarEditado: 'nuevaDescParametro1'
};

fixture `CRUD_ParametroPos1 - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Parametro1 POS - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
