import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, hgiPosConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirHerramientas = es360 ? h.abrirHerramientas360 : h.abrirHerramientas;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'Parámetros');
    await t
        .click('#tabs_parametrosAdmin_Inventarios')
        .click('#BtnEditar .dx-icon.dx-icon-edit')
        .wait(3000)
        .expect(Selector('span').withText('Saldos (0)').visible).notOk('El parámetro Saldos 0 existe')
        .wait(1500);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC036 testERP Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC036 Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 Hgi360', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});

fixture `Prueba INC036 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC036 testERP Pos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba INC036 Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 Hgi360', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});

fixture `Prueba INC036 testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
