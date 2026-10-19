import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

const abrirFacturador = async (t, config) => {
    await t.switchToMainWindow();
    if (esHgi360(config)) {
        await t
            .click(Selector('#ErpSidebarModulos span').withText('Facturación Electrónica'))
            .click(Selector('#ErpMenuCardGrid span').withText('Facturador'))
            .wait(1500)
            .switchToIframe(HelpersHgi360.iframeTab)
            .wait(1500);
    } else {
        await t
            .click(Selector('a').withText('Facturación Electrónica'))
            .click(Selector('a').withText('Facturador'))
            .wait(1500)
            .switchToIframe(HelpersHappgi.iframeTab)
            .wait(1500);
    }
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '01FE');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);

    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01')
        .pressKey('enter')
        .doubleClick('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .doubleClick('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(3000);

    await cerrarPestana(t);
    await t.wait(3000);
    await abrirFacturador(t, config);

    await t
        .click(Selector('#Documentos_Electronicos_Transaccion .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '01FE')
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText('01FE - PRUEBA FACTURA DE VENTA ELECTRÓNICA QA'))
        .click(Selector('#BtnConsultarDocumentosElectronicos span').withText('Cargar'))
        .wait(3000)
        .wait(1500)
        .click(Selector('.dx-checkbox-container .dx-checkbox-icon'))
        .click(Selector('#BtnEnvioDian span').withText('ENVIAR'))
        .expect(Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div').withText('No se puede realizar el envío.'));

    await cerrarSesion(t);
}

fixture `INC082 Envio Masivo Facturador Happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC082 Envio Masivo Facturador Happgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `INC082 Envio Masivo Facturador HGI360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC082 Envio Masivo Facturador HGI360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
