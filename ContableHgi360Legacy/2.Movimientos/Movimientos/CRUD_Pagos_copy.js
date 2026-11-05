import { Selector } from 'testcafe';
import { abrirMovimiento, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const TX_RECIBO_CAJA = '06 - RECIBO DE CAJA';
const TERCERO_TEXTO = '222222222222 - FINAL CONSUMIDOR';
const CONCEPTO_PAGO = '01';
const NATURALEZA = '1';
const DETALLE_CARTERA = 'Prueba1Cartera';
const FORMA_PAGO = '1';
const BANCO = '07';
const DOC_REF = '123123123';
const VALOR_BANCO_PRUEBA = '9999999999';
const OBSERVACION_PAGO = 'MiPruebaPago1';
const OBSERVACION_EDIT = '.0';


async function ejecutarPruebaPagosCopy(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMovimiento(t, 'PAGOS');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
            .wait(4000)
            .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TX_RECIBO_CAJA);
    await t
            .click('#TxtDocumentosPago_Tercero .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TERCERO_TEXTO);
    await t
            .click(Selector('#BtnGrabarDocumentosPago div').withText('Grabar'))
    
            const documento = await Selector('#TxtDocumentosPago_Documento .dx-texteditor-input')
            const numeroPago = await documento.value;
    //Se descarga el pago de cartera
            
        await cerrarPestana360(t);
        await abrirMovimiento(t, 'PAGOS');
        await t
            .click('#filtros_DocumentoPago_NumeroDocumento .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#filtros_DocumentoPago_NumeroDocumento .dx-texteditor-input', numeroPago)
            .wait(2000)
            .click(Selector('#PnlConsultaDocumentosPago span').withText('Consultar'))
            .wait(3000)
            .click('#ListagridDocumentosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .click('#gridCartera [class^="dx-button-mode-contained dx-link dx-link-download"]')
    //se editan los datos
            .click('#txtDocumento_Pago_Concepto_1 .dx-icon.dx-icon-search')
            .wait(2000)
            .click(Selector('#gridF4Conceptos td').withText(CONCEPTO_PAGO))
            .pressKey('enter')
            .click('#txtDocumento_Pago_Naturaleza_1 .dx-icon.dx-icon-search')
            .wait(2000)
            .click(Selector('#gridF4Naturalezas td').withText(NATURALEZA))
            .pressKey('enter')
            .typeText('#txtdocumento_detalle_pago_cursor_1', DETALLE_CARTERA)
            .click('#txtdocumento_detalle_pago_Boton_1 .dx-icon.dx-icon-check')
            .wait(1000)
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_1')
            var numDocRef = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_1')
            var precio = await stringValue.value
            var strPrecio= precio.replace(/\./g, '').replace(',', '.');
    //Se ingresa la info del Documentos del Pago
        await t
            .wait(3000)
            .click('#txtDocPago_Banco_FormaPago_1 .dx-icon.dx-icon-search')
            .wait(2000)
            .click(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_1 .dx-icon.dx-icon-search')
            .wait(2000)
            .click(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', DOC_REF)
            .click('#txtDocPago_Banco_Naturaleza_1 .dx-icon.dx-icon-search')
            .wait(2000)
            .doubleClick(Selector('#gridF4Naturalezas td').withText(NATURALEZA))
            .pressKey('enter')
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_1')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1', VALOR_BANCO_PRUEBA)
            .wait(6000)
            .click('#txtdocumento_banco_pago_Boton_1 .dx-icon.dx-icon-check')
            .wait(3000)
    //
            .typeText('#TxtDocumentosPago_Observaciones .dx-texteditor-input', OBSERVACION_PAGO)
            .click(Selector('#BtnGrabarDocumentosPago span').withText('Grabar'))
            .wait(2000)
            .click(Selector('#BtnCerrarDocumentosPago span').withText('Atras'))
            .wait(3000)
    //Se edita la info del Documentos del Pago
            .click('#ListagridDocumentosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .wait(5000)
        await t
            .click('#txtdocumento_DocRef_pago_DocRef_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', numDocRef)
            .click('#txtdocumento_banco_pago_Valor_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1',strPrecio )
            .pressKey('enter')
            .click('#txtdocumento_banco_pago_Boton_1 .dx-icon.dx-icon-check')
            .typeText('#TxtDocumentosPago_Observaciones .dx-texteditor-input', OBSERVACION_EDIT)
            .wait(4000)
            .click(Selector('#BtnGrabarDocumentosPago span').withText('Grabar'))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}


fixture `CRUD_Pagos_copy - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja - Mi ERP', async t => {
    await ejecutarPruebaPagosCopy(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_Pagos_copy - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja - Test Contable', async t => {
    await ejecutarPruebaPagosCopy(t, testContableConfig, ingresarAplicacion);
});
