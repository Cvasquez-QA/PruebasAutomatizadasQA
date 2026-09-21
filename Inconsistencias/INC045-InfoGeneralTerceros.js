import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360PosConfig } from '../../ParametrosPruebas/Hgi360Pos8888.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';

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
    await abrirMaestros(t, es360 ? 'Terceros' : 'TERCEROS');
    await t
        .wait(2000)
        .click(Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000)
        .expect(Selector('#txtTercero_Tipo_Id .dx-lookup-field').visible).ok('No se muestra la info general del tercero')
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Terceros ERP miPOS`
    .page(hgi360PosConfig.pagina);

test('Prueba Terceros ', async t => {
    await ejecutarPrueba(t, hgi360PosConfig);
});

fixture `Prueba Terceros ERP testPOS`
    .page(testPosConfig.pagina);

test('Prueba Terceros ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Terceros ERP testHappgi`
    .page(testHappgiPosConfig.pagina);

test('Prueba Terceros ', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
