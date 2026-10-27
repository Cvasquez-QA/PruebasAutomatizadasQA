import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMovimientos360,
    abrirTransaccion,
    buscarConsecutivoDoc,
    cerrarSesion360,
    descargarUnSoloPedido,
    elegirEnLookup360,
    eliminarDocumento,
    esperarValorVisible,
    ingresarAplicacion,
    ingresarDetalle,
    limpiarCacheChromeTestCafe,
    parseValorNumerico
} from '../Funciones/HelpersHgi360Web.js';

/**
 * INC03 - Descarga de pedidos en una factura (test.hgi360.com, POS > Movimientos > Documentos).
 * Crea un pedido 07QA, lo descarga en una factura 01QA y valida que la factura traiga el producto
 * y la cantidad del pedido. Borra la factura y el pedido.
 */

const TERCERO = '811021438 - HGI S.A.S';
const btnNuevo = Selector('#BtnNuevoDocumento_btn, #BtnNuevoDocumento').filterVisible();
const btnGuardar = Selector('#BtnGuardarDocumento_btn').filterVisible();

const toastError = Selector('.erp-toast[data-type="error"]').filterVisible();

/**
 * Transacción, tercero y Guardar del encabezado (crea el documento).
 * La 01QA no deja repetir el documento de referencia por tercero ("El Documento Referencia 0 ya existe..."):
 * para ella se pasa una referencia única (el campo solo acepta números).
 */
async function encabezado(t, transaccion, referencia = null) {
    await abrirTransaccion(t, transaccion);
    await elegirEnLookup360(t, '#Documento_Tercero', TERCERO, 'hgi');
    if (referencia) {
        await t.typeText('#txtDocumento_Referencia .dx-texteditor-input', referencia, { replace: true });
    }
    await t.click(btnGuardar).wait(2000);
    if (await toastError.exists) {
        await t.expect(false).ok(`No se guardó el encabezado ${transaccion}: ${(await toastError.innerText).trim()}`);
    }
}

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC03-DescargaPedidosPos', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirMovimientos360(t, 'Documentos');

    await t.click(btnNuevo.with({ timeout: 15000 }));
    await encabezado(t, '07QA');
    // Guardar el encabezado ya crea el pedido: desde aquí cualquier fallo debe borrarlo
    let numeropedido = String(await Selector('#txtDocumento .dx-texteditor-input').value || '').trim();
    if (!numeropedido) {
        const panel = await Selector('#PnlGestionDocumentos').innerText;
        numeropedido = (panel.match(/[ÚU]ltimo documento:\s*(\d+)/i) || [])[1] || '';
    }
    await t.expect(numeropedido).notEql('', 'No se capturó el consecutivo del pedido');

    let facturaCreada = false;
    try {
        await ingresarDetalle(t, '010203', '10');
        await t.click(btnGuardar).wait(2000);

        await t.click(btnNuevo);
        await encabezado(t, '01QA', String(Date.now()).slice(-7));
        facturaCreada = true;

        await descargarUnSoloPedido(t, numeropedido);
        await t.wait(2000);
        await t.expect(await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input'))
            .gt(0, `La factura quedó en 0 después de descargar el pedido ${numeropedido}`);
        await esperarValorVisible(t, '010203');
        await esperarValorVisible(t, '10,00');
    } finally {
        // Un error en la limpieza no debe tapar el fallo original de la prueba
        const cancelarPedidos = Selector('#btnCancelarPedidos_documentos_btn').filterVisible();
        if (await cancelarPedidos.exists) {
            await t.click(cancelarPedidos).wait(1000);
        }
        if (facturaCreada) {
            await eliminarDocumento(t).catch(() => undefined);
        }
        await t.click(btnNuevo).catch(() => undefined);
        await abrirTransaccion(t, '07QA').catch(() => undefined);
        await buscarConsecutivoDoc(t, numeropedido).catch(() => undefined);
        await eliminarDocumento(t).catch(() => undefined);
    }

    await cerrarSesion360(t);
});
