import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360, cerrarPestana360, abrirReportes360 } from '../../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Reportes > Liquidación (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy: genera cada
// plantilla del reporte y valida que el grid traiga datos.
const REPORTES = ['Novedades', 'Relacion de Pagos', 'Ausentismo', 'Liquidacion', 'Prenomina', 'Novedades Turno'];

const listaPlantillas = Selector('[id$="_SlbListaPlantillas"]').filterVisible();
const btnGenerar = Selector('[id$="_BtnGenerar"]').filterVisible();
const gridReporte = Selector('[id$="_GridReportes"]').filterVisible();

async function generarReporte(t, plantilla) {
    await abrirReportes360(t, 'Liquidación');
    const opcion = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item')
        .withText(new RegExp(`^\\s*${plantilla}\\s*$`, 'i'));
    await t
        .expect(listaPlantillas.with({ timeout: 20000 }).exists).ok('No cargó la lista de plantillas del reporte Liquidación')
        .click(listaPlantillas)
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No existe la plantilla ${plantilla}`)
        .click(opcion.nth(0))
        .wait(1500)
        .click(btnGenerar)
        .expect(gridReporte.find('tr.dx-data-row, tr.dx-group-row').with({ timeout: 30000 }).exists)
        .ok(`El reporte ${plantilla} no está llenando el grid`);
    await cerrarPestana360(t);
    await t.wait(1500);
}

fixture `Prueba Reportes Liquidacion Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Reportes Nomina - Liquidacion - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    for (const reporte of REPORTES) {
        await generarReporte(t, reporte);
    }
    await cerrarSesion360(t);
});
