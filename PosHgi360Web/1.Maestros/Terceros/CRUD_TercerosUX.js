import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Terceros - test.hgi360.com, módulo POS (Maestros > terceros).
// Selectores validados en el navegador. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Terceros',
    grupo: 'terceros',
    grid: 'gridTerceros',
    guardar: 'BtnGuardarTercero_btn',
    campoCodigo: 'txtTercero_Id',
    codigo: '1010101010',
    crear: [
        { id: 'txtTercero_Tipo_Id', tipo: 'lookup', opcion: 'CC - Cedula de Ciudadania' },
        { id: 'txtTercero_Tipo_Persona', tipo: 'lookup', opcion: '1 - Natural' },
        { id: 'txtTercero_PApellido', valor: 'Monsalve' },
        { id: 'txtTercero_SApellido', valor: 'QA' },
        { id: 'txtTercero_PNombre', valor: 'Yesica' },
        { id: 'txtTercero_Direccion', valor: 'la Casa De Yesica' },
        { id: 'txtTercero_Email', valor: 'correo@gmail.com' },
        { id: 'txtTercero_Telefono', valor: '123123123' },
        { id: 'txtTercero_TipoTercero', tipo: 'lookup', opcion: '2 - Clientes' }
    ],
    editar: [
        { id: 'txtTercero_Telefono', valor: '654321' }
    ],
    validarEditado: '654321'
};

fixture `Prueba Terceros testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba CRUD Terceros TestPos', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
