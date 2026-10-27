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

/**
 * Hgi360 (ERP web): Reportes > Cartera > Cartera X Edades. Al pulsar Exportar debe mostrarse el indicador
 * de carga (o terminar la exportación) sin error.
 */
async function ejecutarPrueba360(t, config) {
    const listaPlantillas = Selector('[id$="_SlbListaPlantillas"]');
    const cargando = Selector('#divImgLoading, .dx-loadpanel-content, .erp-loading, [class*="spinner"]').filterVisible();
    const toastError = Selector('.erp-toast[data-type="error"]').filterVisible();

    await Web.ingresarAplicacion(t, config);
    await Web.abrirReportes360(t, 'Cartera');
    await t
        .expect(listaPlantillas.with({ timeout: 20000 }).exists).ok('No cargó la lista de plantillas del reporte')
        .click(listaPlantillas)
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText('Cartera X Edades'))
        .wait(1500)
        .click(Selector('[id$="_BtnGenerar"]').filterVisible())
        .wait(5000);

    // La barra del reporte trae "Opciones Exportación", "PDF" y "Excel" (ya no hay un botón "Exportar").
    const exportar = Selector('[id$="_BtnExportar"], [id$="_BtnExcel"], .dx-button').filterVisible().withText(/^\s*(Exportar|Excel)\s*$/i);
    await t
        .expect(exportar.with({ timeout: 15000 }).exists).ok('No apareció el botón de exportar a Excel')
        .click(exportar.nth(0));
    const mostroCarga = await cargando.with({ timeout: 3000 }).exists;
    await t
        .wait(5000)
        .expect(toastError.exists).notOk(`La exportación terminó con error${mostroCarga ? '' : ' (no se vio indicador de carga)'}`);
    await Web.cerrarSesion360(t);
}

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresar(t, config);
    await abrirReportes(t, 'Cartera');
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

fixture `Prueba boton exportar reportes Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba boton exportar reportes Admin Hgi360`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin Hgi360', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin testhappgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin mihappgi`
    .page(miHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba boton exportar reportes Admin mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig, ingresarAplicacionMiHappgi);
});
