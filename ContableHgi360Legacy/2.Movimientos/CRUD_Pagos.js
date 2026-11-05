import { Selector } from 'testcafe';
import { abrirMovimiento, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 

const TX_RECIBO_CAJA = '06 - RECIBO DE CAJA';
const TX_EGRESO = '07 - EGRESO';
const TERCERO_TEXTO = '222222222222 - FINAL CONSUMIDOR';
const CONCEPTO_PAGO = '01';
const NATURALEZA = '1';
const NATURALEZA_ALTERNA = '2';
const DETALLE_CARTERA = 'Prueba1Cartera';
const FORMA_PAGO = '1';
const BANCO = '07';
const DOC_REF = '123123123';
const VALOR_BANCO_PRUEBA = '9999999999';
const OBSERVACION_PAGO = 'MiPruebaPago1';
const OBSERVACION_PAGOS = 'MiPruebaPagoss';
const OBSERVACION_EDIT = '.0';
const OBSERVACION_ACTUALIZADA = '.Actualizado';
const FILTRO_TX_EGRESO = 'EGRESO';


async function ejecutarPruebaPagos1(t, config, ingresar) {
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

async function ejecutarPruebaPagos2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMovimiento(t, 'PAGOS');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
            .wait(2000)
            .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TX_RECIBO_CAJA);
    await t
            .click('#TxtDocumentosPago_Tercero .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TERCERO_TEXTO);
    await t
            .click(Selector('#BtnGrabarDocumentosPago div').withText('Grabar'))
    
            const documento = Selector('#TxtDocumentosPago_Documento .dx-texteditor-input')
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
            .click('#chkCartera_0 .dx-checkbox-icon')
            .click('#chkCartera_1 .dx-checkbox-icon')
            .click('#chkCartera_2 .dx-checkbox-icon')
            .click('#chkCartera_3 .dx-checkbox-icon')
            .click(Selector('#Btn_Descargar_Multiples_Documentos span').withText('Descargar'))
    //se editan los del Documento
            .click('#txtDocumento_Pago_Concepto_1 .dx-icon.dx-icon-search')
            .wait(1000)
            .click(Selector('#gridF4Conceptos td').withText(CONCEPTO_PAGO))
            .pressKey('enter')
            .click('#txtDocumento_Pago_Naturaleza_1 .dx-icon.dx-icon-search')
            .wait(2000)
            .click(Selector('#gridF4Naturalezas td').withText(NATURALEZA))
            .wait(2000)
            .pressKey('enter')
            .typeText('#txtdocumento_detalle_pago_cursor_1', DETALLE_CARTERA)
            .click('#txtdocumento_detalle_pago_Boton_1 .dx-icon.dx-icon-check')
            .wait(1000)
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_1')
            var numDocRef1 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_1')
            var precio1 = await stringValue.value
            var strPrecio1= precio1.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_2')
            var numDocRef2 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_2')
            var precio2 = await stringValue.value
            var strPrecio2= precio2.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_3')
            var numDocRef3 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_3')
            var precio3 = await stringValue.value
            var strPrecio3= precio3.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_4')
            var numDocRef4 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_4')
            var precio4 = await stringValue.value
            var strPrecio4= precio4.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_1')
            var naturaleza1 = await stringValue.value
            stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_2')
            var naturaleza2 = await stringValue.value
            stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_3')
            var naturaleza3 = await stringValue.value
            stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_4')
            var naturaleza4 = await stringValue.value
            
    //Se ingresa la info del Movimiento Bancario 
        await t
            .wait(3000)
            .click('#txtDocPago_Banco_FormaPago_1 .dx-icon.dx-icon-search')
            .click(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_1 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', DOC_REF)
              if (naturaleza1 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_1')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA_ALTERNA)
            } else if (naturaleza1 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_1')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_1')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1', VALOR_BANCO_PRUEBA)
            .click('#txtdocumento_banco_pago_Boton_1 .dx-icon.dx-icon-check')
            .wait(2000)
    
             .click('#txtDocPago_Banco_FormaPago_2 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_2 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_2', numDocRef2)
            if (naturaleza2 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_2')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_2', NATURALEZA_ALTERNA)
            } else if (naturaleza2 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_2')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_2', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_2')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_2', strPrecio2)
            .click('#txtdocumento_banco_pago_Boton_2 .dx-icon.dx-icon-check')
            .wait(2000)
    
             .click('#txtDocPago_Banco_FormaPago_3 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_3 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_3', numDocRef3)
             if (naturaleza3 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_3')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_3', NATURALEZA_ALTERNA)
            } else if (naturaleza3 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_3')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_3', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_3')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_3', strPrecio3)
            .click('#txtdocumento_banco_pago_Boton_3 .dx-icon.dx-icon-check')
            .wait(2000)
    
            .click('#txtDocPago_Banco_FormaPago_4 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_4 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_4', numDocRef4)
            if (naturaleza4 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_4')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_4', NATURALEZA_ALTERNA)
            } else if (naturaleza4 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_4')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_4', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_4')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_4', strPrecio4)
            .click('#txtdocumento_banco_pago_Boton_4 .dx-icon.dx-icon-check')
            .wait(2000)
    //
            .typeText('#TxtDocumentosPago_Observaciones .dx-texteditor-input', OBSERVACION_PAGOS)
            .click(Selector('#BtnGrabarDocumentosPago span').withText('Grabar'))
            .wait(1000)
            .click(Selector('#BtnCerrarDocumentosPago span').withText('Atras'))
            .wait(4000)
    //Se edita la info del Movimiento Bancario
            .click('#ListagridDocumentosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .wait(5000)
        await t
            .click('#txtdocumento_DocRef_pago_DocRef_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', numDocRef1)
            .click('#txtdocumento_banco_pago_Valor_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1',strPrecio1 )
            .pressKey('enter')
            .click('#txtdocumento_banco_pago_Boton_1 .dx-icon.dx-icon-check')
            .typeText('#TxtDocumentosPago_Observaciones .dx-texteditor-input', OBSERVACION_ACTUALIZADA)
            .wait(4000)
            .click(Selector('#BtnGrabarDocumentosPago span').withText('Grabar'))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaPagos3(t, config) {
    await t
            .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', '8902')    
            .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'h11')
            .typeText('#TxtUsuarioClave .dx-texteditor-input', '1')
            .click(Selector('#buttonAutenticar span').withText('Ingresar'));

        await cerrarPestana360(t);
        await abrirMovimiento(t, 'PAGOS');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#filtros_DocumentoPago_NumeroDocumento .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#filtros_DocumentoPago_NumeroDocumento .dx-texteditor-input', '17')
            .wait(2000)
            .click(Selector('#PnlConsultaDocumentosPago span').withText('Consultar'))
            .click('#ListagridDocumentosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .wait(2000)
            .click(Selector('#BtnImprimirDocumentosPago span').withText('Imprimir'))
            .wait(2000)
            .expect(Selector('#ASPxWebDocumentViewerWeb .dxrd-report-preview-content').exists).ok('no se genera el reporte')
            .wait(5000)
            .wait(2000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaPagos4(t, config) {
    //Crear el encabezado
        await ingresarAplicacion(t, config);
        await abrirMovimiento(t, 'PAGOS');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
            .wait(2000)
            .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TX_EGRESO);
    await t
            .click('#TxtDocumentosPago_Tercero .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TERCERO_TEXTO);
    await t
            .click(Selector('#BtnGrabarDocumentosPago div').withText('Grabar'))
    
            const documento = Selector('#TxtDocumentosPago_Documento .dx-texteditor-input')
            const numeroPago = await documento.value;
    //Se descarga el pago de cartera
            
        await cerrarPestana360(t);
        await abrirMovimiento(t, 'PAGOS');
        await t
            .click('#filtros_DocumentoPago_NumeroDocumento .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#filtros_DocumentoPago_NumeroDocumento .dx-texteditor-input', numeroPago)
            .click(Selector('#PnlConsultaDocumentosPago span').withText('Consultar'))
            .wait(3000)
            .typeText('#ListagridDocumentosPago .dx-texteditor-input',FILTRO_TX_EGRESO)
            .wait(2000)
            .click('#ListagridDocumentosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .click('#chkCartera_0 .dx-checkbox-icon')
            .click('#chkCartera_1 .dx-checkbox-icon')
            .click('#chkCartera_2 .dx-checkbox-icon')
            .click('#chkCartera_3 .dx-checkbox-icon')
            .click(Selector('#Btn_Descargar_Multiples_Documentos span').withText('Descargar'))
    //se editan los del Documento
            .click('#txtDocumento_Pago_Concepto_1 .dx-icon.dx-icon-search')
            .wait(1000)
            .click(Selector('#gridF4Conceptos td').withText(CONCEPTO_PAGO))
            .pressKey('enter')
            .click('#txtDocumento_Pago_Naturaleza_1 .dx-icon.dx-icon-search')
            .click(Selector('#gridF4Naturalezas td').withText(NATURALEZA))
            .pressKey('enter')
            .typeText('#txtdocumento_detalle_pago_cursor_1', DETALLE_CARTERA)
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            .wait(1000)
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_1')
            var numDocRef1 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_1')
            var precio1 = await stringValue.value
            var strPrecio1= precio1.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_2')
            var numDocRef2 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_2')
            var precio2 = await stringValue.value
            var strPrecio2= precio2.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_3')
            var numDocRef3 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_3')
            var precio3 = await stringValue.value
            var strPrecio3= precio3.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtdocumento_documento_pago_cursor_4')
            var numDocRef4 = await stringValue.value
            var stringValue = Selector('#txtdocumento_detalle_pago_Valor_cursor_4')
            var precio4 = await stringValue.value
            var strPrecio4= precio4.replace(/\./g, '').replace(',', '.');
    
            var stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_1')
            var naturaleza1 = await stringValue.value
            stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_2')
            var naturaleza2 = await stringValue.value
            stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_3')
            var naturaleza3 = await stringValue.value
            stringValue = Selector('#txtDocumento_Pago_Naturaleza_cursor_4')
            var naturaleza4 = await stringValue.value
            
    //Se ingresa la info del Movimiento Bancario 
        await t
            .wait(3000)
            .click('#txtDocPago_Banco_FormaPago_1 .dx-icon.dx-icon-search')
            .click(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_1 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', DOC_REF)
              if (naturaleza1 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_1')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA_ALTERNA)
            } else if (naturaleza1 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_1')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_1')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1', VALOR_BANCO_PRUEBA)
            .click('#txtdocumento_banco_pago_Boton_1 .dx-icon.dx-icon-check')
            .wait(2000)
    
             .click('#txtDocPago_Banco_FormaPago_2 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_2 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_2', numDocRef2)
            if (naturaleza2 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_2')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_2', NATURALEZA_ALTERNA)
            } else if (naturaleza2 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_2')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_2', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_2')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_2', strPrecio2)
            .click('#txtdocumento_banco_pago_Boton_2 .dx-icon.dx-icon-check')
            .wait(2000)
    
             .click('#txtDocPago_Banco_FormaPago_3 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_3 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_3', numDocRef3)
             if (naturaleza3 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_3')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_3', NATURALEZA_ALTERNA)
            } else if (naturaleza3 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_3')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_3', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_3')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_3', strPrecio3)
            .click('#txtdocumento_banco_pago_Boton_3 .dx-icon.dx-icon-check')
            .wait(2000)
    
            .click('#txtDocPago_Banco_FormaPago_4 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4FormaPagos td').withText(FORMA_PAGO))
            .pressKey('enter')
            .click('#txtDocPago_Banco_Banco_4 .dx-icon.dx-icon-search')
            .doubleClick(Selector('#gridF4Bancos td').withText(BANCO))
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_4', numDocRef4)
            if (naturaleza4 === NATURALEZA) {
                    await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_4')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_4', NATURALEZA_ALTERNA)
            } else if (naturaleza4 === NATURALEZA_ALTERNA) {
            await t
            .doubleClick('#txtDocPago_Banco_Naturaleza_cursor_4')
                    .pressKey('ctrl+a')
                    .pressKey('backspace')        
                    .typeText('#txtDocPago_Banco_Naturaleza_cursor_4', NATURALEZA)
            } 
            await t
            .doubleClick('#txtdocumento_banco_pago_Valor_cursor_4')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_4', strPrecio4)
            .click('#txtdocumento_banco_pago_Boton_4 .dx-icon.dx-icon-check')
            .wait(2000)
    //
            .typeText('#TxtDocumentosPago_Observaciones .dx-texteditor-input', OBSERVACION_PAGOS)
            .click(Selector('#BtnGrabarDocumentosPago span').withText('Grabar'))
            .wait(1000)
            .click(Selector('#BtnCerrarDocumentosPago span').withText('Atras'))
            .wait(4000)
    //Se edita la info del Movimiento Bancario
            .click('#ListagridDocumentosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .wait(5000)
        await t
            .click('#txtdocumento_DocRef_pago_DocRef_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', numDocRef1)
            .click('#txtdocumento_banco_pago_Valor_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1',strPrecio1 )
            .pressKey('enter')
            .click('#txtdocumento_banco_pago_Boton_1 .dx-icon.dx-icon-check')
            .typeText('#TxtDocumentosPago_Observaciones .dx-texteditor-input', OBSERVACION_ACTUALIZADA)
            .wait(4000)
            .click(Selector('#BtnGrabarDocumentosPago span').withText('Grabar'))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Pagos - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja - Mi ERP', async t => {
    await ejecutarPruebaPagos1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba CRUD Pago - Recibo de Caja con varios Pagos - Mi ERP', async t => {
    await ejecutarPruebaPagos2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba impresion - Mi ERP', async t => {
    await ejecutarPruebaPagos3(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('CRUD Pago - Egresos con varios pagos - Mi ERP', async t => {
    await ejecutarPruebaPagos4(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_Pagos - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja - Test Contable', async t => {
    await ejecutarPruebaPagos1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba CRUD Pago - Recibo de Caja con varios Pagos - Test Contable', async t => {
    await ejecutarPruebaPagos2(t, testContableConfig, ingresarAplicacion);
});

test('Prueba impresion - Test Contable', async t => {
    await ejecutarPruebaPagos3(t, testContableConfig, ingresarAplicacion);
});

test('CRUD Pago - Egresos con varios pagos - Test Contable', async t => {
    await ejecutarPruebaPagos4(t, testContableConfig, ingresarAplicacion);
});
