import { Selector } from 'testcafe';
import { testCRMConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

fixture `Prueba Contrato miERP`
    .page (testCRMConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Renovacion Contrato CRUD ', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testCRMConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testCRMConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testCRMConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    await t 
    //Se ingresa al maestro de Contratos
        .click(Selector('a').withText('Gestión'))    
        .click(Selector('span').withText('Contratos'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#ReferenciasTercero_Tercero .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'YESICA')
        .wait(2000)
        .click(Selector('.dx-list-item').withText('333344 YESICA'))
        .wait(3000)
        .click(Selector('#gridReferenciasTercero [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]'))
        .wait(3000)

        

        const renovacion = Selector('#txtReferenciasTercero_IntRenovacion');
        const renovacionIsChecked = await renovacion.getAttribute('aria-checked');
        if(renovacionIsChecked === 'false'){
            await t 
            .click(renovacion)
            .click(Selector('#BtnGuardarReferenciasTercero div').withText('Guardar'))
            .wait(3000)
            .click(Selector('#gridReferenciasTercero [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]'))
            .wait(2000)
        }
            await t 
            .click(renovacion)
            .click(Selector('#BtnGuardarReferenciasTercero div').withText('Guardar'))
        .wait(4000)
        .expect(Selector('.swal2-content div').exists).notOk('Está saliendo un mensaje emergente')
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