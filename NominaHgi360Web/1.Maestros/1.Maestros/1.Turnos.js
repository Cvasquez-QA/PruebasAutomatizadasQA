import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Turnos - test.hgi360.com (Nómina > Maestros > Maestros). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Turnos',
    grid: 'gridTurnos',
    guardar: 'BtnGuardarTurnos_btn',
    campoCodigo: 'txtTurno_Id',
    codigo: '886',
    crear: [
        { id: 'txtTurno_Descripcion', valor: 'Prueba Turno' },
        { id: 'txtTurno_HoraInicial', tipo: 'lookup', filtro: '07', opcion: '07:30' },
        { id: 'txtTurno_HoraFinal', tipo: 'lookup', filtro: '17', opcion: '17:00' },
        { id: 'txtTurno_HorasBase', valor: '45' },
        { id: 'txtTurno_TrabajaFestivos', tipo: 'check' },
        { id: 'txtTurno_CompensaFestivos', tipo: 'check' },
        { id: 'txtTurno_BaseFactura', tipo: 'check' },
        { id: 'txtTurno_Descanso', tipo: 'check' }
    ],
    editar: [
        { id: 'txtTurno_Descripcion', valor: 'Prueba Turno Editado' },
        { id: 'txtTurno_HoraFinal', tipo: 'lookup', filtro: '16', opcion: '16:00' }
    ],
    validarEditado: 'Prueba Turno Editado'
};

fixture `Prueba 1.Turnos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Turnos CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
