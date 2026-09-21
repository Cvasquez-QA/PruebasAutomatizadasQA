import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

const lookupDian = Selector('#Documento_ModalValidacionDIAN_Tercero .dx-lookup-field');

async function aceptarModalDianSiVisible(t, textoTercero) {
    if (await lookupDian.visible) {
        await t
            .click(Selector('#Documento_ModalValidacionDIAN_Tercero .dx-lookup-field'))
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '811021438')
            .wait(1500)
            .click(Selector('.dx-list-item').withText(textoTercero))
            .click(Selector('#Documento_ModalValidacionDIAN_BtnAceptar span').withText('Aceptar'));
    }
}

async function ejecutarPrueba(t, config, opciones = {}) {
    const {
        textoTransaccion = 'INC025 - PRUEBA FACTURA DE VENTA',
        textoTerceroDian = '811021438 - HGI S.A.S - HGI S.A.S',
        selectorVendedor = Selector('.dx-list-item').withText('0 - GENERAL'),
    } = opciones;

    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, es360 ? 'Documentos' : 'DOCUMENTOS');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, 'INC025');

    await aceptarModalDianSiVisible(t, textoTerceroDian);

    await t.click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
    await aceptarModalDianSiVisible(t, textoTerceroDian);

    await t
        .click(Selector('#Documento_Vendedor .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'general')
        .click(selectorVendedor)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(1500)
        .click('#txtDocumento')
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#Documento_Vendedor .dx-lookup-field').innerText).eql('GENERAL', 'No se cambió el vendedor por el seleccionado')
        .click('#BtnEliminarDocumento .dx-icon.dx-icon-close')
        .click(Selector('button').withText('Aceptar'))
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Cambio de Vendedor testerp`
    .page(testAdminConfig.pagina);

test('Prueba Cambio de vendedor TestErp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Cambio de Vendedor Hgi360`
    .page(hgi360AdminConfig.pagina);

test('Prueba Cambio de Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig, {
        textoTerceroDian: '811021438 - HGI S.A.S',
        selectorVendedor: Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - GENERAL').nth(8),
    });
});

fixture `Prueba Cambio de Vendedor testhappgi`
    .page(testHappgiPosConfig.pagina);

test('Prueba Cambio de TESTHappgi admin', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig, {
        textoTerceroDian: '811021438 - HGI S.A.S',
        selectorVendedor: Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - GENERAL').nth(8),
    });
});
