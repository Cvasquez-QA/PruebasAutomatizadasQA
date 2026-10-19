import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config, abrirDocs) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirDocs(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, 'INC056');
    await t
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).ok('No muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#modal_Documento_validacion .close'))
        .click('#Documento_Dependencia .dx-lookup-field')
        .pressKey('down')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).notOk('Muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#Documento_Tercero .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '1000099598')
        .click(Selector('.dx-list-item').withText('1000099598 - Vasquez Suarez Camilo'))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).notOk('Muestra el mensaje de seleccionar la dependencia')
        .click('#BtnEliminarDocumento .dx-icon.dx-icon-close')
        .click(Selector('button').withText('Aceptar'))
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba dependencia 0 Admin testerp`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba dependencia 0 Admin testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig, abrirMovimiento);
});

fixture `Prueba dependencia 0 Pos testerp`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba dependencia 0 Pos testerp', async t => {
    await ejecutarPrueba(t, testPosConfig, abrirMovimientoPos);
});
