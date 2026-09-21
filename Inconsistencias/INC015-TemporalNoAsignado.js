import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)

test('INC15-TemporalNoAsignado', async t => {
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
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('1014 - Caja Camilo').nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))

    await t
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        const consecutivo = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');
        const temporal = await consecutivo.innerText;
        await t
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        //.click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('down')
        .pressKey('down')
        .pressKey('enter')
        .expect(Selector('#swal2-content').innerText).eql('Documento temporal no esta asignado a este usuario','No se muestra el mensaje de control que ese temporal ya se encuentra asignado')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input').innerText).eql(temporal)
        .click('#PuntoDeVenta_BtnSalir .dx-icon.fas.fa-sign-out-alt')
          //Se cierra sesión
          .switchToMainWindow()
          .click(Selector('#LblUsuarioNombre'))
          .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});