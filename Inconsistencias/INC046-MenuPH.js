import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { miHappgiAdminConfig } from '../../ParametrosPruebas/MiHappgiAdmin8893.js';

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

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion, cerrarAlFinal = true) {
    usarHelpersDe(config);
    await ingresar(t, config);
    await t.expect(Selector('a').withText('P.H').visible).notOk('está el menú de PH');
    if (cerrarAlFinal) {
        await cerrarSesion(t);
    }
}

fixture `Prueba INC046 testERP Admin`
    .page(testAdminConfig.pagina);

test('Prueba INC046 prueba menu PH testerp admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC046 MIERP Admin`
    .page(hgi360AdminConfig.pagina);

test('Prueba INC046 prueba menu PH MIERP admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba INC046 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina);

test('Prueba INC046 prueba menu PH MIERP testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC046 testhappgi Admin`
    .page(miHappgiAdminConfig.pagina);

test('Prueba INC046 prueba menu PH MIERP testhappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig, ingresarAplicacionMiHappgi, false);
});
