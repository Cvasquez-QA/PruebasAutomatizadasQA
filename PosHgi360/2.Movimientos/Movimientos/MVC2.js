import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360,
    abrirMovimientos360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CAJA = '10 - Caja Automatizacion';
const TX_PV = '01PV - PRUEBA FACTURA PV';
const FILTRO_TERCERO = 'hgi';
const PRODUCTO = '010202';

async function ejecutarPruebaMovimientoCaja(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Movimientos de Caja');
    await t
        .click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(CAJA).nth(8))
        .wait(2000);

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
    const precioDoc = parseInt(await stringValue.innerText);

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

    await abrirMovimientos360(t, 'Movimientos de Caja');
    await t
        .click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(CAJA).nth(8))
        .wait(8000);

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

fixture `Prueba Movimiento de Caja testERP Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba valores luego de un documento testerp - Hgi360 Pos', async t => {
    await ejecutarPruebaMovimientoCaja(t, hgiPosConfig);
});
