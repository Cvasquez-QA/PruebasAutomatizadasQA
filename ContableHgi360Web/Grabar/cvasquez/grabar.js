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
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', '8902')    
        .pressKey('enter')
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', 'admin')
    await t
        .pressKey('capslock')
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'C')
        .pressKey('capslock')
        .pressKey('enter')
    await t
        .typeText('#TxtUsuarioClave .dx-texteditor-input', 'alidad2026*')
    await t
        .pressKey('enter')
        .pressKey('enter')
    await t
       
    await t
        .click(Selector('#ErpSidebarModulos span').withText('Movimientos'))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Documentos'))
    await t
        .click('#filtros_ConDocumento_Comprobante .dx-dropdowneditor-icon')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'ingresos')
    await t
     
        .click(Selector('#dx-b366e93d-81c2-436a-a033-2ae4c53e4a72 div').withText('01 - INGRESOS'))
    await t
        .click(Selector('span').withText('Aceptar'))
    await t
     .click('#filtros_ConDocumento_NumeroConDocumento .dx-texteditor-input')
    await t
        .typeText('#filtros_ConDocumento_NumeroConDocumento .dx-texteditor-input', '8')
    await t
        .click(Selector('#BtnConsultarConDocumento span').withText('Consultar'))
    await t
        .click(Selector('[data-tooltip="Ver"] .erp-grid-action-glyph'))

        .click(Selector('#PnlGestionConDocumentos span').withText('Eliminar'))
    await t
        .click(Selector('button').withText('Eliminar'))
    await t
     .click(Selector('#ErpSidebarModulos a').withText('Herramientas'))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Importar/Exportar'))
    await t
        .click(Selector('#RgrTipoOperacion .dx-radiobutton-icon-dot').nth(1))
    await t
        //.click(Selector('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"] div').withText('Exportar'))
    await t
        .click('#CmbComprobante .dx-lookup-field')
    await t
        .click(Selector('#dx-a1a59d7a-a3d8-3fc4-2dde-6bb8e1537ad2 div').withText('01 - INGRESOS').nth(6))
    await t
        .click('#BtnGenerar .dx-icon.dx-icon-preferences')
    await t
        //.click(Selector('#ImportarExportarConPage div').withText('Exportando…').nth(1))
        .click(Selector('.erp-busy-overlay div').withText('Exportando…'))
    await t
        .click('#RgrTipoOperacion .dx-radiobutton-icon-dot')
    await t
        .click(Selector('[class^="dx-item dx-item-selected dx-radiobutton-checked dx"] div').withText('Importar'))
    await t
        
    await t
        .click('#LinkExaminarImportarExportarCon')
    await t
        .setFilesToUpload('#InputArchivoImportar', ['..\\..\\..\\..\\_uploads_\\ExportacionContable.csv'])
    await t
        .click('#BtnGenerar .dx-icon.dx-icon-preferences')
    await t
        .click(Selector('button').withText('Aceptar'))
    await t
        .expect('#swal2-html-container')
        //Selector('.swal2-html-container.erp-swal-message')
    await t
        .click(Selector('button').withText('Aceptar'))

    .click(Selector('#ErpSidebarModulos span').withText('Movimientos'))
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Documentos'))
    await t
        .click('#filtros_ConDocumento_Comprobante .dx-dropdowneditor-icon')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'),'ingresos')
    await t
     
        .click(Selector('#dx-b366e93d-81c2-436a-a033-2ae4c53e4a72 div').withText('01 - INGRESOS'))
    await t
        .click(Selector('span').withText('Aceptar'))
    await t
     .click('#filtros_ConDocumento_NumeroConDocumento .dx-texteditor-input')
    await t
        .typeText('#filtros_ConDocumento_NumeroConDocumento .dx-texteditor-input', '8')

        .expect('td').withText('8').visible
        cerrarSesion360
});