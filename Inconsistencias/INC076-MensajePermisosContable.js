import { Selector } from 'testcafe';

fixture `Prueba INC076 Mensaje permisos testERP Contable`
    .page ('https://test.hgi360.com')

test('Prueba INC076 Mensaje permisos testERP Contable', async t => {
     await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input','8902')  
        .wait(1000)  
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'activosfijos')
        .wait(1000)  
        .typeText('#TxtUsuarioClave .dx-texteditor-input', '123')
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    //Se ingresa al maestro de herramientas 
        .click(Selector('a').withText('Maestros'))
        .click(Selector('span').withText('ACTIVOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .expect(Selector('.swal2-content div').withText('El usuario no tiene permisos para la ejecución').visible).notOk('salió el mensaje de error de permisos')
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        .expect(Selector('.swal2-content div').withText('El usuario no tiene permisos para la ejecución').visible).notOk('salió el mensaje de error de permisos')
        //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
***************
****************
******************
********************
********************
************
*/
