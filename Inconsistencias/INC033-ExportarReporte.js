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

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresar(t, config);
    await abrirReportes(t, es360 ? 'Cartera' : 'CARTERA');
    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-list-item').withText('Cartera X Edades'))
        .wait(1500)
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .click(Selector('span').withText('Exportar'))
        .expect(Selector('#divImgLoading').exists).ok('no se mostró el circulo de carga')
        .switchToMainWindow();
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
    .page(testHappgiAdminConfig.pagina);

test('Prueba boton exportar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin mihappgi`
    .page(miHappgiAdminConfig.pagina);

test('Prueba boton exportar reportes Admin mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig, ingresarAplicacionMiHappgi);
});
