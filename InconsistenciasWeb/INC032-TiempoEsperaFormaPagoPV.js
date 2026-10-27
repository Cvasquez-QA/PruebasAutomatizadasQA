import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    abrirPagoPV,
    abrirPuntoDeVenta360,
    agregarProductoPV,
    cancelarPagoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';

/**
 * INC32 - En el pago del Punto de Venta, el buscador de formas de pago carga la lista (incluida "Transferencia")
 * sin quedarse esperando (test.hgi360.com, POS). No paga: cancela el pago y elimina el temporal.
 */

const popupFormasPago = Selector('#PuntoDeVenta_modal_F4_FormaPago');

fixture `Prueba Tiempo espera Forma Pago PV testerp`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Tiempo espera Forma Pago PV testerp', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);

    try {
        await agregarProductoPV(t, '010203', '1');
        await abrirPagoPV(t);
        await t
            .click('#txtPuntoDeVentaPagoPos_Detalle_FPago_cursor_1_tarjeta')
            .expect(popupFormasPago.find('tr.dx-data-row').filterVisible().withText('Transferencia').with({ timeout: 10000 }).exists)
            .ok('No se visualiza la forma de pago "Transferencia" en el buscador de formas de pago')
            .pressKey('esc')
            .wait(800);
    } finally {
        const cerrarPopup = popupFormasPago.find('.erp-popup-header-close, [aria-label="Close"], .dx-closebutton').filterVisible();
        if (await cerrarPopup.exists) {
            await t.click(cerrarPopup.nth(0));
        }
        if (await Selector('#PuntoDeVenta_ModalPagoDocumento').filterVisible().exists) {
            await cancelarPagoPV(t).catch(() => undefined);
        }
        await eliminarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
