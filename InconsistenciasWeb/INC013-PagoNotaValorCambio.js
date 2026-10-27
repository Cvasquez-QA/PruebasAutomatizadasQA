import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    abrirPagoPV,
    abrirPuntoDeVenta360,
    agregarProductoPV,
    cancelarPagoPV,
    cerrarAvisoPV,
    crearNotaCreditoPV,
    elegirTransaccionPV,
    eliminarPagosPV,
    eliminarTemporalPV,
    leerPagoPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360,
    validarReferenciaNotaPV
} from '../Funciones/HelpersPos360.js';

/**
 * INC13 - Pago de una nota crédito con F8 en el Punto de Venta: el cambio debe quedar en 0 (test.hgi360.com, POS).
 * La nota referencia el temporal de una factura 0101 sin pagar; al final se eliminan la nota y ese temporal.
 * (INC14 hace lo mismo enviando F8 al documento: INC014-PagoNotaValorCambioTeclaF8.js)
 */

const documentoNew = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');
const modalPago = Selector('#PuntoDeVenta_ModalPagoDocumento').filterVisible();

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC13-PagoNotaValorCambio', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await validarReferenciaNotaPV(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    await agregarProductoPV(t, 'pp01', '1');
    const temporal = String(await documentoNew.value).trim();
    await t.expect(temporal).notEql('', 'No se capturó el número del documento temporal');

    try {
        await crearNotaCreditoPV(t, temporal);
        await abrirPagoPV(t);
        await t.pressKey('f8').wait(3000);
        const { cambio } = await leerPagoPV();
        await t.expect(cambio).eql(0, `No quedó el cambio en 0 al pagar la nota con F8 (cambio: ${cambio})`);
    } finally {
        await cerrarAvisoPV(t);
        if (await modalPago.exists) {
            await eliminarPagosPV(t).catch(() => undefined);
            await cancelarPagoPV(t).catch(() => undefined);
        }
        await eliminarTemporalPV(t).catch(() => undefined);
        await elegirTransaccionPV(t).catch(() => undefined);
        await limpiarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
