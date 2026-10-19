import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe,
    buscarEnGrid360,
    filaGrid360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// mi.hgi360.com (React): el grid es [data-testid="gridEmpresas"].
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
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Empresas Consulta Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Empresas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Empresas Consulta - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
