import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, testAdminConfig, testHappgiAdminConfig, testPosConfig, testHappgiPosConfig, offPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
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

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    await ingresar(t, config);
    await abrirMaestros(t, 'Productos');
    await t
        .click(Selector('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(3000)
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .expect(Selector('.swal2-content div').exists).notOk('Se está generando el mensaje al actualizar saldos desde el maestro de productos')
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba validacion mensaje actualizar saldos Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testerp Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba validacion mensaje actualizar saldos happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testhappgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba validacion mensaje actualizar saldos miPos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testerp Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});

fixture `Prueba validacion mensaje actualizar saldos testPos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testerp Pos', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba validacion mensaje actualizar saldos testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testhappgi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});

fixture `Prueba validacion mensaje actualizar saldos offline Pos`
    .page(offPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos offline Pos', async t => {
    await ejecutarPrueba(t, offPosConfig, ingresarAplicacionOffline);
});
