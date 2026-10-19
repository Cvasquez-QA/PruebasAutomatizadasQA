import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMaestros } from '../Funciones/HelpersHgi360Legacy.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC06 - BancoFPago', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
        await abrirMaestros(t, 'Formas de pago');
    await t
        .typeText(Selector('#gridFormasPago .dx-texteditor-input').nth(1), 'efectivo')
        .wait(2000)
        .click(Selector('#gridFormasPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click(Selector('#FormasPago_Banco .dx-lookup-field'))
       
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '11')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('11 - BANCO CAJA SOCIAL').nth(8))
        .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
        .wait(2000)
        .click(Selector('#gridFormasPago .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridFormasPago .dx-texteditor-input').nth(1), 'efectivo')
        .wait(2000)
        .click(Selector('#gridFormasPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .expect(Selector('#FormasPago_Banco div').withText('BANCO CAJA SOCIAL').nth(1).exists).ok('No se almacenó el cambio de la forma de pago')
        .click(Selector('#FormasPago_Banco div').withText('BANCO CAJA SOCIAL').nth(1))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('02 - BANCOLOMBIA').nth(8))
        .click(Selector('#BtnGuardarFormaPago div').withText('Guardar'))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});
