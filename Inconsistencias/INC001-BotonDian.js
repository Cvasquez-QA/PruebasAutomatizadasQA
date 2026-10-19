import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC01-BotonDian', async t => {
   await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
         await abrirMovimiento(t, 'Punto de Venta');
    await t
        //
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .wait(1500)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), testPosConfig.caja.split(' - ')[0])
        .wait(1500)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(testPosConfig.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), '0101')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'hgi')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S').nth(8))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        //Se captura el consecutivo del documento
        const documento = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');
        const numero = await documento.value;
        await t 
         //Se crean lineas productos
        .wait(4000)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .pressKey('enter')   
        .pressKey('enter')
        .wait(4000)
        //Se ingresa el registro del pago del documento pero no se completa
        .click(Selector('#PuntoDeVenta_BtnPago span').withText('Pago'))
        .typeText('#txtPuntoDeVentaPagoPos_Detalle_Valor_cursor_1', '200000')
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_ModalPagoDocumento_BtnCancelar span').withText('Cancelar'))
          //Validación Botón DIAN HABILITADO
        // Acceder al atributo aria-disabled
        var button = Selector('#PuntoDeVenta_BtnDian')
        if( await button.hasAttribute('aria-disabled')){
            const ariaDisabledValue = await button.getAttribute('aria-disabled'); 
            await t.expect(ariaDisabledValue).eql('true', 'El botón DIAN está habilitado para enviarlo y esta pago correctamente');
        }
        await t 
        .wait(5000)
        /*
        //Luego se busca de nuevo para la validacion
        .click(Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input'))
        .pressKey('backspace')
        .typeText(Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input'),numero)
        .pressKey('enter')
        .wait(3000)
        */
        //Se edita el registro del pago
        .click(Selector('#PuntoDeVenta_BtnPago div').withText('Pago'))
        .click('#PuntoDeVenta_ModalPagoDocumento_gridMovimientos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .click('#txtPuntoDeVentaPagoPos_Detalle_Valor_cursor_1')
        .pressKey('backspace')
        .click('#txtPuntoDeVentaPagoPos_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_ModalPagoDocumento_BtnCancelar span').withText('Cancelar'))
        //Debió de haber aparecido el mensaje de documento con pago incompleto
        .click(Selector('button').withText('Aceptar').nth(1))
         //Validación Botón DIAN deshabilitado
        // Acceder al atributo aria-disabled
        button = Selector('#PuntoDeVenta_BtnDian')
        if( await button.hasAttribute('aria-disabled')){
            const ariaDisabledValue = await button.getAttribute('aria-disabled'); 
            await t.expect(ariaDisabledValue).eql('true', 'El botón DIAN está habilitado para ser enviado a la DIAN sabiendo que se encuentra incompleto');
        }
        await t 
        .wait(3000)
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(1000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});



test('New Test', async t => {
    
});