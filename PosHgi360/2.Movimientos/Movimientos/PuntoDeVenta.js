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
const TX_PV = '0101 - PRUEBA FACTURA PV';
const FILTRO_TERCERO = 'hgi';
const PRODUCTO = '010203';

fixture `Prueba Punto de Venta testERP Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Punto de venta Temporal - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
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

    const stringValue = Selector('#PuntoDeVenta_ModalPagoDocumento_PagoTotal .dx-texteditor-input');
    const strPrecio = await stringValue.value;
    const precioLimpio = strPrecio.replace(/\./g, '');

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
    await cerrarSesion360(t);
});

fixture `Prueba Punto de Venta testERP Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Punto de venta Temporal - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
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

    const stringValue = Selector('#PuntoDeVenta_ModalPagoDocumento_PagoTotal .dx-texteditor-input');
    const strPrecio = await stringValue.value;
    const precioLimpio = strPrecio.replace(/\./g, '');

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
    await cerrarSesion360(t);
});
