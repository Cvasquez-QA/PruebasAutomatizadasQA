import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js'; 


fixture `Prueba Tiempo espera Forma Pago PV testerp`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });
test('Prueba Tiempo espera Forma Pago PV testerp', async t => {
    await t
  //Se ingresa al aplicativo
        .wait(1500)
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .wait(1000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .wait(1000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        //
        .wait(4000);
        await abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .wait(4000)
        .click(Selector('.dx-list-item').withText(testPosConfig.caja))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(2000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-list-item').withText('0101 - PRUEBA FACTURA PV'))
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .wait(1500)
        .click(Selector('#PuntoDeVenta_BtnPago span').withText('Pago'))
        .wait(1500)
        .click('#txtPuntoDeVentaPagoPos_Detalle_FPago_1 .dx-icon.dx-icon-search')
        .expect(Selector('td').withText('Transferencia').visible).ok('No se visualiza información con valor "Transferencia" en la grid')
        .click('#cerrarModal_F4FormaPagos_PV')
        .click(Selector('#PuntoDeVenta_ModalPagoDocumento_BtnCancelar span').withText('Cancelar'))
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(1500)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

