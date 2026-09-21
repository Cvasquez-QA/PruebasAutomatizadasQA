import { Selector } from 'testcafe';
import { abrirTransaccion } from '../../Funciones/HelpersHgi360.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js'; 
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js'; 

fixture `Prueba campo observacion documento Admin testerp`
    .page (testAdminConfig.pagina)

test('Prueba campo observacion documento testerp Admin', async t => {
    await t
  //Se ingresa al aplicativo
        .wait(1500)
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .wait(1000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .wait(1000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Movimiento'))    
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
    await abrirTransaccion(t, 'INC031');
    await t
        .wait(1500)
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .expect(Selector('#txtDocumento_Observaciones .dx-texteditor-input').value).eql('','SE está mostrando un valor diferente al del tercero 0-General')
        .typeText('#txtDocumento_Observaciones .dx-texteditor-input','Prueba Observacion 1')
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#txtDocumento'))
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#txtDocumento_Observaciones .dx-texteditor-input').value).eql('Prueba Observacion 1','No se actualizó el campo observación')
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000)
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
fixture `Prueba campo observacion documento Admin testhappgi`
    .page (testHappgiAdminConfig.pagina)

test('Prueba campo observacion documento testhappgi Admin', async t => {
    await t
  //Se ingresa al aplicativo
        .wait(1500)
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testHappgiAdminConfig.empresa)    
        .wait(1000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testHappgiAdminConfig.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testHappgiAdminConfig.clave)
        .wait(1000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Movimiento'))    
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
    await abrirTransaccion(t, 'INC031');
    await t
        .wait(1500)
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .expect(Selector('#txtDocumento_Observaciones .dx-texteditor-input').value).eql('','SE está mostrando un valor diferente al del tercero 0-General')
        .typeText('#txtDocumento_Observaciones .dx-texteditor-input','Prueba Observacion 1')
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#txtDocumento'))
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#txtDocumento_Observaciones .dx-texteditor-input').value).eql('Prueba Observacion 1','No se actualizó el campo observación')
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});