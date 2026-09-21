import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)

test('INC05-GuardarTemporal', async t => {
   await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    await t 
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
        /*
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .click(Selector('button').withText('Aceptar').nth(1))
        */
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
         //Se crean lineas productos
        //1er producto
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .wait(3000)
        .expect(Selector('#txtPuntoDeVenta_Detalle_Producto_cursor_1').value).eql('010203','No se permitió guardar el documento')
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-button-content')
        .wait(3000)
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(1000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});