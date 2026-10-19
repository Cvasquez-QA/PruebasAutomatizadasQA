import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const IDENTIFICACION = '811021438';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Empresas');
    await t
        .wait(2000)
        .expect(Selector('#gridEmpresas td').withText(IDENTIFICACION).exists).ok();
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Empresas - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Empresas Consulta Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Empresas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Empresas Consulta - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
