import { Selector } from 'testcafe';
import { abrirTransaccion } from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';

fixture `Prueba Modal correccion terceros testerp`
    .page (testAdminConfig.pagina)

test('Prueba Modal correccion terceros ', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    await t 
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Movimientos'))    
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .wait(2000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
    await abrirTransaccion(t, '25');
    await t
        .click('#txtDocumento')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtDocumento'),'2147483648')
        .pressKey('enter')
        .expect((Selector('div').withText('El número de documento supera el valor permitido').nth(2)).exists).ok('El mensaje es diferente o no se muestra')
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close')
    //PRUEBA EN PV
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('a').withText('PUNTO DE VENTA'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('.dx-list-item').withText(testPosConfig.caja))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        if(await Selector('.swal2-content div').withText('Desea cerrar la operación de esta caja?').exists){
            await t
            .click(Selector('button').withText('Aceptar').nth(1))
        }
        //.expect(Selector('.swal2-content div').withText('Desea cerrar la operación de esta caja?').exists).notOk('Está saliendo un mensaje emergente')
        await t
        .wait(3000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('#.dx-list.item').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA'))
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtPuntoDeVenta_DocumentoNew'),'2147483648')
        .pressKey('enter')
        .expect((Selector('div').withText('El número de documento supera el valor permitido').nth(2)).exists).ok('El mensaje es diferente o no se muestra')
        .click(Selector('#PuntoDeVenta_BtnSalir span').withText('Salir'))
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



