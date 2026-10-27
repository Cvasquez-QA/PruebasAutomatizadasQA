import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, miHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
};

/** Hgi360 (ERP web): el usuario Administrativo no debe ver el módulo P.H en el menú lateral. */
async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await t
        .expect(Selector('#ErpSidebarModulos').with({ timeout: 20000 }).exists).ok('No cargó el menú lateral')
        .expect(Selector('#ErpSidebarModulos span').withText(/^\s*P\.?\s?H\.?\s*$/i).exists).notOk('Está el menú de PH');
    await Web.cerrarSesion360(t);
}

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion, cerrarAlFinal = true) {
    usarHelpersDe(config);
    await ingresar(t, config);
    await t.expect(Selector('a').withText('P.H').visible).notOk('está el menú de PH');
    if (cerrarAlFinal) {
        await cerrarSesion(t);
    }
}

fixture `Prueba INC046 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC046 prueba menu PH Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba INC046 Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC046 prueba menu PH Hgi360 admin', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba INC046 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC046 prueba menu PH testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC046 mihappgi Admin`
    .page(miHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC046 prueba menu PH mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig, ingresarAplicacionMiHappgi, false);
});
