import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, elegirEnLookup360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    TX_PV,
    TX_PV_FILTRO,
    abrirPuntoDeVenta360,
    agregarProductoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    esperarTotalPV,
    limpiarTemporalPV,
    pagarEfectivoPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';

/**
 * INC09 - Nota crédito de un producto ensamble (pp01) en el Punto de Venta (test.hgi360.com, POS).
 * Crea la nota crédito 85 con referencia a una factura 0101 y valida que carguen sus líneas.
 * La nota queda como temporal y se elimina al final.
 *  - INC09: la factura de referencia se paga (queda finalizada; no se puede borrar).
 *  - INC09.2: la referencia es el documento temporal sin pagar; al final se elimina también ese temporal.
 */

const PRODUCTO_ENSAMBLE = 'pp01';
const TX_NOTA_FILTRO = 'NOTA';
const TX_NOTA = '85 - NOTA CREDITO PUNTO DE VENTA';
const TERCERO = '811021438 - HGI S.A.S';
const aviso = Selector('.swal2-popup').filterVisible();
const confirmar = Selector('button.swal2-confirm').filterVisible();
const documentoNew = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');
const cargarReferencia = Selector('#PuntoDeVenta_documento_ref .dx-icon-arrowdown').filterVisible();

/** Si sale un aviso: falla con su texto cuando es un error; si no, lo confirma. */
async function atenderAviso(t, paso) {
    if (!await aviso.with({ timeout: 4000 }).exists) {
        return;
    }
    const texto = (await aviso.innerText).replace(/\s+/g, ' ').trim();
    await t.expect(/no existe|debes?|error|no se puede|inv[aá]lid/i.test(texto)).notOk(`${paso}: el ERP respondió "${texto}"`);
    await t.click(confirmar).wait(1500);
}

/** Antes de limpiar: un aviso abierto tapa los botones del Punto de Venta. */
async function cerrarAvisoAbierto(t) {
    if (await confirmar.exists) {
        await t.click(confirmar).wait(1000);
    }
}

// En el ERP React la referencia (transacción y documento) va antes de guardar el encabezado:
// sin ella, Guardar responde "El documento 0 no existe".
async function crearNotaCreditoConReferencia(t, numeroReferencia) {
    await elegirTransaccionPV(t, TX_NOTA_FILTRO, TX_NOTA);
    await elegirEnLookup360(t, '#PuntoDeVenta_Tercero', TERCERO, 'hgi');
    await elegirEnLookup360(t, '#PuntoDeVenta_NotasDIAN', '6 - Otros');
    await elegirEnLookup360(t, '#PuntoDeVenta_transaccion_ref', TX_PV, TX_PV_FILTRO);
    await t.typeText('#PuntoDeVenta_documento_ref .dx-texteditor-input', String(numeroReferencia), { replace: true });
    if (await cargarReferencia.exists) {
        await t.click(cargarReferencia);
        await atenderAviso(t, `Cargar el documento de referencia ${numeroReferencia}`);
    }

    await t.click(Selector('#PuntoDeVenta_BtnGuardarDocumento').filterVisible());
    await atenderAviso(t, 'Guardar el encabezado de la nota crédito');
    await t.expect(Selector('.erp-toast[data-type="error"]').filterVisible().with({ timeout: 3000 }).exists)
        .notOk('El ERP mostró un error al guardar la nota crédito');
    await esperarTotalPV(t, total => total !== 0,
        `No se cargaron en la nota crédito las líneas del documento ${numeroReferencia}`, 20000);
}

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

/**
 * La factura de INC09 queda finalizada y no se puede borrar: antes de crearla se valida que la nota 85
 * ofrezca la 0101 como transacción de referencia.
 */
async function validarReferenciaDisponible(t) {
    await elegirTransaccionPV(t, TX_NOTA_FILTRO, TX_NOTA);
    await t.click('#PuntoDeVenta_transaccion_ref .dx-lookup-field');
    const buscador = Selector('.dx-overlay-content').filterVisible().find('.dx-texteditor-input');
    if (await buscador.with({ timeout: 5000 }).exists) {
        await t.typeText(buscador, TX_PV_FILTRO, { replace: true }).wait(2000);
    }
    const opcion = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(TX_PV_FILTRO);
    const disponible = await opcion.with({ timeout: 8000 }).exists;
    await t.pressKey('esc').wait(800);
    await t.expect(disponible).ok(`La nota ${TX_NOTA} no ofrece la transacción ${TX_PV} como referencia ("Transacción de referencia" sin datos)`);
}

test('INC09-NotaCreditoEnsamble', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await validarReferenciaDisponible(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    await agregarProductoPV(t, PRODUCTO_ENSAMBLE, '1');
    await pagarEfectivoPV(t);
    const factura = (await Selector('#lblPuntoDeVenta_UltimoDocumento').innerText).trim();
    await t.expect(factura).notEql('', 'No se capturó el número de la factura');

    try {
        await crearNotaCreditoConReferencia(t, factura);
    } finally {
        await cerrarAvisoAbierto(t);
        await eliminarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});

test('INC09.2-NotaCreditoEnsamble', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    await agregarProductoPV(t, PRODUCTO_ENSAMBLE, '1');
    const temporal = String(await documentoNew.value).trim();
    await t.expect(temporal).notEql('', 'No se capturó el número del documento temporal');

    try {
        await crearNotaCreditoConReferencia(t, temporal);
    } finally {
        await cerrarAvisoAbierto(t);
        await eliminarTemporalPV(t).catch(() => undefined);
        await elegirTransaccionPV(t).catch(() => undefined);
        await limpiarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
