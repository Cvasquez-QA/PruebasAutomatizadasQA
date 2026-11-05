import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirNominaE360
} from '../../Funciones/HelpersHgi360Web.js';
import { elegirEnLista360 } from '../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// NominaE > Envio (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy: en ambiente de
// habilitación envía el documento del empleado de prueba y valida que aparezca en Consulta.
// La opción es "2 - Habilitación", pero el campo solo muestra "Habilitación".
const AMBIENTE_HABILITACION = /Habilitaci[oó]n/i;
// Empleado que liquida 4.Procesos/LiquidacionDePeriodo.js (el idEmpleado de la configuración no existe en 8902)
const ID_EMPLEADO = '1000099598';
const ID_SET_ENVIO = '1';

const btnCargar = Selector('#BtnConsultarDocumentosNominaElectronica').filterVisible();
const gridVisible = Selector('[id^="ListagridDocumentosNominaElectronica"]').filterVisible();

// En "Consulta" no hay IdSet ni botón de cargar: los enviados se cargan al elegir el ambiente
async function cargarDocumentos(t, idSet = null) {
    await elegirEnLista360(t, '#Documentos_Electronicos_Ambiente', AMBIENTE_HABILITACION);
    if (idSet !== null) {
        await llenarCampos(t, [{ id: 'Documentos_NominaElectronica_IdSetDian', valor: idSet }]);
        await t.click(btnCargar);
    }
    await t
        .expect(gridVisible.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible().with({ timeout: 30000 }).exists)
        .ok('El grid de documentos no terminó de cargar');
}

async function buscarEmpleado(t, empleado) {
    const buscador = gridVisible.find('.dx-datagrid-search-panel .dx-texteditor-input');
    if (await buscador.exists) {
        await t.typeText(buscador, empleado, { replace: true }).wait(2000);
    }
    return gridVisible.find('tr.dx-data-row').withText(empleado);
}

fixture `Prueba Nomina E Envio - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Enviar NominaE - Test Hgi360', async t => {
    const empleado = ID_EMPLEADO;
    await ingresarAplicacion(t, testNominaConfig);

    await abrirNominaE360(t, 'Envio');
    await t.expect(Selector('#Documentos_Electronicos_Ambiente').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió NominaE > Envio');
    await cargarDocumentos(t, ID_SET_ENVIO);
    const filaEnvio = await buscarEmpleado(t, empleado);
    if (await filaEnvio.with({ timeout: 5000 }).exists) {
        await t
            .click(filaEnvio.find('.dx-checkbox-icon').nth(0))
            .click(Selector('#BtnEnvioDianEnvios').filterVisible())
            .wait(5000);
        if (await Selector('button.swal2-confirm').filterVisible().exists) {
            await t.click(Selector('button.swal2-confirm').filterVisible()).wait(3000);
        }
    } else {
        console.log(`El empleado ${empleado} no tiene documentos pendientes de envío; se valida solo la consulta`);
    }
    await cerrarPestana360(t);

    await abrirNominaE360(t, 'Envio');
    await t.click(Selector('#tabs_documento_Consulta').filterVisible().with({ timeout: 20000 })).wait(2000);
    await cargarDocumentos(t);
    await t.expect((await buscarEmpleado(t, empleado)).with({ timeout: 15000 }).exists)
        .ok(`El documento del empleado ${empleado} no aparece en la consulta de enviados`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
