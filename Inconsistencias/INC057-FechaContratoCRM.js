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
        .click(Selector('span').withText('CONTRATOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ReferenciasTercero_Tercero .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '1000099598')
        .wait(2000)
        .click(Selector('.dx-list-item').withText('1000099598 - Vasquez Suarez Camilo'))
        .click('#gridReferenciasTercero .dx-icon.dx-icon-add')
        .typeText('#txtReferenciasTercero_StrCodLic .dx-texteditor-input', '1010')
        .pressKey('enter')
        .typeText(Selector('#txtReferenciasTercero_IntDocumento .dx-texteditor-input'),'1010')
        .pressKey('enter')
        //Referencia
        .pressKey('space')
        .pressKey('down')
        .pressKey('enter')
        //Producto
        .pressKey('space')
        .pressKey('down')
        .pressKey('enter')
        //Vendedor
        .pressKey('space')
        .pressKey('down')
        .pressKey('enter')
        //VendedorExterno
        .pressKey('space')
        .pressKey('down')
        .pressKey('enter')
        .click('#txtReferenciasTercero_IntListaPrecio .dx-lookup-field')
        .pressKey('space')
        .pressKey('down')
        .pressKey('enter')
        .click('#txtReferenciasTercero_DatFechaI .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .pressKey('2')
        .pressKey('0')
        .pressKey('2')
        .pressKey('6')
        .pressKey('0')
        .pressKey('3')
        .pressKey('2')
        .pressKey('5')
        .click('#txtReferenciasTercero_DatFechaF .dx-texteditor-input')
        .pressKey('2')
        .pressKey('0')
        .pressKey('2')
        .pressKey('6')
        .pressKey('0')
        .pressKey('3')
        .pressKey('3')
        .pressKey('0')
        .pressKey('enter')
        .click(Selector('#BtnGuardarReferenciasTercero div').withText('Guardar'))
        .switchToMainWindow()
        const currentUrl = await t.eval(() => window.location.href);
        await t.navigateTo(currentUrl);
        await t
        .wait(5000)
        .click(Selector('a').withText('Gestión'))
        .click(Selector('span').withText('CONTRATOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#ReferenciasTercero_Tercero .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '1000099598')
        .wait(2000)
        .click(Selector('.dx-list-item').withText('1000099598 - Vasquez Suarez Camilo'))
        .typeText(Selector('.dx-texteditor-input').nth(1),'1010')
        .wait(1500)
        .expect(Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines td').withText('2026-03-25').visible).ok('Se muestra una fecha diferente')
        .expect(Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines td').withText('2026-03-30').visible).ok('Se nuestra una fecha diferente')
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-delete dx"]'))
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
