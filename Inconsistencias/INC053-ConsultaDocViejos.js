import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';

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

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, es360 ? 'Documentos' : 'DOCUMENTOS');
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

fixture `Prueba consulta documentos Admin testerp`
    .page(testAdminConfig.pagina);

test('Prueba consulta documentos fechas pasadas testerp Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba consulta documentos mihgi deverp`
    .page(hgi360AdminConfig.pagina);

test('Prueba consulta documentos fechas pasadas mihgi Admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba consulta documentos Admin testhappgi`
    .page(testHappgiAdminConfig.pagina);

test('Prueba consulta documentos fechas pasadas testhappgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});
