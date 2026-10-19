import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360,
    abrirMovimientos360,
    abrirUtilitarios360,
    parseTextoNumerico,
    parseValorNumerico,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CAJA = '10 - Caja Automatizacion';
const CODIGO_CAJA = '10';
const TX_PV = '01PV - PRUEBA FACTURA PV';
const FILTRO_TERCERO = 'hgi';
const PRODUCTO = '010202';
const MSG_DOCS_TEMPORALES = 'Los siguientes documentos temporales se encuentran';
const MSG_CAJA_CERRADA = 'Caja cerrada exitosamente';
const TOTAL_CAJA = Selector('#moduleContainer [class^="cerrarcaja-MovC__TotalCaja"]');
const FILA_CIERRE = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"]').nth(1);

async function seleccionarCaja(t) {
    await t
        .click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(CAJA).nth(8))
        .wait(2000);
}

async function abrirMovimientosDeCaja(t) {
    await abrirMovimientos360(t, 'Movimientos de Caja');
    await seleccionarCaja(t);
}

async function iniciarCierreDeCaja(t) {
    await t
        .click(Selector('#BtnCerrarCajaMov span').withText('Cierre de caja'))
        .click(Selector('#BtnConfirmarCerrarCajaMov span').withText('Cerrar Caja'))
        .wait(1500);
}

async function eliminarTemporalesDeCaja(t) {
    await t.click(Selector('button').withText('Cerrar'));
    await cerrarPestana360(t);
    await abrirUtilitarios360(t, 'Gestión Temporales');

    const filtroCaja = Selector('.dx-datagrid-filter-row .dx-texteditor-input').nth(6);

    await t
        .click(filtroCaja)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroCaja, CODIGO_CAJA)
        .click(Selector('.dx-context-menu-container-border').nth(1))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] span').withText('Igual'))
        .wait(1500)
        .click(Selector('.dx-checkbox-container .dx-checkbox-icon'))
        .click(Selector('#BtnGestionTemporales_Eliminar span').withText('Eliminar Seleccionados'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000)
        .expect(Selector('#GestionTemporales_DocPendientes span').withText('Sin datos').visible).ok();

    await cerrarPestana360(t);
}

async function confirmarCierreConDenominaciones(t) {
    const totalCajaTexto = (await TOTAL_CAJA.value) || (await TOTAL_CAJA.innerText);
    const valorCaja = String(parseTextoNumerico(totalCajaTexto));

    const cantidadCierreCaja = FILA_CIERRE.find('.dx-cell-modified');
    const vlrUnitarioCierreCaja = FILA_CIERRE.find('.dx-cell-modified').nth(1);

    await t
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-dropdowneditor-icon').nth(2))
        .pressKey('down')
        .pressKey('enter')
        .click(cantidadCierreCaja)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(cantidadCierreCaja, '1')
        .click(vlrUnitarioCierreCaja)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(vlrUnitarioCierreCaja, valorCaja)
        .pressKey('enter')
        .click(Selector('#BtnConfirmarCerrarCajaMov span').withText('Cerrar Caja'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .expect(Selector('.swal2-content div').withText(MSG_CAJA_CERRADA).visible).ok()
        .click(Selector('button').withText('Aceptar'));
}

async function ejecutarPruebaCierreCaja(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientosDeCaja(t);
    await iniciarCierreDeCaja(t);

    const docsTemporales = Selector('.swal2-content div').withText(MSG_DOCS_TEMPORALES);
    if (await docsTemporales.exists && await docsTemporales.visible) {
        await eliminarTemporalesDeCaja(t);
        await abrirMovimientosDeCaja(t);
        await iniciarCierreDeCaja(t);
    }

    await confirmarCierreConDenominaciones(t);
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

async function ejecutarPruebaMovimientoCaja(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientosDeCaja(t);

    let stringValue = Selector('#PnlGridMovimientosCaja .text-danger.dx-texteditor-input');
    const precioRetiros = parseInt(await stringValue.innerText);

    stringValue = Selector('#PnlGridMovimientosCaja .text-green.dx-texteditor-input');
    const precioVentas = parseInt(await stringValue.innerText);

    stringValue = Selector('#PnlGridMovimientosCaja .dx-texteditor-input').nth(5);
    const precioBase = parseInt(await stringValue.innerText);

    stringValue = Selector('#PnlGridMovimientosCaja .dx-texteditor-input').nth(8);
    const precioSaldo = parseInt(await stringValue.innerText);

    await t
        .wait(4000)
        .expect(precioSaldo).notEql(0)
        .expect(precioSaldo).eql(precioBase + precioVentas + (-precioRetiros), 'el calculo no es correcto');
    await cerrarPestana360(t);

    await abrirMovimientos360(t, 'Punto de Venta');
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(CAJA).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000);

    const button = Selector('#PuntoDeVenta_BtnEliminarDocumento span');
    if (await button.visible) {
        await t
            .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
            .click(Selector('button').withText('Aceptar').nth(1));
    }

    await t
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(TX_PV))
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#PuntoDeVenta_Tercero div'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), FILTRO_TERCERO)
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', PRODUCTO)
        .wait(1500)
        .pressKey('enter')
        .click(Selector('.dx-icon.dx-icon-check'))
        .wait(4000)
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
        .click(Selector('#PuntoDeVenta_BtnPago span'));

    stringValue = Selector('#PuntoDeVenta_ModalPagoDocumento_PagoTotal .dx-texteditor-input');
    const strPrecio = await stringValue.value;
    const precioLimpio = strPrecio.replace(/\./g, '');
    const precioDoc = await parseValorNumerico('#PuntoDeVenta_ModalPagoDocumento_PagoTotal .dx-texteditor-input');

    await t
        .wait(4000)
        .typeText(Selector('#txtPuntoDeVentaPagoPos_Detalle_Valor_cursor_1'), precioLimpio)
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_ModalPagoDocumento_BtnAceptar span').withText('Finalizar'))
        .wait(8000)
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen'))
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000);
    await cerrarPestana360(t);

    await abrirMovimientosDeCaja(t);
    await t.wait(8000);

    const stringValor = Selector('#PnlGridMovimientosCaja .dx-texteditor-input').nth(8);
    const precioSaldoFinal = parseInt(await stringValor.innerText);

    await t.expect(precioSaldoFinal).eql(precioSaldo + precioDoc, 'el calculo no es correcto');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimiento de Caja testERP Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba valores luego de un documento testerp - Test Hgi360', async t => {
    await ejecutarPruebaMovimientoCaja(t, testPosConfig);
});

test('Prueba cierre de caja testerp - Test Hgi360', async t => {
    await ejecutarPruebaCierreCaja(t, testPosConfig);
});

fixture `Prueba Movimiento de Caja testERP Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba valores luego de un documento testerp - Hgi360 Pos', async t => {
    await ejecutarPruebaMovimientoCaja(t, hgiPosConfig);
});

test('Prueba cierre de caja testerp - Hgi360 Pos', async t => {
    await ejecutarPruebaCierreCaja(t, hgiPosConfig);
});
