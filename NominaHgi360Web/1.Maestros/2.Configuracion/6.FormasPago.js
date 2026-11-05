import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Formas de Pago - test.hgi360.com (Nómina > Maestros > Configuración). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'FormasPago',
    grid: 'gridFormasPago',
    guardar: 'BtnGuardarFormaPago_btn',
    campoCodigo: 'txtFormaPago_Id',
    codigo: '3277',
    crear: [
        { id: 'txtFormaPago_Descripcion', valor: 'descformapago' },
        { id: 'txtFormaPago_Grupo', tipo: 'lookup', opcion: 'Efectivo' },
        { id: 'txt_lista_FormaPagoFPagoDian', tipo: 'lookup', filtro: 'Acuerdo', opcion: 'Acuerdo mutuo' },
        { id: 'FormasPago_Banco', tipo: 'lookup', opcion: '0 - GENERAL' },
        { id: 'txtFormaPago_Consulta', tipo: 'check' }
    ],
    editar: [
        { id: 'txtFormaPago_Descripcion', valor: 'minuevadescripcionformadepago' }
    ],
    validarEditado: 'minuevadescripcionformadepago'
};

fixture `Prueba 6.FormasPago Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba FormasPago CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
