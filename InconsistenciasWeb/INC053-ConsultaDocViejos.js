import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

/** Hgi360 (ERP web): la consulta de Documentos con fechas de 2014 debe traer documentos. */
async function ejecutarPrueba360(t, config) {
    const lista = Selector('[data-testid="ListagridDocumentos"], #ListagridDocumentos').filterVisible();
    await Web.ingresarAplicacion(t, config);
    await Web.abrirMovimientos360(t, 'Documentos');
    await t
        .expect(Selector('#Documento_Consulta_FechaInicial .dx-texteditor-input').with({ timeout: 20000 }).exists)
        .ok('No está el filtro de fecha inicial de Documentos')
        .typeText('#Documento_Consulta_FechaInicial .dx-texteditor-input', '2014-01-01', { replace: true })
        .pressKey('enter')
        .typeText('#Documento_Consulta_FechaFinal .dx-texteditor-input', '2014-01-30', { replace: true })
        .pressKey('enter')
        .click(Selector('#ButtonConsultar_btn, #ButtonConsultar').filterVisible().nth(0))
        .wait(2000)
        // Mientras consulta la grid muestra filas "esqueleto" y el botón Consultar queda deshabilitado
        .expect(Selector('.erp-grid-skeleton, [class*="skeleton"]').filterVisible().exists).notOk('La consulta de documentos de enero de 2014 no terminó en 3 minutos', { timeout: 180000 })
        .expect(lista.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible().with({ timeout: 30000 }).exists)
        .ok('La consulta de documentos no terminó')
        .expect(lista.find('tr.dx-data-row').filterVisible().withText(/2014/).exists).ok('No se encontraron documentos de enero de 2014');
    await Web.cerrarSesion360(t);
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'Documentos');
    await t
        .click('#Documento_Consulta_FechaInicial .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#Documento_Consulta_FechaInicial .dx-texteditor-input', '2014-01-01')
        .click('#Documento_Consulta_FechaFinal .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#Documento_Consulta_FechaFinal .dx-texteditor-input', '14-01-30')
        .click(Selector('#ButtonConsultar span').withText('Consultar'))
        .wait(4500)
        .expect(Selector('#ListagridDocumentos span').withText('Sin datos').visible).notOk('No se encontraron datos')
        .wait(2000)
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba consulta documentos Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba consulta documentos fechas pasadas Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba consulta documentos Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba consulta documentos fechas pasadas Hgi360 Admin', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba consulta documentos Admin testhappgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba consulta documentos fechas pasadas testhappgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});
