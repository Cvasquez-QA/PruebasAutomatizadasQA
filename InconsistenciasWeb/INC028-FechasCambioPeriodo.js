import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, miHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';

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

const esMiHappgi = (config) => String(config?.pagina || '').toLowerCase().includes('mi.happgi');

/** Primeros dos valores de la lista abierta del lookup (años o periodos). */
const leerDosPrimerasOpciones = async (t, contenedor) => {
    const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    await t
        .click(`${contenedor} .dx-lookup-field`)
        .expect(opciones.with({ timeout: 10000 }).count).gte(2, `La lista de ${contenedor} tiene menos de dos opciones`);
    const primera = Number((await opciones.nth(0).innerText).trim().split(/\s|-/)[0]);
    const segunda = Number((await opciones.nth(1).innerText).trim().split(/\s|-/)[0]);
    await t.pressKey('esc');
    return [primera, segunda];
};

/** Hgi360 (ERP web): en Cambiar Periodo, años y periodos deben listarse en orden descendente. */
async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await Web.abrirCambioPeriodo360(t);

    const [anno1, anno2] = await leerDosPrimerasOpciones(t, '#TxtCambioPeriodo_Anyo');
    await t.expect(anno1).gt(anno2, `Los años NO están en orden descendente (${anno1}, ${anno2})`);
    const [periodo1, periodo2] = await leerDosPrimerasOpciones(t, '#TxtCambioPeriodo_Periodo');
    await t.expect(periodo1).gt(periodo2, `Los periodos NO están en orden descendente (${periodo1}, ${periodo2})`);

    await t.pressKey('esc');
    await Web.cerrarSesion360(t);
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await t
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500);
    await t.click(Selector('#TxtCambioPeriodo_Anyo .dx-lookup-field'));
    const anno1Posicion = Number((await Selector('.dx-list-item-content').nth(0).innerText).trim());
    const anno2Posicion = Number((await Selector('.dx-list-item-content').nth(1).innerText).trim());
    await t.expect(anno1Posicion).gt(anno2Posicion, 'Los años NO están en orden descendente');
    await t.click(Selector('#TxtCambioPeriodo_Periodo .dx-lookup-field'));
    const periodo1Posicion = Number((await Selector('.dx-list-item-content').nth(0).innerText).trim());
    const periodo2Posicion = Number((await Selector('.dx-list-item-content').nth(1).innerText).trim());
    await t.expect(periodo1Posicion).gt(periodo2Posicion, 'Los periodos NO están en orden descendente');
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba fechas Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba fechas Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba fechas admin Hgi360`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba fechas Admin Hgi360', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba fechas Admin testhappgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba fechas Admin testerp', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba fechas Admin mihappgi`
    .page(miHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba fechas Admin mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});
