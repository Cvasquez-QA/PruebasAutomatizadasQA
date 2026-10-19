import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMaestros = HelpersHappgi.abrirMaestros;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMaestros = es360 ? h.abrirMaestros360 : h.abrirMaestros;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirMaestros(t, 'Terceros');
    await t
        .wait(2000)
        .click(Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000)
        .expect(Selector('#txtTercero_Tipo_Id .dx-lookup-field').visible).ok('No se muestra la info general del tercero')
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Terceros ERP miPOS`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Terceros ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});

fixture `Prueba Terceros ERP testPOS`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Terceros ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Terceros ERP testHappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Terceros ', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
