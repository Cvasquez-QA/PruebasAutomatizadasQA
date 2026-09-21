import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)

test('INC10-NotaCreditoDescargaMensaje', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    await t 
    /*
        .click(Selector('a').withText('Herramientas'))
        .click(Selector('a').withText('PARÁMETROS'))
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
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('span').withText('PUNTO DE VENTA'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .wait(2000)
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
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'hgi')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .pressKey('enter')//producto gratis
        .pressKey('enter')//Cantidad
        .pressKey('enter')//Guardar detalle
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
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
        .expect(Selector('.swal2-content div').withText('Desea cargar el detalle del documento').exists).ok('No se está realizando e ')
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(5000)
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});