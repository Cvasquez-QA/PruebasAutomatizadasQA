import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, miHappgiAdminConfig, offPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
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

async function generarReporteCarteraEdades(t) {
    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-list-item').withText('Cartera X Edades'))
        .wait(1500)
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .expect(Selector('.dx-pages .dx-info').withText('Total registros:').visible).ok('No se totalizaron los registros');
}

/** Hgi360 (ERP web): Reportes > Cartera > Cartera X Edades debe mostrar el total de registros al generar. */
async function ejecutarPrueba360(t, config) {
    const listaPlantillas = Selector('[id$="_SlbListaPlantillas"]');
    const gridReporte = Selector('[id$="_GridReportes"]').filterVisible();

    await Web.ingresarAplicacion(t, config);
    await Web.abrirReportes360(t, 'Cartera');
    await t
        .expect(listaPlantillas.with({ timeout: 20000 }).exists).ok('No cargó la lista de plantillas del reporte')
        .click(listaPlantillas)
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText('Cartera X Edades'))
        .wait(1500)
        .click(Selector('[id$="_BtnGenerar"]').filterVisible())
        .expect(gridReporte.find('tr.dx-data-row, tr.dx-group-row').with({ timeout: 30000 }).exists).ok('El reporte no trajo datos');
    const pie = gridReporte.find('.dx-pager, .dx-info');
    const textoPie = await pie.exists ? (await pie.nth(0).innerText).replace(/\s+/g, ' ') : 'sin paginador';
    await t
        .expect(gridReporte.withText(/Total registros/i).exists)
        .ok(`No se totalizaron los registros (pie del reporte: ${textoPie})`);
    await Web.cerrarSesion360(t);
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await abrirReportes(t, 'Cartera');
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
        .wait(2000);
    await abrirReportes(t, 'Cartera');
    await generarReporteCarteraEdades(t);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba totalizar reportes Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba totalizar reportes Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba boton generar reportes Admin Hgi360`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin Hgi360', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin mihappgi`
    .page(miHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin testhappgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin off`
    .page(offPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin off', async t => {
    await ejecutarPruebaOff(t, offPosConfig);
});
