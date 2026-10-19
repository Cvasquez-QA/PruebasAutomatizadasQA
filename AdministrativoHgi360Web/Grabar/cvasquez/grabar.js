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
    .page (`https://mi.hgi360.com/`)

test('GRABACION', async t => {

});



test('New Test', async t => {
    
});




test('New Test 1', async t => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', '8902')    
        .pressKey('enter')
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'cvasq')
    await t
        .pressKey('backspace')
        .pressKey('backspace')
        .pressKey('backspace')
        .pressKey('backspace')
    await t
        .pressKey('backspace')
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'admin')
        .pressKey('enter')
    await t
        .pressKey('capslock')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'C')
        .pressKey('capslock')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'alidad2026*')
    await t
        .pressKey('enter')
        .pressKey('enter')
    await t
        .click(Selector('header a').withText('Administrativo'))
    await t
        .click(Selector('header span').withText('Contable').nth(1))
});



test('New Test 2', async t => {
    await t
        .click(Selector('#ErpSidebarModulos span').withText('Movimientos'))    
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Documentos'))
    await t
        .click('#BtnNuevoDocumento .dx-icon.dx-icon-add')
    await t
        .click('#Documento_Transaccion .dx-lookup-field')
    await t
        .typeText('#dx-5458c3d0-522c-4b1a-5203-b14d29509f95 .dx-texteditor-input', '01fe')
    await t
        .click(Selector('#dx-2ebceb13-2ced-1451-e5ad-6d39bdfb583e div').withText('01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA'))
    await t
        .click(Selector('#BtnGuardarDocumento_btn span').withText('Guardar'))
    await t
        .click('#Documento_Dependencia .dx-texteditor-input')
    await t
        .click('#Documento_Dependencia .dx-texteditor-input')
        .click('#Documento_Buscar_Dependencia .dx-icon.dx-icon-search')
    await t
        .click('#Documento_Buscar_Dependencia .dx-icon.dx-icon-search')
    await t
        .click(Selector('#dx-d40a7fa9-53fe-84b2-26e6-4967b9cb4cfb td').withText('0'))
    await t
        .click(Selector('#btnSeleccionarDependencias_documentos div').withText('Seleccionar'))
    await t
        .click(Selector('#TabCtab_1792074976853_zyzec4hdv button').withText('Reintentar'))
    await t
        .click('#BtnNuevoDocumento .dx-button-content')
    await t
        .click('#Documento_Transaccion .dx-lookup-field')
    await t
        .typeText('#dx-2a77acc6-5ac4-5969-642b-401a14a8f8af .dx-texteditor-input', '01fe')
    await t
        .click(Selector('#dx-3eb91164-8c85-190d-385d-b581ed15c8ad div').withText('01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA'))
    await t
        .typeText('#Documento_Dependencia .dx-texteditor-input', '0')
    await t
        .click(Selector('#BtnGuardarDocumento_btn div').withText('Guardar'))
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
    await 
    await t
        .click('#txtDocumento_Detalle_Cantidad_cursor_1', {
            caretPos: 0
        })
        .pressKey('ctrl+a')
    await t
        .pressKey('backspace')
    await t
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1', {
            caretPos: 1
        })
    await t
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1', {
            caretPos: 0
        })
    await t
        .pressKey('backspace')
        .pressKey('ctrl+a')
    await t
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '100', {
            caretPos: 1
        })
    await t
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save')
        .wait(1000)
   
    var totalDoc = parseInt('#txtDocumento_Total .dx-texteditor-input').value

        .expect((totalDoc)>=100).ok
    await t
        .click('#dx-d5eb838c-19db-fe60-6349-5c8c58348e21 .erp-grid-action-glyph')
    await t
      .click('#txtDocumento_Detalle_Cantidad_cursor_1')
    await t
    .pressKey('ctrl+a')
        .pressKey('backspace')
        
    await t
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '2')
    await t
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save')

        totalDoc=('#txtDocumento_Total .dx-texteditor-input').value)

        .expect(totalDoc>=200).ok
         .click(Selector('#dx-eea26f3a-288d-42b8-f5ba-79811b54a5e1 .erp-grid-action-glyph').nth(1))
    await t
    await t
        .click(Selector('button').withText('Eliminar'))
        .expect((('#txtDocumento_Total .dx-texteditor-input').value).eql(0)

          .click(Selector('#Documento_Tercero div').withText('811021438 - HGI S.A.S').nth(1))
    await t
        .typeText('#dx-740921a4-1d58-633a-286f-5ee190753fe0 .dx-texteditor-input', '1000099598')
    await t
        .click(Selector('#dx-61566ed5-e723-933e-1c3e-cff3bc0c4a0d div').withText('1000099598 - Vasquez Suarez Camilo'))
    await t
        .click(Selector('#BtnGuardarDocumento_btn span').withText('Guardar'))
    await t
        .click('#txtDocumento .dx-texteditor-input')
    await t
        
        .pressKey('enter')
    await t
        .expect(Selector('#Documento_Tercero div').withText('1000099598 - Vasquez Suarez Camilo').visible)
    
    await t
        .click(Selector('#BtnEliminarDocumento_btn span').withText('Eliminar'))
    await t
        .click(Selector('button').withText('Eliminar'))
});

test('New Test 3', async t => {
    await t
      
        .click(Selector('#ErpSidebarModulos a').withText('Movimientos'))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Documentos'))
    await t
        .click('#BtnNuevoDocumento .dx-button-content')
    await t
        .click('#Documento_Transaccion .dx-lookup-field')
    await t
        .typeText('#dx-aece67a6-c3a7-e3c7-8118-6318ab37aa79 .dx-texteditor-input', '01fe')
    await t
        .click(Selector('#dx-cd2aeb85-98dc-0cef-b17b-eb1069b5ada2 div').withText('01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA'))
    await t
        .click('#lbl_documento_ultimo_documento')
    await t
        .pressKey('enter')
    await t
        .click('#dx-eea26f3a-288d-42b8-f5ba-79811b54a5e1 .erp-grid-action-glyph')
    await t
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
    await t
    .pressKey('ctrl+a')
        .pressKey('backspace')
        
    await t
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '2', {
            caretPos: 1
        })
    await t
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save')
    await t
        .doubleClick('#txtDocumento_Total .dx-texteditor-input', {
            caretPos: 0
        })
    await t
        .click(Selector('#dx-eea26f3a-288d-42b8-f5ba-79811b54a5e1 .erp-grid-action-glyph').nth(1))
    await t
    await t
        .click(Selector('button').withText('Eliminar'))
    await t
      
});