import { Selector } from 'testcafe';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)

test('INC02-CupoTerceroPv', async t => {
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
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), '0101')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_Tercero .dx-lookup-field'))
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
        //Se debe seleccionar persona natural ya que se seleccionó CC
        .click(Selector('#PuntoDeVenta_CrearTercero_DatosExtras div').withText('Datos opcionales').nth(3))
        .click(Selector('#PuntoDeVenta_CrearTercero_TipoPersona .dx-lookup-field'))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('1 - Natural').nth(8))
        .click(Selector('#PuntoDeVenta_ModalCrearTerceros_BtnAceptar span').withText('Guardar'))
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .wait(3000)
        //Se valida en el maestro de terceros el cupo
        .switchToMainWindow()
        .click(Selector('a').withText('Maestros'))
        .click(Selector('a').withText('TERCEROS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), '10101010')
        .wait(2000)
        .click(Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .expect(Selector('#txtTercero_Cupo .dx-texteditor-input').value).eql('0','El tercero tiene un cupo distinto de 0,00')
        .click(Selector('#BtnCancelarTercero span').withText('Cerrar'))
        .click('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-delete dx"]')
        .wait(2000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});