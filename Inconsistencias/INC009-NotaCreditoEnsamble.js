import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC09-NotaCreditoEnsamble', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
    /*
        .click(Selector('a').withText('Herramientas'))
        .click(Selector('a').withText('Parámetros'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#tabs_parametros_Pos')
        .click(Selector('#BtnEditar span').withText('Editar'))
        var parametroTemporales = await Selector('#TxtParametrosGenerales_Pos_IntTempxUsuario .dx-checkbox-icon').getAttribute('aria-checked')
        if(parametroTemporales == 'true'){
            await t
            .click(Selector('#TxtParametrosGenerales_Pos_IntTempxUsuario .dx-checkbox-icon'))
        }
        await t
        .click(Selector('#BtnGuardar div').withText('Guardar'))
        .wait(2000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close')
        //Se procede a crear el documento
        */
        await abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(testPosConfig.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
        .wait(2000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'hgi')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', 'pp01')
        .pressKey('enter')
        .pressKey('enter')//producto gratis
        .pressKey('enter')//Cantidad
        .pressKey('enter')//Guardar detalle
        //Se captura el consecutivo del documento
        const documento = Selector('#lblPuntoDeVenta_UltimoDocumento');
        const numerodoc = await documento.innerText;
        await t 
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnPago div').withText('Pago'))    
        var stringValue = Selector('#PuntoDeVenta_ModalPagoDocumento_PagoTotal .dx-texteditor-input');
        var precio = await stringValue.value
        var strPrecio= precio.replace(/\./g, '');
        await t 
        .wait(4000)
        .typeText((Selector('#PuntoDeVenta_ModalPagoDocumento_gridMovimientos .dx-texteditor-input').nth(5)),strPrecio)
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_ModalPagoDocumento_BtnAceptar span').withText('Finalizar'))
        .wait(8000)
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla span').withText('Salir de pantalla completa'))

        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .click(Selector('#PuntoDeVenta_Transaccion div').withText('PRUEBA FACTURA PUNTO DE VENTA').nth(1))
        .wait(2000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'NOTA')
        .wait(3000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('85 - NOTA CREDITO PUNTO DE VENTA').nth(5))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
        .wait(3000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'hgi')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click('#PuntoDeVenta_NotasDIAN .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('div').withText('6 - Otros').nth(8))
        //Se guarda
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        //
        .wait(8000)   
        .click(Selector('#PuntoDeVenta_transaccion_ref .dx-lookup-field'))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '0101')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .typeText('#PuntoDeVenta_documento_ref .dx-texteditor-input', numerodoc)
        .wait(2000)
        .pressKey('up')
        .click('#PuntoDeVenta_documento_ref .dx-icon.dx-icon-arrowdown')
        .wait(2000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(9000)
        .click(Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input'))
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(1000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});


























test('INC09.2-NotaCreditoEnsamble', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
    /*
        .click(Selector('a').withText('Herramientas'))
        .click(Selector('a').withText('Parámetros'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#tabs_parametros_Pos')
        .click(Selector('#BtnEditar span').withText('Editar'))
        var parametroTemporales = await Selector('#TxtParametrosGenerales_Pos_IntTempxUsuario .dx-checkbox-icon').getAttribute('aria-checked')
        if(parametroTemporales == 'true'){
            await t
            .click(Selector('#TxtParametrosGenerales_Pos_IntTempxUsuario .dx-checkbox-icon'))
        }
        await t
        .click(Selector('#BtnGuardar div').withText('Guardar'))
        .wait(2000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close')
        //Se procede a crear el documento
        */
        await abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(testPosConfig.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
        .wait(2000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'hgi')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', 'pp01')
        .pressKey('enter')
        .pressKey('enter')//producto gratis
        .pressKey('enter')//Cantidad
        .pressKey('enter')//Guardar detalle
        


        //Se captura el consecutivo del documento
        const documento = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');
        const numerodoc = await documento.value;
        await t 
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .click(Selector('#PuntoDeVenta_Transaccion div').withText('PRUEBA FACTURA PUNTO DE VENTA').nth(1))
        .wait(2000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'NOTA')
        .wait(3000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('85 - NOTA CREDITO PUNTO DE VENTA').nth(5))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
        .wait(3000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'hgi')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click('#PuntoDeVenta_NotasDIAN .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('div').withText('6 - Otros').nth(8))
        .click(Selector('#PuntoDeVenta_transaccion_ref .dx-lookup-field'))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '0101')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .typeText('#PuntoDeVenta_documento_ref .dx-texteditor-input', numerodoc)
        .click('#PuntoDeVenta_documento_ref .dx-icon.dx-icon-arrowdown')
        .wait(2000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(9000)
        //Se guarda
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        //
        .wait(8000)   
        .click(Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input'))
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(1000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});