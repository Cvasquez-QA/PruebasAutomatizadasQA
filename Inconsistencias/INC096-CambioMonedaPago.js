import { Selector } from 'testcafe';
import {
    abrirMaestros360 as abrirMaestros,
    abrirMovimientos360 as abrirMovimiento,
    cerrarPestana360 as cerrarPestana,
    cerrarSesion360 as cerrarSesion,
    abrirTransaccion,
    filtrarPor,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';

const ingresarModulo = async (t, config = testAdminConfig) => {
    await ingresarAplicacion(t, config);
};

const mapMaestro360 = {
    MONEDAS: 'Monedas',
    'CONCEPTOS PAGO': 'Conceptos pago',
};

const mapMovimiento360 = {
    DOCUMENTOS: 'Documentos',
    PAGOS: 'Pagos',
};
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
const MONEDA_FILTRO = 'dolar';
const MONEDA = 'DOLAR';
const TRM = 5000;
const CONCEPTO_PAGO = '0101';
const TX_DOCUMENTO = '01fe';
const TERCERO = '1000099598';
const TERCERO_TEXTO = '1000099598 - Vasquez Suarez Camilo';
const PRODUCTO = '010203';
const TX_PAGO_DOLAR = 'Recibo caja dolar';
const TX_PAGO_DOLAR_TEXTO = 'Recibo caja dolar';
const TX_RECIBO_CAJA = 'RECIBO DE CAJA';

// Formato app: 1.000,0000 -> 1000 (ignora decimales y separador de miles)
const castearValorEntero = valor => {
    const parteEntera = String(valor ?? '').split(',')[0].replace(/\./g, '').trim();

    return parseInt(parteEntera, 10) || 0;
};

const parseValorNumerico = async selector => {
    const valor = await Selector(selector).value;

    return castearValorEntero(valor);
};

const parseTextoNumerico = texto => castearValorEntero(texto);

const abrirMaestro = async (t, nombreMaestro) => {
    await abrirMaestros(t, mapMaestro360[nombreMaestro] || nombreMaestro);
};

const abrirMovimientoModulo = async (t, nombreMovimiento) => {
    await abrirMovimiento(t, mapMovimiento360[nombreMovimiento] || nombreMovimiento);
};

const configurarTrmMoneda = async t => {
    await abrirMaestro(t, 'Monedas');

    await t
        .typeText(Selector('#gridMonedas .dx-texteditor-input').nth(1), MONEDA_FILTRO)
        .wait(2000)
        .click(Selector('#gridMonedas [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#gridMonedaCambio .dx-icon.dx-icon-edit-button-addrow')
        .pressKey('enter')
        .pressKey('5+0+0+0')
        .pressKey('enter')
        .click(Selector('#BtnGuardarMoneda span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana(t);
};

const validarConceptoPago = async t => {
    await abrirMaestro(t, 'Conceptos pago');

    await t
        .typeText('#gridConceptosPago .dx-texteditor-input', CONCEPTO_PAGO)
        .wait(2000)
        .expect(Selector('#gridConceptosPago td').withText(CONCEPTO_PAGO).exists).ok(
            `No se encontró el concepto de pago ${CONCEPTO_PAGO}`
        )
        .click(Selector('#gridConceptosPago [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .expect(Selector('#txtConceptoPago_Tipo div').withText('Pago').exists).ok(
            'El concepto de pago no es de tipo Pago'
        );

    const valorConcepto = await parseValorNumerico('#txtConceptoPago_Valor .dx-texteditor-input');
    const operacionMarcada = await Selector('#txtConceptoPago_Operacion .dx-radiobutton')
        .nth(2)
        .getAttribute('aria-checked');

    await t
        .expect(valorConcepto).eql(0, 'El valor del concepto de pago debe ser 0')
        .expect(operacionMarcada).eql('true', 'La operación del concepto de pago no está marcada')
        .click(Selector('#BtnActualizarConceptosPago span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana(t);
};

const crearDocumentoEnDolares = async t => {
    await abrirMovimientoModulo(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, TX_DOCUMENTO);
    await t
        .click('#Documento_Tercero .dx-lookup-field')
;
        
        await filtrarPor(t, TERCERO);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TERCERO_TEXTO))
        .click('#tabs_documento_Ubicacion')
        .click('#Documento_Moneda .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(MONEDA))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000);

    const valorDocumento = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');

    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(7000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;

    await cerrarPestana(t);

    return { valorDocumento, numeroDocumento };
};

const crearPagoEnDolares = async (t, numeroDocumento, valorDocumento) => {
    await abrirMovimientoModulo(t, 'Pagos');

    await t
        .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
        .wait(2000)
        .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(TX_PAGO_DOLAR))
        .click('#TxtDocumentosPago_Tercero .dx-lookup-field')
;
        
        await filtrarPor(t, TERCERO);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item').withText(TERCERO_TEXTO))
        .click('#TxtDocumentosPago_Moneda .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(MONEDA))
        .click('#BtnGrabarDocumentosPago .dx-icon.dx-icon-save')
        .wait(3000)
        .click(Selector('#gridCartera [role="columnheader"]').withText('Fecha'))
        .click(Selector('#gridCartera [role="columnheader"]').withText('Fecha'));

    const filaDocumento = Selector('#gridCartera tr').withText(numeroDocumento);

    await t
        .expect(filaDocumento.exists).ok(`No se encontró el documento ${numeroDocumento}`)
        .click(filaDocumento.find('[class^="dx-button-mode-contained dx-link dx-link-download"], a, i, button').nth(0))
        .wait(2000)
        .expect(Selector('#txtdocumento_documento_pago_cursor_1').value).eql(numeroDocumento)
        .typeText('#txtDocPago_Banco_FormaPago_cursor_1', '01')
        .pressKey('enter')
        .typeText('#txtDocPago_Banco_Banco_cursor_1', '01')
        .pressKey('enter')
        .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', numeroDocumento)
        .pressKey('enter')
        .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', '1')
        .pressKey('enter')
        .typeText('#txtdocumento_banco_pago_Valor_cursor_1', String(valorDocumento))
        .pressKey('enter')
        .pressKey('enter')
        .wait(2000);

    const diferencia = await parseValorNumerico('#TxtDocumentosPago_Diferencia .dx-texteditor-input');

    await t.expect(diferencia).eql(0, 'La diferencia del pago debe ser 0');

    const numeroPago = await Selector('#TxtDocumentosPago_Documento_Cursor').value;

    await t
        .click(Selector('#BtnGrabarDocumentosPago div').withText('Guardar'))
        .wait(2000)
        .click(Selector('#BtnCerrarDocumentosPago span').withText('Atras'))
        .wait(2000);

    return numeroPago;
};

const validarPagoConvertido = async (t, numeroPago, valorDocumento) => {
    const valorEsperado = valorDocumento * TRM;
    const filtros = Selector('#ListagridDocumentosPago .dx-texteditor-input');

    await t
        .typeText(filtros.nth(0), TX_RECIBO_CAJA)
        .typeText(filtros.nth(1), numeroPago)
        .typeText(filtros.nth(3), TERCERO)
        .wait(3000);

    const filaPago = Selector('#ListagridDocumentosPago tr').withText(numeroPago);
    const valorColumna6 = parseTextoNumerico(await filaPago.find('td').nth(6).innerText);
    const valorColumna7 = parseTextoNumerico(await filaPago.find('td').nth(7).innerText);

    await t
        .expect(valorColumna6).eql(valorEsperado, 'El valor convertido en la grilla no coincide')
        .expect(valorColumna7).eql(valorEsperado, 'El valor convertido en la grilla no coincide');
};

const eliminarPago = async (t, textoTransaccion, numeroPago) => {
    await t
        
        .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(textoTransaccion))
        .wait(2000)
        .click('#TxtDocumentosPago_Documento_Cursor')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtDocumentosPago_Documento_Cursor', numeroPago)
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#BtnAnularDocumentosPago').find('div, span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
};

const eliminarDocumento = async (t, numeroDocumento) => {
    await abrirMovimientoModulo(t, 'Documentos');

    await t.click(Selector('#ListagridDocumentos .dx-button-content').nth(1));
    await abrirTransaccion(t, TX_DOCUMENTO);
    await t
        .click('#txtDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento .dx-texteditor-input', numeroDocumento)
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
};

fixture `INC096 Cambio moneda pago Admin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC096 Cambio moneda pago', async t => {
    await ingresarModulo(t, testAdminConfig);
    await configurarTrmMoneda(t);
    await validarConceptoPago(t);

    const { valorDocumento, numeroDocumento } = await crearDocumentoEnDolares(t);
    const numeroPago = await crearPagoEnDolares(t, numeroDocumento, valorDocumento);
    await t.click(Selector('#BtnDocumentosPagoConsultar div').withText('Consultar'));
    await t.wait(2000)
    await validarPagoConvertido(t, numeroPago, valorDocumento);
    await t.click(Selector('#ListagridDocumentosPago .dx-button-content').nth(1))
    await eliminarPago(t, TX_RECIBO_CAJA, numeroPago);
    await eliminarPago(t, TX_PAGO_DOLAR_TEXTO, numeroPago);
    await cerrarPestana(t);
    await eliminarDocumento(t, numeroDocumento);

    await t
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});
