import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    parseValorNumerico,
    limpiarCacheChromeTestCafe,
    TX_DOCUMENTO,
    TERCERO,
    PRODUCTO
} from '../../../Funciones/HelpersHgi360Web.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Pagos - Recibo de caja (test.hgi360.com, empresa 8902)
 *  1. Crea una factura 01FE al tercero 1000099598 (producto 010203, 1 x 1000).
 *  2. Crea un recibo "01 - RECIBO DE CAJA", descarga la factura desde la cartera,
 *     registra el movimiento bancario por el total y valida diferencia 0.
 *  3. Guarda el recibo, lo elimina y elimina la factura.
 *
 * Selectores validados contra la versión React de test.hgi360.com.
 */

const TX_PAGO = '01 - RECIBO DE CAJA';
const FILTRO_TX_PAGO = 'RECIBO DE CAJA';
const FORMA_PAGO = '01';
const BANCO = '01';
const NATURALEZA = '1';
const CANTIDAD = '1';
const VALOR_UNITARIO = '1000';

const btnConfirmarDialogo = Selector('button.swal2-confirm').filterVisible();
const esqueleto = Selector('.erp-page-skeleton-toolbar').filterVisible();

/** Opción visible de un lookup cuyo texto empieza por el prefijo (p. ej. "1000099598 - ..."). */
const opcionQueEmpieza = prefijo => Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-item-content')
    .withText(new RegExp(`^\\s*${prefijo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));

/** Opción visible de un lookup con el texto exacto. */
const opcionExacta = texto => Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-item-content')
    .withExactText(texto);

async function elegirEnLookup(t, lookup, filtro, opcion) {
    await t.click(`${lookup} .dx-lookup-field`);
    await filtrarPor(t, filtro);
    await t
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No apareció la opción buscada con "${filtro}" en ${lookup}`)
        .click(opcion);
}

async function escribir(t, selector, valor) {
    await t
        .typeText(selector, String(valor), { replace: true })
        .pressKey('enter')
        .wait(800);
}

/* ----------------------------------------------------------------------------
 * Factura (Movimientos > Documentos)
 * --------------------------------------------------------------------------*/

async function abrirNuevoDocumento(t) {
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(esqueleto.exists).notOk({ timeout: 20000 })
        .click(Selector('#BtnNuevoDocumento').filterVisible())
        .expect(Selector('#Documento_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se abrió el formulario de documentos');
    await elegirEnLookup(t, '#Documento_Transaccion', TX_DOCUMENTO, opcionQueEmpieza(`${TX_DOCUMENTO} -`));
}

async function crearFactura(t) {
    await abrirNuevoDocumento(t);
    await elegirEnLookup(t, '#Documento_Tercero', TERCERO, opcionQueEmpieza(`${TERCERO} -`));

    // Encabezado
    await t
        .click('#BtnGuardarDocumento_btn')
        .wait(3000);

    // Detalle: producto, cantidad y valor unitario
    // Al confirmar el producto la app lo carga (~0,7 s), reinicia cantidad/valor y pasa el foco a Remesa
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO, { replace: true })
        .pressKey('enter')
        .expect(Selector('#txtDocumento_Detalle_Producto_Remesa_1').focused)
        .ok(`No terminó de cargar el producto ${PRODUCTO}`, { timeout: 10000 })
        .wait(500);
    await t.typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD, { replace: true });
    await t.typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', VALOR_UNITARIO, { replace: true });
    await t.click('#txtDocumento_Detalle_Boton_1 .dx-icon-save');

    // El total se recalcula entre 2 y 5 s después de grabar la línea
    let valorDocumento = 0;
    for (const inicio = Date.now(); valorDocumento <= 0 && Date.now() - inicio < 15000;) {
        await t.wait(500);
        valorDocumento = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');
    }
    await t.expect(valorDocumento).gt(0, 'El total de la factura quedó en 0');

    await t
        .click('#BtnGuardarDocumento_btn')
        .wait(4000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;
    await t.expect(numeroDocumento).ok('La factura no quedó con número de documento');

    await cerrarPestana360(t);
    return { valorDocumento, numeroDocumento };
}

async function eliminarFactura(t, numeroDocumento) {
    await abrirNuevoDocumento(t);
    await t
        .typeText('#txtDocumento .dx-texteditor-input', numeroDocumento, { replace: true })
        .pressKey('enter')
        .wait(3000)
        .expect(Selector('#Documento_Tercero').withText(TERCERO).exists)
        .ok(`No cargó la factura ${numeroDocumento} para eliminarla`)
        .click('#BtnEliminarDocumento_btn')
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .wait(3000);
    await cerrarPestana360(t);
}

/* ----------------------------------------------------------------------------
 * Recibo de caja (Movimientos > Pagos)
 * --------------------------------------------------------------------------*/

async function ejecutarPruebaPagos(t, config) {
    await ingresarAplicacion(t, config);

    const { valorDocumento, numeroDocumento } = await crearFactura(t);

    // Encabezado del recibo
    await abrirMovimientos360(t, 'Pagos');
    await t
        .expect(esqueleto.exists).notOk({ timeout: 20000 })
        .click('#BtnNuevoDocumentosPagoConsulta')
        .expect(Selector('#TxtDocumentosPago_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se abrió el formulario de pagos');
    await elegirEnLookup(t, '#TxtDocumentosPago_Transaccion', FILTRO_TX_PAGO, opcionExacta(TX_PAGO));
    await elegirEnLookup(t, '#TxtDocumentosPago_Tercero', TERCERO, opcionQueEmpieza(`${TERCERO} -`));

    // Guardar el encabezado carga la cartera del tercero
    await t
        .click('#BtnGrabarDocumentosPago')
        .wait(4000);
    const numeroRecibo = await Selector('#TxtDocumentosPago_Documento .dx-texteditor-input').value;
    await t.expect(numeroRecibo).ok('El recibo no quedó con número de documento');

    // Descargar la factura desde la cartera.
    // La cartera del tercero tiene más de 100 líneas y la factura nueva queda muy abajo del área visible,
    // así que primero se filtra el grid con su buscador para que la línea quede de primera.
    await t
        .expect(Selector('#gridCartera tr.dx-data-row').with({ timeout: 15000 }).exists)
        .ok('No cargó la cartera del tercero')
        .typeText('#gridCartera .dx-datagrid-search-panel .dx-texteditor-input', String(numeroDocumento), { replace: true })
        .wait(2500);

    const filaCartera = Selector('#gridCartera tr.dx-data-row')
        .find('td')
        .withExactText(String(numeroDocumento))
        .parent('tr.dx-data-row')
        .nth(0);
    await t
        .expect(filaCartera.with({ timeout: 15000 }).exists).ok(`No se encontró la factura ${numeroDocumento} en la cartera`)
        .click(filaCartera.find('[aria-label="Descargar Documento"]'))
        .expect(Selector('#gridDocumentos_DetallePago td').withExactText(String(numeroDocumento)).with({ timeout: 10000 }).exists)
        .ok(`La factura ${numeroDocumento} no pasó al detalle del recibo`);

    // Movimiento bancario por el total de la factura
    await escribir(t, '#txtDocPago_Banco_FormaPago_cursor_1', FORMA_PAGO);
    await escribir(t, '#txtDocPago_Banco_Banco_cursor_1', BANCO);
    await escribir(t, '#txtdocumento_DocRef_pago_DocRef_cursor_1', numeroDocumento);
    await escribir(t, '#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA);
    await escribir(t, '#txtdocumento_banco_pago_Valor_cursor_1', valorDocumento);
    // El foco queda en el botón de guardar la línea bancaria: Enter la graba
    await t
        .pressKey('enter')
        .wait(3000);

    const diferencia = await parseValorNumerico('#TxtDocumentosPago_Diferencia .dx-texteditor-input');
    await t.expect(diferencia).eql(0, `La diferencia del pago debe ser 0 (quedó en ${diferencia})`);

    // Guardar y eliminar el recibo
    await t
        .click('#BtnGrabarDocumentosPago')
        .wait(3000)
        .click('#BtnAnularDocumentosPago')
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .wait(3000)
        .expect(Selector('#TxtDocumentosPago_Documento .dx-texteditor-input').value).eql('', `No se eliminó el recibo ${numeroRecibo}`);
    await cerrarPestana360(t);

    // Eliminar la factura
    await eliminarFactura(t, numeroDocumento);
    await cerrarSesion360(t);
}

fixture `CRUD_Pagos - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    })
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Pago - Recibo de Caja - Test Hgi360', async t => {
    await ejecutarPruebaPagos(t, testGourmetConfig);
});
