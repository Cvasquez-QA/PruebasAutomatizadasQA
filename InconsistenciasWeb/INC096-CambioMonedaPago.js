import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirMovimientos360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    parseTextoNumerico,
    parseValorNumerico
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    eliminarDocumentoSiExiste360,
    elegirTerceroDocumento,
    esperarTotalDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC096 - Factura 01FE en DOLAR y recibo "Recibo caja dolar" en DOLAR que la cancela: en la lista de pagos el valor
 * debe verse convertido con la TRM de la moneda (valor x TRM). Se eliminan el recibo y la factura.
 */

const TX_DOC = ['01FE', /^\s*01FE -/i];
const TERCERO = '1000099598';
const MONEDA = 'DOLAR';
const TX_PAGO = 'Recibo caja dolar';
const confirmar = Selector('button.swal2-confirm').filterVisible();
const numeroPago = Selector('#TxtDocumentosPago_Documento .dx-texteditor-input');

/** TRM de la moneda: valor de la primera fila del grid de cambios del maestro Monedas. */
const filasCambio = ClientFunction(() => {
    const grid = document.querySelector('#gridMonedaCambio, [data-testid="gridMonedaCambio"]');
    return grid ? Array.from(grid.querySelectorAll('tr.dx-data-row')).map(f => Array.from(f.cells).map(c => c.innerText.trim())) : null;
});

const filasListaPagos = ClientFunction(buscado => Array.from(document.querySelectorAll('tr.dx-data-row'))
    .filter(f => f.getClientRects().length && Array.from(f.cells).some(c => c.innerText.trim() === buscado))
    .map(f => Array.from(f.cells).map(c => c.innerText.trim())));

async function leerTrm(t) {
    await abrirMaestros360(t, 'Monedas');
    await buscarEnGrid360(t, 'gridMonedas', MONEDA);
    await t.wait(1500);
    await accionFilaGrid360(t, 'gridMonedas', MONEDA, 'Editar');
    await t.wait(2000);
    const filas = await filasCambio();
    await t.expect(filas && filas.length > 0).ok(`La moneda ${MONEDA} no tiene TRM registrada (grid de cambios: ${JSON.stringify(filas)})`);
    const numeros = filas[0].map(parseTextoNumerico).filter(n => n > 1);
    await t.expect(numeros.length).gt(0, `No se pudo leer la TRM de ${MONEDA}: ${filas[0].join(' | ')}`);
    const cancelar = Selector('[id^="BtnCancelarMoneda"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPestana360(t);
    return numeros[numeros.length - 1];
}

async function crearFacturaEnDolares(t) {
    await nuevoDocumento360(t, TX_DOC[0], TX_DOC[1]);
    await elegirTerceroDocumento(t, TERCERO);
    await t.click('#tabs_documento_Ubicacion');
    await elegirEnLookup360(t, '#Documento_Moneda', MONEDA);
    const numero = await guardarDocumento360(t);
    await agregarLineaDocumento(t, '010203', { cantidad: 1, valor: 1000 });
    const total = await esperarTotalDocumento(t, v => v > 0, 'El total de la factura quedó en 0');
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(4000);
    await cerrarPestana360(t);
    return { numero, total };
}

async function abrirNuevoPago(t) {
    await abrirMovimientos360(t, 'Pagos');
    await t.click(Selector('[id^="BtnNuevoDocumentosPago"]').filterVisible().with({ timeout: 20000 }).nth(0));
    await elegirEnLookup360(t, '#TxtDocumentosPago_Transaccion', TX_PAGO, 'dolar');
}

async function crearPagoEnDolares(t, factura) {
    await abrirNuevoPago(t);
    await elegirEnLookup360(t, '#TxtDocumentosPago_Tercero', TERCERO, TERCERO);
    await elegirEnLookup360(t, '#TxtDocumentosPago_Moneda', MONEDA);
    await t.click(Selector('#BtnGrabarDocumentosPago_btn, #BtnGrabarDocumentosPago').filterVisible().nth(0)).wait(4000);
    const numero = await numeroPago.value;
    await t
        .expect(numero).ok('El recibo no quedó con número de documento')
        .expect(Selector('#gridCartera tr.dx-data-row').with({ timeout: 15000 }).exists).ok('No cargó la cartera del tercero')
        .typeText('#gridCartera .dx-datagrid-search-panel .dx-texteditor-input', String(factura.numero), { replace: true })
        .wait(2500);
    const fila = Selector('#gridCartera tr.dx-data-row').find('td').withExactText(String(factura.numero)).parent('tr.dx-data-row').nth(0);
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No se encontró la factura ${factura.numero} en la cartera`)
        .click(fila.find('[aria-label="Descargar Documento"]'))
        .wait(2000);
    for (const [campo, valor] of [
        ['#txtDocPago_Banco_FormaPago_cursor_1', '01'],
        ['#txtDocPago_Banco_Banco_cursor_1', '01'],
        ['#txtdocumento_DocRef_pago_DocRef_cursor_1', factura.numero],
        ['#txtDocPago_Banco_Naturaleza_cursor_1', '1'],
        ['#txtdocumento_banco_pago_Valor_cursor_1', factura.total]
    ]) {
        await t.typeText(campo, String(valor), { replace: true }).pressKey('enter').wait(800);
    }
    await t.pressKey('enter').wait(3000);
    const diferencia = await parseValorNumerico('#TxtDocumentosPago_Diferencia .dx-texteditor-input');
    await t
        .expect(diferencia).eql(0, `La diferencia del pago debe ser 0 (quedó en ${diferencia})`)
        .click(Selector('#BtnGrabarDocumentosPago_btn, #BtnGrabarDocumentosPago').filterVisible().nth(0))
        .wait(3000);
    await cerrarPestana360(t);
    return numero;
}

async function eliminarPago(t, numero) {
    await abrirNuevoPago(t);
    await t
        .typeText(numeroPago, String(numero), { replace: true })
        .pressKey('enter')
        .wait(3000);
    if (await numeroPago.value === String(numero)) {
        await t
            .click(Selector('#BtnAnularDocumentosPago_btn, #BtnAnularDocumentosPago').filterVisible().nth(0))
            .click(confirmar.with({ timeout: 10000 }))
            .wait(3000);
    }
    await cerrarPestana360(t);
}

fixture `INC096 Cambio moneda pago Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC096 Cambio moneda pago', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    const trm = await leerTrm(t);
    let factura = null;
    let pago = null;
    let filas = [];
    try {
        factura = await crearFacturaEnDolares(t);
        pago = await crearPagoEnDolares(t, factura);
        await abrirMovimientos360(t, 'Pagos');
        await t.wait(3000);
        const buscador = Selector('.dx-datagrid-search-panel .dx-texteditor-input').filterVisible();
        if (await buscador.exists) {
            await t.typeText(buscador.nth(0), String(pago), { replace: true }).wait(2500);
        }
        filas = await filasListaPagos(String(pago));
        await cerrarPestana360(t);
    } finally {
        if (pago) {
            await eliminarPago(t, pago);
        }
        if (factura) {
            await nuevoDocumento360(t, TX_DOC[0], TX_DOC[1]);
            await eliminarDocumentoSiExiste360(t, TX_DOC[0], TX_DOC[1], factura.numero);
        }
    }
    const esperado = Math.trunc(factura.total * trm);
    await t.expect(filas.length).gt(0, `El recibo ${pago} no aparece en la lista de pagos`);
    await t.expect(filas[0].map(parseTextoNumerico).includes(esperado))
        .ok(`La lista de pagos no muestra el valor convertido ${esperado} (= ${factura.total} x TRM ${trm}); fila: ${filas[0].join(' | ')}`);
    await cerrarSesion360(t);
});
