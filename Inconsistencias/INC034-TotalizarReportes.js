import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { miHappgiAdminConfig } from '../../ParametrosPruebas/MiHappgiAdmin8893.js';
import { offPosConfig } from '../../ParametrosPruebas/OffPos8906.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirReportes = HelpersHappgi.abrirReportes;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirReportes = es360 ? h.abrirReportes360 : h.abrirReportes;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
};

const esMiHappgi = (config) => String(config?.pagina || '').toLowerCase().includes('mi.happgi');

async function generarReporteCarteraEdades(t) {
    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-list-item').withText('Cartera X Edades'))
        .wait(1500)
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .expect(Selector('.dx-pages .dx-info').withText('Total registros:').visible).ok('No se totalizaron los registros');
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await abrirReportes(t, es360 ? 'Cartera' : 'CARTERA');
    await generarReporteCarteraEdades(t);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

async function ejecutarPruebaOff(t, config) {
    usarHelpersDe(config);
    await t
        .wait(1500)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .wait(1000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(2000)
        .click(Selector('a').withText('Reportes'))
        .click(Selector('span').withText('CARTERA'));
    await generarReporteCarteraEdades(t);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba boton generar reportes Admin testerp`
    .page(testAdminConfig.pagina);

test('Prueba boton exportar reportes Admin testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba boton generar reportes Admin Hgi360`
    .page(hgi360AdminConfig.pagina);

test('Prueba boton exportar reportes Admin Hgi360', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba boton generar reportes Admin testhappgi`
    .page(miHappgiAdminConfig.pagina);

test('Prueba boton exportar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin testhappgi`
    .page(testHappgiAdminConfig.pagina);

test('Prueba boton exportar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin off`
    .page(offPosConfig.pagina);

test('Prueba boton exportar reportes Admin off', async t => {
    await ejecutarPruebaOff(t, offPosConfig);
});
