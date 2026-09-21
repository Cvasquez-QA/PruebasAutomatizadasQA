import { Selector } from 'testcafe';
import { abrirTransaccion } from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js'; 
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js'; 
import { testGourmetConfig } from '../../ParametrosPruebas/TestErpGourmet8902.js'; 

fixture `Prueba campo tercero en detalle Admin testerp`
    .page (testAdminConfig.pagina)

test('Prueba campo tercero en detalle testerp Admin', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Movimiento'))    
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
    await abrirTransaccion(t, 'INC027');
    await t
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(3000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .wait(1500)
        .pressKey('enter')
        .wait(1500)
        .pressKey('enter')
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').visible).ok('No está el campo Tercero en el detallle')
        .expect(Selector('#txtDocumento_Detalle_Tercero_1 .dx-icon.dx-icon-search').visible).ok('No está el ícono de la lupa para buscar el tercero')
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').focused).ok('no está seleccionado o el foco no está en el campo del tercero')
        .click('#txtDocumento_Detalle_Tercero_1 .dx-icon.dx-icon-search')
        .wait(3000)
        .click(Selector('td').withText('1000099598'))
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').value).eql('1000099598','No se seleccionó el tercero')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(1500)
        //.click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#txtDocumento'))
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').value).eql('1000099598','No se guardó el tercero seleccionado')
        .wait(2000)
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
/*
**********   **********   **********
**********   **********   **********
***     ***  ***    ***   ***
***     ***  ***    ***   ***
**********   ***    ***   **********
**********   ***    ***   **********
***          ***    ***         ***
***          ***    ***         ***
***          **********   **********
***          **********   **********
*/
/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/
fixture `Prueba campo tercero en detalle POS testerp`
    .page (testPosConfig.pagina)

test('Prueba campo tercero en detalle testerp POS', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Movimiento'))    
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
    await abrirTransaccion(t, 'INC027');
    await t
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(3000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .wait(1500)
        .pressKey('enter')
        .wait(1500)
        .pressKey('enter')
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').visible).ok('No está el campo Tercero en el detallle')
        .expect(Selector('#txtDocumento_Detalle_Tercero_1 .dx-icon.dx-icon-search').visible).ok('No está el ícono de la lupa para buscar el tercero')
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').focused).ok('no está seleccionado o el foco no está en el campo del tercero')
        .click('#txtDocumento_Detalle_Tercero_1 .dx-icon.dx-icon-search')
        .wait(3000)
        .click(Selector('td').withText('1000099598'))
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').value).eql('1000099598','No se seleccionó el tercero')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(1500)
        //.click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#txtDocumento'))
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').value).eql('1000099598','No se guardó el tercero seleccionado')
        .wait(2000)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});
/*
 **********    **********     **       **   **********  ***     ***
************   ************   **       **   **********  ****   **** 
***            ***      ***   **       **   ***    ***  ***** *****     
***    *****   ***      ***   **       **   ***    **   *** *** ***      
***   ******   ***      ***   **       **   *********   ***  *  *** 
***      ***   ***      ***   **       **   **********  ***     ***  
***      ***   ***      ***   **       **   ***    ***  ***     ***   
************   ************   ***********   ***    ***  ***     *** 
 **********    **********     ***********   ***    ***  ***     *** 
*/
fixture `Prueba campo tercero en detalle POS Gourmet testerp`
    .page (testGourmetConfig.pagina)

test('Prueba campo tercero en detalle testerp POS Gourmet', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testGourmetConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testGourmetConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testGourmetConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Movimiento'))    
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
    await abrirTransaccion(t, 'INC027');
    await t
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(3000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .wait(1500)
        .pressKey('enter')
        .wait(1500)
        .pressKey('enter')
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').visible).ok('No está el campo Tercero en el detallle')
        .expect(Selector('#txtDocumento_Detalle_Tercero_1 .dx-icon.dx-icon-search').visible).ok('No está el ícono de la lupa para buscar el tercero')
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').focused).ok('no está seleccionado o el foco no está en el campo del tercero')
        .click('#txtDocumento_Detalle_Tercero_1 .dx-icon.dx-icon-search')
        .wait(3000)
        .click(Selector('td').withText('1000099598'))
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').value).eql('1000099598','No se seleccionó el tercero')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(1500)
        //.click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#txtDocumento'))
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('#txtDocumento_Detalle_Tercero_cursor_1').value).eql('1000099598','No se guardó el tercero seleccionado')
        .wait(2000)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});