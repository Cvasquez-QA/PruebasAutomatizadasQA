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
const filaReporte = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"] td');

/* Hgi360 (ERP web): el prefijo de los controles del reporte cambia según el aplicativo */
const listaPlantillas360 = Selector('[id$="_SlbListaPlantillas"]');
const btnGenerar360 = Selector('[id$="_BtnGenerar"]').filterVisible();
const filasReporte360 = Selector('[id$="_GridReportes"] tr.dx-data-row').filterVisible();

const generarReporte360 = async (t, plantilla) => {
    await t
        .expect(listaPlantillas360.with({ timeout: 20000 }).exists).ok('No cargó la lista de plantillas del reporte')
        .click(listaPlantillas360)
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(plantilla))
        .wait(1500)
        .click(btnGenerar360)
        .expect(filasReporte360.with({ timeout: 30000 }).exists).ok(`El botón Generar no trajo datos para ${plantilla}`);
};

async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await Web.abrirReportes360(t, 'Maestros');
    await generarReporte360(t, 'Terceros');
    await generarReporte360(t, 'Productos');
    await Web.cerrarSesion360(t);
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await abrirReportes(t, 'Maestros');
    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-list-item').withText('Terceros'))
        .wait(1500)
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .expect(filaReporte.innerText).notEql(null)
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .wait(1500)
        .click(Selector('.dx-list-item').withText('Productos'))
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .expect(filaReporte.innerText).notEql(null);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba boton generar reportes Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton generar reportes Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba boton generar reportes Admin Hgi360`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton generar reportes Admin Hgi360', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin testhappgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton generar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin mihappgi`
    .page(miHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton generar reportes Admin mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});
