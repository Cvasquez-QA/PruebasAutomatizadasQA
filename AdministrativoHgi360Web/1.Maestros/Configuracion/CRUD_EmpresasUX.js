import { Selector } from 'testcafe';
import {
    accionFilaGrid360,
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    buscarEnGrid360,
    filaGrid360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// test.hgi360.com (React): el grid es [data-testid="gridEmpresas"] (Maestros > Configuración).
const GRID = 'gridEmpresas';
const IDENTIFICACION = '811021438';
// Se diligencian con los valores actuales de la empresa y se cancela, para no cambiar su configuración
const SECCIONAL_DIAN = 'NI';
const AMBIENTE_DIAN_NOMINA = '1 - Producción';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    await abrirMaestros360(t, 'Empresas');
    await buscarEnGrid360(t, GRID, IDENTIFICACION);
    await t
        .expect(filaGrid360(GRID, IDENTIFICACION).with({ timeout: 15000 }).exists)
        .ok(`No se encontró la empresa con identificación ${IDENTIFICACION}`);
    await accionFilaGrid360(t, GRID, IDENTIFICACION, 'Editar');
    await t
        .typeText('#txtEmpresa_Seccional_Dian .dx-texteditor-input', SECCIONAL_DIAN, { replace: true })
        .click('#txtEmpresa_Ambiente_FE_Nomina .dx-lookup-field')
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withExactText(AMBIENTE_DIAN_NOMINA))
        .click('#BtnCancelarEmpresa_btn');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Empresas - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Empresas Consulta Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});
