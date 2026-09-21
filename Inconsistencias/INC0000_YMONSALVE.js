import { Selector } from 'testcafe';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js'; 
 
fixture `INC0000 Grabacion Prueba`
    .page (testAdminConfig.pagina)
test('PP', async t => {

    
});
    

test('New Test', async t => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', '8902')    
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'ymonsalvw')
        .pressKey('backspace')
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'e')
        .pressKey('tab')
    await t
        .pressKey('capslock')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'C')
        .pressKey('capslock')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'alidad2026*')
    await t
        .click('#buttonAutenticar .dx-icon.dx-icon-arrowright')
    await t
        .click(Selector('#ErpSidebarModulos a').withText('Maestros'))
    await t
              .click(Selector('#ErpMenuCardGrid a').withText('Ver más ↓').nth(2))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Bancos'))
    await t
        .switchToIframe('#iframe_tab_1790005746267_jielzbohz')
        .click(Selector('#gridBancos div').withText('50').nth(5))
    await t
        .click('#gridBancos .dx-icon.dx-icon-add')
    await t
        .typeText('#txtBancos_Codigofoco', '28')
    await t
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', 'BancoPrY')
    await t
        .click('#txtMaestroBancos_CuentaNIIF .dx-lookup-field-wrapper')
    await t
        .click(Selector('#dx-73d540e5-3676-ee85-f094-3385d9de3741 div').withText('1325 - CUENTAS POR COBRAR A SOCIOS Y ACCIONISTAS').nth(6))
    await t
        .click('#txtMaestroBancos_EntidadFin .dx-lookup-field')
    await t
        .click(Selector('#dx-c78ab273-c281-4efc-6eda-95827ef71c87 div').withText('08 - BANCO CAJA SOCIAL').nth(6))
    await t
        .click('#txtBancos_Tipo .dx-lookup-field')
    await t
        .click(Selector('#dx-99e6228d-f2e3-d2ea-aec7-cb2166b7e783 div').withText('1 - Corriente').nth(6))
    await t
        .click('#txtMaestroBancos_Tercero .dx-lookup-field')
    await t
        .click(Selector('#dx-33662916-8223-1d1a-54c8-282c6bbef3e7 div').withText('901193980 - \"CENTRO COMERCIAL LA CENTRAL-PROPIEDA'))
    await t
        .click('#txtMaestroBancos_CuentaPCGA .dx-lookup-field')
    await t
        .click(Selector('#dx-ba2bbc55-2d08-47df-acb6-9c16d34ff7c6 div').withText('132510 - A ACCIONISTAS').nth(6))
    await t
        .click('#txtBancos_NroCuenta .dx-texteditor-input')
    await t
        .click('#txtBancos_Formato .dx-lookup-field')
    await t
        .click(Selector('#dx-5daa6435-3d31-e7d7-21e3-d6055851f49d div').withText('2 - Bogotá').nth(6))
    await t
        .typeText('#txtBancos_Consecutivo .dx-texteditor-input', '1')
    await t
        .click(Selector('#txtMaestroBancos_CuentaNIIF div').withText('CUENTAS POR COBRAR A SOCIOS Y ACCIONISTAS').nth(1))
    await t
        .click(Selector('#txtMaestroBancos_CuentaNIIF div').withText('CUENTAS POR COBRAR A SOCIOS Y ACCIONISTAS').nth(1))
        .click('#txtBancos_Consecutivo .dx-texteditor-input')
    await t
        .click('#txtBancos_Consecutivo .dx-texteditor-input')
    await t
        .click('#txtBancos_Consecutivo .dx-texteditor-input')
    await t
        .click('#txtMaestroBancos_CCosto .dx-lookup-field')
    await t
        .click(Selector('#dx-498c873b-a56b-7c9b-c15d-eda73a4b1dfc div').withText('05 - CONSTRUCCION').nth(6))
    await t
        .click(Selector('#txtMaestroBancos_EntidadFin div').withText('BANCO CAJA SOCIAL').nth(1))
    await t
        .click(Selector('#dx-c78ab273-c281-4efc-6eda-95827ef71c87 div').withText('08 - BANCO CAJA SOCIAL').nth(6))
    await t
        .click(Selector('#txtMaestroBancos_EntidadFin div').withText('BANCO CAJA SOCIAL').nth(1))
    await t
        .click(Selector('#txtMaestroBancos_EntidadFin div').withText('BANCO CAJA SOCIAL').nth(1))
    await t
        .click(Selector('#txtMaestroBancos_EntidadFin div').withText('BANCO CAJA SOCIAL').nth(1))
    await t
        .click(Selector('#frmBancos div').withText('Código').nth(1))
    await t
        .click(Selector('#txtMaestroBancos_EntidadFin div').withText('BANCO CAJA SOCIAL').nth(1))
    await t
        .click(Selector('#dx-c78ab273-c281-4efc-6eda-95827ef71c87 div').withText('42 - BANCO COLPATRIA').nth(6))
    await t
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
});