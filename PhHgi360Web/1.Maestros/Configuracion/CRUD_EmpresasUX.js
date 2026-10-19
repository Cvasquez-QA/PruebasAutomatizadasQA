import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    buscarEnGrid360,
    filaGrid360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// test.hgi360.com (React): el grid es [data-testid="gridEmpresas"] (Maestros > Configuración).
const GRID = 'gridEmpresas';
const IDENTIFICACION = '811021438';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    await abrirMaestros360(t, 'Empresas');
    await buscarEnGrid360(t, GRID, IDENTIFICACION);
    await t
        .expect(filaGrid360(GRID, IDENTIFICACION).with({ timeout: 15000 }).exists)
        .ok(`No se encontró la empresa con identificación ${IDENTIFICACION}`);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Empresas - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Empresas Consulta Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPhConfig, ingresarAplicacion);
});
