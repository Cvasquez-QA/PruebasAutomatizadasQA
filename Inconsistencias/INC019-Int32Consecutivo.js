import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function aceptarCierreCajaSiAparece(t) {
    if (await Selector('.swal2-content div').withText('Desea cerrar la operación de esta caja?').exists) {
        await t.click(Selector('button').withText('Aceptar').nth(1));
    }
}

async function ejecutarPrueba(t, config, filtroPv, textoPv) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimientoPos(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '25');
    await t
        .click('#txtDocumento')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtDocumento'), '2147483648')
        .pressKey('enter')
        .expect(Selector('div').withText('El número de documento supera el valor permitido').nth(2).exists).ok('El mensaje es diferente o no se muestra')
        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMovimientoPos(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('.dx-list-item').withText(config.caja))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'));
    await aceptarCierreCajaSiAparece(t);
    await t
        .wait(3000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), filtroPv)
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(textoPv).nth(8))
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtPuntoDeVenta_DocumentoNew'), '2147483648')
        .wait(4000)
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('.dx-toast-content.dx-toast-error').exists).ok('El mensaje es diferente o no se muestra')
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen'))
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba int32 testERP`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Consecutivo int32 CRUD', async t => {
    await ejecutarPrueba(t, testPosConfig, '0101', '0101 - PRUEBA FACTURA PV');
});

fixture `Prueba int32 testhappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Consecutivo int32 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig, '01', '01PV - FACTURA DE VENTA ELECTRÓNICA PV');
});
