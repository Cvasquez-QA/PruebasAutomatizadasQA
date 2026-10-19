import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC16-TxBloqueoProductoSinKardex.js', async t => {
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
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(testPosConfig.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), '0101')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0101NoKdx - PRUEBA FACTURA PUNTO DE VENTA').nth(8))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '1014')
        .pressKey('enter')
        .expect(Selector('#txtPuntoDeVenta_Detalle_Descripcion_1').innerText).eql('Producto Sin Kardex','No es el producto seleccionado para hacer la prueba')
        .wait(2000)
        .click('#txtPuntoDeVenta_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(2000)
        .expect(Selector('#PuntoDeVenta_GridProductosConsulta td').withText('Producto Sin Kardex').exists).ok('No se ingresó el registro correctamente')
        .wait(1000)
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(1000)
        //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});