import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, hgiPosConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirProcesos = HelpersHappgi.abrirProcesos;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let confirmarProceso = HelpersHgi360.confirmarProceso;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirProcesos = es360 ? h.abrirProcesos360 : h.abrirProcesos;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    confirmarProceso = h.confirmarProceso || HelpersHgi360.confirmarProceso;
    ingresarAplicacion = h.ingresarAplicacion;
};

const mensajeValidacion = Selector('#lblValidacion');
const btnAceptarValidacion = Selector('#ModalValidaciones button').withText('Aceptar');

async function aceptarValidacionesSiExisten(t) {
    if (await mensajeValidacion.visible) {
        await t.click(btnAceptarValidacion).wait(1500);
    }
    if (await mensajeValidacion.visible) {
        await t.click(btnAceptarValidacion).wait(1500);
    }
}

async function abrirProcesoNombrado(t, config, nombre360, nombreHappgi) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await t.switchToMainWindow();
    await abrirProcesos(t, es360 ? nombre360 : nombreHappgi);
}

async function ejecutarInventario(t, config, esperaMs = 4000) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirProcesoNombrado(t, config, 'Inventario', 'Inventario');
    await t.wait(esperaMs);
    await aceptarValidacionesSiExisten(t);
    await confirmarProceso(t);
}

async function ejecutarInventarioSaldoInicial(t, config, esperaMs = 5000) {
    await t.switchToMainWindow();
    await abrirProcesos(t, 'Inventario con saldo inicial');
    await t.wait(esperaMs);
    await aceptarValidacionesSiExisten(t);
    await confirmarProceso(t);
}

async function ejecutarPruebaAdminCompleta(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);

    await abrirProcesoNombrado(t, config, 'Cartera', 'Cartera');
    await t.wait(es360 ? 5000 : 6000);
    await confirmarProceso(t);

    await t.wait(4000);
    await abrirProcesoNombrado(t, config, 'Pedidos', 'Pedidos');
    await t.wait(es360 ? 6000 : 5000);
    await confirmarProceso(t);

    await ejecutarInventario(t, config, es360 ? 10000 : 4000);
    await ejecutarInventarioSaldoInicial(t, config, es360 ? 10000 : 5000);

    await t.switchToMainWindow();
    await cerrarSesion(t);
}

async function ejecutarPruebaAdminHappgi(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);

    await abrirProcesoNombrado(t, config, 'Cartera', 'Cartera');
    await t.wait(6000);
    await confirmarProceso(t);

    await t.wait(4000);
    await ejecutarInventario(t, config, 4000);
    await ejecutarInventarioSaldoInicial(t, config, 4000);

    await t.switchToMainWindow();
    await cerrarSesion(t);
}

async function ejecutarPruebaPos(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await ejecutarInventario(t, config, 4000);
    await ejecutarInventarioSaldoInicial(t, config, 4000);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Procesos testERP Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos testerp', async t => {
    await ejecutarPruebaAdminCompleta(t, testAdminConfig);
});

fixture `Prueba Procesos Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos Hgi360', async t => {
    await ejecutarPruebaAdminCompleta(t, hgiAdminConfig);
});

fixture `Prueba Procesos testHappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos testHappgi', async t => {
    await ejecutarPruebaAdminHappgi(t, testHappgiAdminConfig);
});

fixture `Prueba Procesos testERP Pos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos testerp', async t => {
    await ejecutarPruebaPos(t, testPosConfig);
});

fixture `Prueba Procesos Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos Hgi360', async t => {
    await ejecutarPruebaPos(t, hgiPosConfig);
});

fixture `Prueba Procesos testHappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos testHappgi', async t => {
    await ejecutarPruebaPos(t, testHappgiPosConfig);
});
