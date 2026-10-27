import { Selector } from 'testcafe';
import { testAdminConfig } from '../ParametrosPruebas/TestErpAdmin8902.js'; 

fixture `INC0000 Grabacion Prueba`
    .page (testAdminConfig.pagina)
 test('GRABACION', async t => {
});

test('New Test', async t => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', '8902')    
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'josorio')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'Calidad2026*')
    await t
        .click(Selector('#buttonAutenticar span').withText('Ingresar'))
    await t
        .click(Selector('#ErpSidebarModulos span').withText('Maestros'))
    await t
        .click(Selector('#ErpMenuCardGrid div').withText('Ver más ↓').nth(3))
    await t
        .click(Selector('#ErpMenuCardGrid a').withText('Ver más ↓').nth(3))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Bancos'))
    await t

        .click(Selector('#gridBancos .dx-button-content').nth(1))
    await t
        .typeText('#txtBancos_Codigofoco', '14')
        .pressKey('enter')
    await t
        .pressKey('capslock')
    await t
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', 'BANCO AUTO')
    await t
        .click('#txtMaestroBancos_CuentaPCGA .dx-lookup-field')
    await t
        .click(Selector('#dx-65b2e657-8b6c-d8b2-69e8-17765c67c791 div').withText('11101001 - PANAMA BANCOLOMBIA').nth(6))
    await t
        .click('#txtMaestroBancos_CuentaNIIF .dx-lookup-field')
    await t
        .typeText('#dx-dfb2d8ed-a731-4e10-9e65-40eaec5b1beb .dx-texteditor-input', '1110')
    await t
        .click(Selector('#dx-3a4ee00b-2694-97e9-b1d5-2952040844ec div').withText('11100502 - BANCO CAJA SOCIAL CTE 2694').nth(6))
    await t
        .click('#txtMaestroBancos_EntidadFin .dx-lookup-field')
    await t
        .click('#frmBancos .nav.nav-tabs')
    await t
        .click('#txtMaestroBancos_EntidadFin .dx-lookup-field')
    await t
        .click('#txtMaestroBancos_CCosto .dx-lookup-field')
    await t
        .click('#txtMaestroBancos_EntidadFin .dx-lookup-field')
    await t
        .click(Selector('#dx-2740dd78-93d1-9b6e-1945-d327988cab95 div').withText('42 - BANCO COLPATRIA').nth(6))
    await t
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
});