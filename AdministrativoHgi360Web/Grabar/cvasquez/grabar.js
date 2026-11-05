import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    aceptarValidacionesSiExisten,
    confirmarProceso,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaSiExiste360,
    escribirFecha360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

fixture `INC0000 Grabacion Prueba`
    .page (`https://test.hgi360.com/`)

test('GRABACION', async t => {

});



test('New Test', async t => {
    
});





test('New Test 1', async t => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', '8902')    
        .pressKey('enter')
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'admin')
    await t
        .pressKey('capslock')
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'C')
        .pressKey('c+capslock')
        .pressKey('enter')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'alidad2026*')
        .pressKey('enter')
    await t
        .pressKey('enter')
    await t
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
    await t
        .pressKey('enter')
    await t
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
    await t
        .click(Selector('#ErpSidebarModulos a').withText('Maestros'))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Ubicaciones'))
    await t
  
        .validaSiExiste(QAUbicacion)
        .borrarRegistro
    await t
        .click('#BtnNuevoUbicacion .dx-button-content')
    await t
      
    await t
        .typeText('#txtUbicacion_Codigo .dx-texteditor-input', 'QAubicacion')
    await t
        .click('#txtUbicacion_Descripcion .dx-texteditor-input')
        .pressKey('capslock')
    await t
        
        .typeText('#txtUbicacion_Descripcion .dx-texteditor-input', 'QaDesc')
    await t
        .click('#txtUbicacion_Estado .dx-checkbox-icon')
    await t
        .click('#txtUbicacion_Estado .dx-checkbox-icon')
    await t
        .click(Selector('#BtnGuardarUbicacion_btn span').withText('Guardar'))
    await t
        .click(Selector('#dx-9c3a1470-3cca-c075-a1a9-1141fd2dba18 td').withText('QaUbicacion'))
    await t
        .click(Selector('#dx-9c3a1470-3cca-c075-a1a9-1141fd2dba18 .dx-button-content').nth(1))
    await t
        .click('#txtUbicacion_Descripcion .dx-texteditor-input')
    await t
        .pressKey('backspace')
        .pressKey('ctrl+a')
    await t
        .typeText('#txtUbicacion_Descripcion .dx-texteditor-input', 'nuevadesc')
    await t
        .click('#txtUbicacion_Estado .dx-checkbox-icon')
    await t
        .click(Selector('#BtnGuardarUbicacion_btn div').withText('Guardar'))
    await t
        .click(Selector('#dx-6cfb75d1-d21e-2c7e-2d0a-fbe2938cb05c td').withText('QaUbicacion'))
    await t
        .rightClick('#dx-6cfb75d1-d21e-2c7e-2d0a-fbe2938cb05c .dx-checkbox-icon')
    await t
        .doubleClick('#dx-39388a8e-8b16-c7b7-3d1b-1534eeb5cb1e .dx-texteditor-input', {
            caretPos: 0
        })
    await t
        .click(Selector('#dx-6cfb75d1-d21e-2c7e-2d0a-fbe2938cb05c .erp-grid-action-glyph').nth(2))
    await t
        .click(Selector('button').withText('Eliminar'))
    await t
        .cerrarSesion360
});