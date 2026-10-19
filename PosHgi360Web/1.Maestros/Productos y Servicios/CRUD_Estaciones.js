import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Estaciones - test.hgi360.com, módulo POS.
// En la versión React el maestro "Estaciones" NO aparece en el menú de Maestros del usuario AutPos
// (revisado el 19-oct-2026), por eso la prueba está en skip. Si se publica en el menú, quitar el .skip
// y validar los ids del formulario (son los de la versión anterior con el patrón nuevo).
const MAESTRO = {
    maestro: 'Estaciones',
    grupo: 'productos',
    grid: 'gridEstacionesPos',
    guardar: 'BtnGuardarEstacionesPos_btn',
    campoCodigo: 'EstacionesPos_StrIdEstacion',
    codigo: '111213',
    crear: [
        { id: 'txtEstacionesPos_StrDescripcion', valor: 'descPruebaEstacion' },
        { id: 'txtEstacionesPos_StrSerial', valor: '123123123' },
        { id: 'txtEstacionesPos_StrUbicacion', valor: 'cra123' },
        { id: 'txtEstacionesPos_StrEstablecimiento', tipo: 'lookup', opcion: '0 - General' }
    ],
    editar: [
        { id: 'txtEstacionesPos_StrDescripcion', valor: 'nuevaDescPruebaEstacion' }
    ],
    validarEditado: 'nuevaDescPruebaEstacion'
};

fixture `Prueba Estaciones testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test.skip('Prueba CRUD Estaciones testerp - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
