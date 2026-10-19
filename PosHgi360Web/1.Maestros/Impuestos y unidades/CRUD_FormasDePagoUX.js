import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Formas de Pago - test.hgi360.com (POS > Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
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

fixture `Prueba Formas de Pago testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Formas de Pago mierp CRUD', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
