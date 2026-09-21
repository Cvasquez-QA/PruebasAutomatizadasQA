import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)

test('INC11-ControlCorreoFE', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    await t 
    .click(Selector('a').withText('Herramientas'))    
        .click(Selector('span').withText('PARÁMETROS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#tabs_parametros_Defecto')
        .click(Selector('#BtnEditar div').withText('Editar'))
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', 'pruebacorreo')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .expect(Selector('#summary_ParametrosGenerales div').withText('El Email de Factura Electrónica no tiene el format').nth(1).exists).ok('No se tiene el control para el correo de factura electronica')
        .click('#cerrrarModal')
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', '@')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .expect(Selector('#summary_ParametrosGenerales div').withText('El Email de Factura Electrónica no tiene el format').nth(1).exists).ok('No se tiene el control para el correo de factura electronica')
        .click('#cerrrarModal')
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', 'dominio')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .expect(Selector('#summary_ParametrosGenerales div').withText('El Email de Factura Electrónica no tiene el format').nth(1).exists).ok('No se tiene el control para el correo de factura electronica')
        .click('#cerrrarModal')
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', '.com')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .switchToMainWindow()
        .click(Selector('.dx-icon.dx-icon-close'))
        .wait(2000)
        .click(Selector('a').withText('Movimiento'))
        .wait(2000)
        .click(Selector('a').withText('PUNTO DE VENTA'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        //
         .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(testPosConfig.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_Tercero div').withText('General General').nth(1))
        .click('.dx-icon.dx-icon-plus')
        //Se crea el nuevo tercero
        .typeText('#PuntoDeVenta_CrearTercero_Identificacion .dx-texteditor-input', '10101010')
        .pressKey('enter')
        .typeText('#PuntoDeVenta_CrearTercero_PrimerApellido .dx-texteditor-input', 'Vasquez')
        .click('#PuntoDeVenta_CrearTercero_SegundoApellido .dx-texteditor-input')
        .typeText('#PuntoDeVenta_CrearTercero_SegundoApellido .dx-texteditor-input', 'Suarez')
        .click('#PuntoDeVenta_CrearTercero_PrimerNombre .dx-texteditor-input')
        .typeText('#PuntoDeVenta_CrearTercero_PrimerNombre .dx-texteditor-input', 'CAMILO')
        .typeText('#PuntoDeVenta_CrearTercero_SegundoNombre .dx-texteditor-input', 'PRUEBA')

        .click('#PuntoDeVenta_CrearTercero_EmailFE .dx-texteditor-input')




        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', 'pruebacorreo')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .expect(Selector('#summary_ParametrosGenerales div').withText('El Email de Factura Electrónica no tiene el format').nth(1).exists).ok('No se tiene el control para el correo de factura electronica')
        .click('#cerrrarModal')
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', '@')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .expect(Selector('#summary_ParametrosGenerales div').withText('El Email de Factura Electrónica no tiene el format').nth(1).exists).ok('No se tiene el control para el correo de factura electronica')
        .click('#cerrrarModal')
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', 'dominio')
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .expect(Selector('#summary_ParametrosGenerales div').withText('El Email de Factura Electrónica no tiene el format').nth(1).exists).ok('No se tiene el control para el correo de factura electronica')
        .click('#cerrrarModal')
        .click('#txtPG_EmailFE .dx-texteditor-input')
        .typeText('#txtPG_EmailFE .dx-texteditor-input', '.com')

          .click('#PuntoDeVenta_CrearTercero_EmailFE .dx-texteditor-input')
        .expect(Selector('#PuntoDeVenta_CrearTercero_EmailFE div').withText('El Email de Factura Electrónica no tiene el format').nth(2))

  


        //Se debe seleccionar persona natural ya que se seleccionó CC
        .click(Selector('#PuntoDeVenta_CrearTercero_DatosExtras div').withText('Datos opcionales').nth(3))
        .click(Selector('#PuntoDeVenta_CrearTercero_TipoPersona div').withText('Jurídica').nth(1))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('1 - Natural').nth(8))
        .click(Selector('#PuntoDeVenta_ModalCrearTerceros_BtnAceptar span').withText('Guardar'))
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .wait(3000)




        






        .switchToMainWindow()
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('span').withText('PUNTO DE VENTA'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('03 - Caja 03').nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
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
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', 'pp01')
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
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('85 - NOTA CREDITO PUNTO DE VENTA').nth(5))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
        .wait(2000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'hgi')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click('#PuntoDeVenta_NotasDIAN .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('div').withText('6 - Otros').nth(8))   
        .typeText('#PuntoDeVenta_documento_ref .dx-texteditor-input', numerodoc)
        .click('#PuntoDeVenta_documento_ref .dx-icon.dx-icon-arrowdown')
        .wait(5000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});