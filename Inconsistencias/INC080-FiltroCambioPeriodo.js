import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testNominaConfig, testHappgiAdminConfig, testHappgiNominaConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let cerrarSesion = HelpersHappgi.cerrarSesion;
let filtrarPor = HelpersHappgi.filtrarPor;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    filtrarPor = h.filtrarPor;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await t
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#TxtCambioPeriodo_Anyo .dx-lookup-field'));
    await filtrarPor(t, '202');
    await t
        .expect(Selector('.dx-list-item-content').withText('201').exists).notOk('No se filtra bien, aparecen años que no entran en el filtro')
        .click(Selector('.dx-item-content.dx-list-item-content'))
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `INC080 Filtro Cambio Periodo Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC080 Filtro Cambio Periodo Nomina`
    .page(testNominaConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Nomina', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});

fixture `INC080 Filtro Cambio Periodo Happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Happgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `INC080 Filtro Cambio Periodo Happgi Nomina`
    .page(testHappgiNominaConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Happgi Nomina', async t => {
    await ejecutarPrueba(t, testHappgiNominaConfig);
});
