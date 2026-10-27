import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { cargarDocumento360, eliminarDocumentoActual360, elegirTerceroDocumento, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';

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
    await abrirMovimiento(t, 'Documentos');
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

/**
 * Hgi360 (ERP web): el vendedor se cambia DESPUÉS de guardar el encabezado (sin elegir dependencia);
 * al guardar y volver a cargar el documento debe conservarse. El documento se elimina.
 */
async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await nuevoDocumento360(t, 'INC025', 'INC025');
    await elegirTerceroDocumento(t, '811021438');
    const numero = await guardarDocumento360(t);
    try {
        await Web.elegirEnLookup360(t, '#Documento_Vendedor', '0 - GENERAL', 'general');
        await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
        await cargarDocumento360(t, numero);
        await t
            .expect(Selector('#Documento_Vendedor .dx-lookup-field').innerText).contains('GENERAL', 'No se cambió el vendedor por el seleccionado');
    } finally {
        await eliminarDocumentoActual360(t);
    }
    await Web.cerrarSesion360(t);
}

fixture `Prueba Cambio de Vendedor sin dependencia - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cambio de vendedor sin dependencia - Test Hgi360 Admin', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba Cambio de Vendedor sin dependencia - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cambio de vendedor sin dependencia - Hgi360 Admin', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba Cambio de Vendedor testhappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cambio de TESTHappgi admin', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig, {
        textoTerceroDian: '811021438 - HGI S.A.S',
        selectorVendedor: Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - GENERAL').nth(8),
    });
});
