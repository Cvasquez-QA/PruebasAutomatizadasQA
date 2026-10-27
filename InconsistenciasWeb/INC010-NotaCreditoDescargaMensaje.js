import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, elegirEnLookup360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    TX_NOTA_PV,
    TX_NOTA_PV_FILTRO,
    TX_PV,
    TX_PV_FILTRO,
    abrirPuntoDeVenta360,
    agregarProductoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360,
    validarReferenciaNotaPV
} from '../Funciones/HelpersPos360.js';

/**
 * INC10 - Al cargar el documento de referencia en la nota crédito del Punto de Venta debe salir
 * "Desea cargar el detalle del documento" (test.hgi360.com, POS).
 * La referencia es el temporal de una factura 0101 sin pagar; al final se eliminan la nota y ese temporal.
 */

const TERCERO = '811021438 - HGI S.A.S';
const confirmar = Selector('button.swal2-confirm').filterVisible();
const documentoNew = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC10-NotaCreditoDescargaMensaje', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await validarReferenciaNotaPV(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    await agregarProductoPV(t, '010203', '1');
    const temporal = String(await documentoNew.value).trim();
    await t.expect(temporal).notEql('', 'No se capturó el número del documento temporal');

    try {
        await elegirTransaccionPV(t, TX_NOTA_PV_FILTRO, TX_NOTA_PV);
        await elegirEnLookup360(t, '#PuntoDeVenta_Tercero', TERCERO, 'hgi');
        await elegirEnLookup360(t, '#PuntoDeVenta_NotasDIAN', '6 - Otros');
        await elegirEnLookup360(t, '#PuntoDeVenta_transaccion_ref', TX_PV, TX_PV_FILTRO);
        await t
            .typeText('#PuntoDeVenta_documento_ref .dx-texteditor-input', temporal, { replace: true })
            .click(Selector('#PuntoDeVenta_documento_ref .dx-icon-arrowdown').filterVisible())
            .expect(Selector('.swal2-popup').filterVisible().withText('Desea cargar el detalle del documento').with({ timeout: 10000 }).exists)
            .ok('No salió el mensaje "Desea cargar el detalle del documento"')
            .click(confirmar)
            .wait(3000);
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar).wait(1000);
        }
        await eliminarTemporalPV(t).catch(() => undefined);
        await elegirTransaccionPV(t).catch(() => undefined);
        await limpiarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
