import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360, cerrarPestana360, abrirUtilitarios360 } from '../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Utilitarios > Generación UGPP (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// carga salarios y compensaciones; Generar aún no está disponible en la aplicación y se valida el aviso.
const NO_DISPONIBLE = /a[uú]n no est[aá] disponible/i;

const aviso = texto => Selector('.erp-toast, .swal2-popup').filterVisible().withText(texto);
const filasVisibles = Selector('tr.dx-data-row').filterVisible();

async function cargarYGenerar(t, seccion, cargar, generar) {
    await t
        .click(Selector(`#${cargar}`).filterVisible())
        .expect(filasVisibles.with({ timeout: 30000 }).exists).ok(`La grilla de ${seccion} no trae información`)
        .click(Selector(`#${generar}`).filterVisible())
        .expect(aviso(NO_DISPONIBLE).with({ timeout: 10000 }).exists)
        .ok(`No se mostró el mensaje de Generar ${seccion} no disponible`)
        .expect(aviso(NO_DISPONIBLE).exists).notOk(`El aviso de Generar ${seccion} no se cerró`, { timeout: 20000 });
}

fixture `Prueba Generacion UGPP Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Generacion UGPP - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirUtilitarios360(t, 'Generación UGPP');
    await t.expect(Selector('#BtnNomGeneracionUGPP_CargarSalarios').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Utilitarios > Generación UGPP');

    await cargarYGenerar(t, 'Salarios', 'BtnNomGeneracionUGPP_CargarSalarios', 'BtnNomGeneracionUGPP_GenerarSalarios');
    await t.click(Selector('[data-testid="nom-generacion-ugpp-tab-compensaciones"], [role="tab"]').withText('Compensaciones').filterVisible().nth(0)).wait(1500);
    await cargarYGenerar(t, 'Compensaciones', 'BtnNomGeneracionUGPP_CargarCompensaciones', 'BtnNomGeneracionUGPP_GenerarCompensaciones');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
