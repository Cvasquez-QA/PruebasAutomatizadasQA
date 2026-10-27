import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, hgiPosConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

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

/** Hgi360 (ERP web): ninguna pestaña de Herramientas > Parámetros debe mostrar el parámetro "Saldos (0)". */
async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await Web.abrirHerramientas360(t, 'Parámetros');
    const pestanas = Selector('[id^="tabs_parametros_"]').filterVisible();
    await t.expect(pestanas.with({ timeout: 20000 }).exists).ok('No cargaron las pestañas de Parámetros');
    const editar = Selector('#BtnEditar, #BtnEditar_btn').filterVisible();
    if (await editar.exists) {
        await t.click(editar.nth(0)).wait(2000);
    }
    const total = await pestanas.count;
    for (let i = 0; i < total; i++) {
        await t.click(pestanas.nth(i)).wait(1500);
        const id = await pestanas.nth(i).id;
        await t.expect(Selector('span, label, div').filterVisible().withExactText('Saldos (0)').exists)
            .notOk(`El parámetro Saldos (0) existe (pestaña ${id})`);
    }
    // Se sale sin guardar
    const cancelar = Selector('[id^="BtnCancelar"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0)).wait(1000);
        const confirmar = Selector('button.swal2-confirm').filterVisible();
        if (await confirmar.with({ timeout: 2000 }).exists) {
            await t.click(confirmar);
        }
    }
    await Web.cerrarSesion360(t);
}

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

fixture `Prueba INC036 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba INC036 Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 Hgi360', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba INC036 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC036 Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 Pos - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC036 Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 Hgi360', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});

fixture `Prueba INC036 testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC036 Parametro Saldos 0 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
