import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, offPosConfig, testAdminConfig, testHappgiAdminConfig, testHappgiPosConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMaestros = HelpersHappgi.abrirMaestros;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMaestros = esHgi360(config) ? h.abrirMaestros360 : h.abrirMaestros;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ingresarAplicacionOffline(t, config) {
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .wait(2000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
}

async function cambiarPeriodo(t) {
    await t
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(8000)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/).filterVisible())
        .wait(1500)
        .click(Selector('#TxtCambioPeriodo_Periodo .dx-lookup-field'))
        .wait(1500)
        .click(Selector('.dx-item.dx-list-item div'))
        .click(Selector('#BtnGuardarCambioPeriodo div').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(7000)
        .switchToMainWindow()
        .expect(Selector('dx-item-content dx-tab-content').visible)
        .notOk('No se referescó la pagina al cambiar de periodo');
}

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    await ingresar(t, config);

    if (esHgi360(config)) {
        await abrirMaestros(t, 'Terceros', 'terceros');
    } else {
        await abrirMaestros(t, 'Terceros');
    }

    await cambiarPeriodo(t);
    await cerrarSesion(t);
}

fixture `Prueba validacion recarga pagina Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testerp Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba validacion recarga pagina happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testhappgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba validacion recarga pagina miPos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testerp Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});

fixture `Prueba validacion recarga pagina testPos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testerp Pos', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba validacion recarga pagina testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testhappgi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});

fixture `Prueba validacion recarga pagina offline Pos`
    .page(offPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo offline Pos', async t => {
    await ejecutarPrueba(t, offPosConfig, ingresarAplicacionOffline);
});
