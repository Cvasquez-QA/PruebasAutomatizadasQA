import { Selector } from 'testcafe';
import { testCRMConfig } from '../../ParametrosPruebas/TestErpCRM8902.js'; 


fixture `Prueba INC057 CRM testerp`
    .page (testCRMConfig.pagina)

test('Prueba INC057 Fecha contrato CRM testerp', async t => {
    await t
  //Se ingresa al aplicativo
        .wait(1500)
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testCRMConfig.empresa)    
        .wait(1000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testCRMConfig.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testCRMConfig.clave)
        .wait(1000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        //
        .wait(4000)
        .click(Selector('a').withText('Gestión'))
        .click(Selector('span').withText('CASOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#CasosConsulta_FiltroCaso .dx-texteditor-input')
        .typeText('#CasosConsulta_FiltroCaso .dx-texteditor-input', '801523')
        .click(Selector('#CasosConsulta_BtnFiltrar div').withText('Consultar'))
        .wait(1500)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]'))
        .wait(1500)
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#Casos_frmGestion a').withText('Archivos'))
        //.click('#Casos_Tabs_Archivos_link')
        .click('#gridEventos_Archivos .dx-icon.dx-icon-edit-button-addrow')
        .wait(1500)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('.dx-texteditor-input'), 'descTxt')
        .pressKey('enter')
        .pressKey('enter')
        .click(Selector('.dx-dropdowneditor-icon').nth(21))
        .click(Selector('.dx-list-item').withText('Casos'))
        .click(Selector('.dx-dropdowneditor-icon').nth(22))
        .click(Selector('.dx-list-item').withText('Internos'))
        .wait(1500)
        //.click(Selector('#file_uploader span').withText('Seleccionar archivo'))
        .setFilesToUpload('#file_uploader .dx-fileuploader-input', ['ArchivosDePrueba\\Texto.txt'])
        .click(Selector('span').withText('Guardar').nth(1))
        .wait(1500)
        .expect(Selector('td').withText('descTxt').visible).ok('No se guardó el registro')
        .click('#gridEventos_Archivos .dx-icon.dx-icon-edit-button-addrow')
        .wait(1500)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('.dx-texteditor-input'), 'descImg')
        .pressKey('enter')
        .pressKey('enter')
        .click(Selector('.dx-dropdowneditor-icon').nth(21))
        .click(Selector('.dx-list-item').withText('Casos'))
        .click(Selector('.dx-dropdowneditor-icon').nth(22))
        .click(Selector('.dx-list-item').withText('Internos'))
        .wait(1500)
        //.click(Selector('#file_uploader span').withText('Seleccionar archivo'))
        .setFilesToUpload('#file_uploader .dx-fileuploader-input', ['ArchivosDePrueba\\\\Imagen.png'])
        .click(Selector('span').withText('Guardar').nth(1))
        .expect(Selector('div').withText('Registro guardado').nth(2).visible).ok('No salió el mensaje de confirmación')
        .expect(Selector('td').withText('descImg').visible).ok('No se guardó el registro')
        .click(Selector('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon'))
        .pressKey('enter')
        .wait(1500)
        .click(Selector('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon'))
        .pressKey('enter')
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
***************
****************
******************
********************
********************
************
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
***************
****************
******************
********************
********************
************
*/
