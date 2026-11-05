import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaGrid360,
    escribirFecha360
} from '../../../Funciones/HelpersHgi360Web.js';
import { eliminarSiExiste360 } from '../../../Funciones/HelpersNomina360.js';
import { prepararNavegador360, limpiarCache360, llenarCampos, guardarYConfirmar } from '../../../Funciones/HelpersMaestros360.js';
import { abrirMaestroConfig360 } from '../../../Funciones/MenuMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Calendario de nómina - test.hgi360.com (Nómina > Maestros > Configuración). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026: grid [data-testid="gridCalendarioNom"],
// el periodo es #txtCalendarioNom_Periodo y las fechas se escriben en formato yyyy-MM-dd.
const GRID = 'gridCalendarioNom';
const GUARDAR = 'BtnGuardarCalendarioNom_btn';
const GUARDADO = /almacenad|guardad|cread|actualizad/i;
const PERIODO = '72';
// El grid solo muestra los periodos del año en curso: con otro año el periodo creado no se puede ver ni eliminar
const ANYO = String(new Date().getFullYear());

// Al crear, la aplicación pregunta si se quiere llenar la información adicional: guardarYConfirmar responde "No"
const guardar = (t, accion) => guardarYConfirmar(t, GUARDAR, GUARDADO, accion);

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestroConfig360(t, config, 'Calendario');
    await eliminarSiExiste360(t, GRID, PERIODO);

    // Crear
    await nuevoRegistroGrid360(t, GRID);
    await llenarCampos(t, [
        { id: 'txtCalendarioNom_Periodo', valor: PERIODO },
        { id: 'txtCalendarioNom_Anyo', valor: ANYO }
    ]);
    await escribirFecha360(t, '#txtCalendarioNom_FechaInicial', `${ANYO}-01-01`);
    await escribirFecha360(t, '#txtCalendarioNom_FechaFinal', `${ANYO}-01-31`);
    await llenarCampos(t, [
        { id: 'txtCalendarioNom_Festivos', valor: '2' },
        { id: 'txtCalendarioNom_Dias', valor: '30' },
        { id: 'txtCalendarioNom_Horas', valor: '24' },
        { id: 'txtCalendarioNom_Mes', valor: '1' },
        { id: 'txtCalendarioNom_Numero', valor: '1' },
        { id: 'txtCalendarioNom_Descipcion', valor: 'enero' },
        { id: 'txtCalendarioNom_NovedadesPeriodo', tipo: 'check' }
    ]);
    await guardar(t, `Crear periodo ${PERIODO}`);
    await buscarEnGrid360(t, GRID, PERIODO);
    await t
        .expect(filaGrid360(GRID, PERIODO).with({ timeout: 15000 }).exists)
        .ok(`No se encontró el periodo ${PERIODO} después de crearlo`);

    // Editar festivos y horas
    await accionFilaGrid360(t, GRID, PERIODO, 'Editar');
    await t.expect(Selector(`#${GUARDAR}`).filterVisible().with({ timeout: 15000 }).exists)
        .ok('No se abrió el formulario de edición del calendario');
    await llenarCampos(t, [
        { id: 'txtCalendarioNom_Festivos', valor: '4' },
        { id: 'txtCalendarioNom_Horas', valor: '36' }
    ]);
    await guardar(t, `Editar periodo ${PERIODO}`);
    await buscarEnGrid360(t, GRID, PERIODO);
    // El grid no muestra la columna de horas: se valida con los festivos
    await t
        .expect(filaGrid360(GRID, PERIODO).find('td').withExactText('4').with({ timeout: 15000 }).exists)
        .ok(`No se ven los festivos editados en el periodo ${PERIODO}`);

    // Eliminar
    await eliminarFilaGrid360(t, GRID, PERIODO);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba 4.Calendario Nom Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Calendario Nom CRUD', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
