import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    abrirPuntoDeVenta360,
    agregarProductoPV,
    cancelarPagoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    leerPagoPV,
    leerTotalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';
import { testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * Al pulsar Pago justo después de grabar la línea, el pago no debe abrirse con un total desactualizado:
 * sale "Totalizando documento, espere un momento…" o el modal de pago muestra el total del documento.
 */
async function ejecutarPrueba360(t, config) {
    const modalPago = Selector('#PuntoDeVenta_ModalPagoDocumento').filterVisible();
    const totalizando = Selector('.swal2-popup').filterVisible().withText(/Totalizando documento/i);
    await ingresarAplicacion360(t, config);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    try {
        await agregarProductoPV(t, '01', '1');
        const total = await leerTotalPV();
        await t.click(Selector('#PuntoDeVenta_BtnPago').filterVisible());
        await t.expect(Selector('#PuntoDeVenta_ModalPagoDocumento, .swal2-popup').filterVisible().with({ timeout: 15000 }).exists)
            .ok('Pago no respondió');
        if (await totalizando.exists) {
            await t.click(Selector('button.swal2-confirm').filterVisible());
        } else {
            const { total: totalPago } = await leerPagoPV();
            await t.expect(totalPago).eql(total, `El pago abrió con un total (${totalPago}) distinto al del documento (${total})`);
            await cancelarPagoPV(t);
        }
    } finally {
        if (await modalPago.exists) {
            await cancelarPagoPV(t);
        }
        await eliminarTemporalPV(t);
        await salirPuntoDeVenta360(t);
    }
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config, transaccion) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Punto de Venta');
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(transaccion))
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .expect(Selector('#PuntoDeVenta_ModalValidacionDIAN h5').withText('Validación Tercero').visible).ok('No está saliendo el control del tercero')
        .click(Selector('#PuntoDeVenta_ModalValidacionDIAN_BtnCancelar span').withText('Cancelar'))
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '01')
        .wait(1500)
        .click('#txtPuntoDeVenta_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPuntoDeVenta_Detalle_Cantidad_cursor_1', '1')
        .click('#txtPuntoDeVenta_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPuntoDeVenta_Detalle_ValorUnitario_cursor_1', '1000')
        .click(Selector('.dx-icon.dx-icon-check'))
        .click(Selector('#PuntoDeVenta_BtnPago'))
        .expect(Selector('.swal2-content div').withText('Totalizando documento, espere un momento…').visible).ok('no salió el mensaje genérico')
        .click('#PuntoDeVenta_ModalPagoDocumento_BtnCancelar span')
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .switchToMainWindow()
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla div i'))
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC077 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC077 POS - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC077 happgi POS`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC077 PV HAPPGI', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig, '01PV - PRUEBA FACTURA PV');
});
