import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)

test('INC08-IndiceEncabezadoTx', async t => {
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
        /*
        .click(Selector('#PuntoDeVenta_Tercero div').withText('General General').nth(1))
        .click(Selector('#PuntoDeVenta_Tercero_RefCia div').withText('General General').nth(1))
        .click(Selector('#PuntoDeVenta_Bodega div').withText('BODEGA 01').nth(1))
        .click(Selector('#PuntoDeVenta_Fecha_Vence .dx-texteditor-input'))
        */
        .click(Selector('#PuntoDeVenta_Transaccion div').withText('PRUEBA FACTURA PUNTO DE VENTA').nth(1))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0102 - Factura de Venta No Electronica').nth(8))
        .wait(2000)
        .expect(Selector('#PuntoDeVenta_Tercero_RefCia div').withText('General General').nth(1).visible).eql(false,'No se cambian los encabezados al cambiarse de transacción')
        //.expect(Selector('#PuntoDeVenta_Fecha_Vence .dx-button-content').visible).eql(false,'No se cambian los encabezados al cambiarse de transacción')
        //.expect(Selector('#PuntoDeVenta_Fecha_Vence .dx-dropdowneditor-icon').visible).notOk('No se cambian los encabezados al cambiarse de transacción')
        //.expect(Selector('#PuntoDeVenta_Fecha_Vence .dx-texteditor-input').visible).notOk('No se cambian los encabezados al cambiarse de transacción')
        //.expect(Selector('#PuntoDeVenta_Tercero_RefCia div').withText('General General').nth(1).visible).notOk('No se cambian los encabezados al cambiarse de transacción')
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(1000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});