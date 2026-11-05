import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// ParametroPos2 - test.hgi360.com (POS > Maestros > Productos y/o Servicios).
// Selectores validados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'ParametroPos2',
    grupo: 'productos',
    grid: 'gridPOSParametro2',
    guardar: 'BtnGuardarPOSParametro2_btn',
    campoCodigo: 'txtPOSParametro2_StrIdParametro',
    codigo: 'QAPP2',
    crear: [
        { id: 'txtPOSParametro2_StrDescripcion', valor: 'descParametro2' }
    ],
    editar: [
        { id: 'txtPOSParametro2_StrDescripcion', valor: 'nuevaDescParametro2' }
    ],
    validarEditado: 'nuevaDescParametro2'
};

fixture `CRUD_ParametroPos2 - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Parametro2 POS - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
