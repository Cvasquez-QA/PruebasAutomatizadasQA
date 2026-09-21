import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, esHgi360(config) ? 'Pagos' : 'PAGOS');
    await t
        .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
        .wait(4000)
        .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
        .click(Selector('.dx-overlay-content .dx-item-content').withText('RECIBO DE CAJA'))
        .click('#TxtDocumentosPago_Tercero .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'hgi')
        .wait(1500)
        .click(Selector('.dx-overlay-content .dx-item-content').withText('811021438'))
        .click(Selector('#BtnGrabarDocumentosPago span').withText('Guardar'))
        .wait(3000)
        .click('#txtDocPago_Banco_FormaPago_1 .dx-icon.dx-icon-search')
        .wait(2000)
        .click(Selector('#gridF4FormaPagos td').withText('1'))
        .pressKey('enter')
        .click('#txtDocPago_Banco_Banco_1 .dx-icon.dx-icon-search')
        .wait(2000)
        .click(Selector('#gridF4Bancos td').withText('07'))
        .pressKey('enter')
        .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', '123123123')
        .click('#txtDocPago_Banco_Naturaleza_1 .dx-icon.dx-icon-search')
        .wait(2000)
        .doubleClick(Selector('#gridF4Naturalezas td').withText('1'))
        .pressKey('enter')
        .doubleClick('#txtdocumento_banco_pago_Valor_cursor_1')
        .typeText('#txtdocumento_banco_pago_Valor_cursor_1', '999')
        .pressKey('enter enter enter')
        .expect(Selector('div').withText('El proceso anterior, aun no ha terminado').visible).ok('No se muestra el mensaje de proceso aun no termina')
        .wait(1500)
        .click(Selector('#BtnAnularDocumentosPago span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
    await cerrarPestana(t);
    await cerrarSesion(t);
}

fixture `Prueba Pagos Happgi Admin`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
