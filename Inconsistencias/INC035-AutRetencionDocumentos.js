import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimientoPos;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimientoPos;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};  

fixture `Prueba Documentos test  Pos`
    .page (testPosConfig.pagina)

test('Prueba CRUD Documentos testerp', async t => {
    usarHelpersDe(testPosConfig);
    await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientoPos(t, esHgi360(testPosConfig) ? 'Documentos' : 'DOCUMENTOS');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '9598');
    await t
    //Se adiciona un documento
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
            await t
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',formattedDate)
           .typeText('#txtDocumento_Descuento .dx-texteditor-input', '10')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('#txtDocumento')
        const numero = await documento.value;
        await t 
    //Se crean lineas productos
        //1er producto
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01QA')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        //2do producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check').visible).notOk('Sigue en la primera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_2', '02')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '2')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_2', '2000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        //3er producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check').visible).notOk('Sigue en la segunda línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_3', '03')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', '3')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_3', '3000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        //4to producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check').visible).notOk('Sigue en la tercera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_4', '04')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', '4')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_4')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_4', '4000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))

        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMovimientoPos(t, esHgi360(testPosConfig) ? 'Documentos' : 'DOCUMENTOS');
    await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input'),('9598'))
        .wait(2000)
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(numero))
        .wait(3000)
        .expect(Selector('td').withText(numero).exists).ok('no se encuentra el documento')
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        await t
        .wait(3000)
    //Se edita el documento
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '2')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click('#txtDocumento_Detalle_Cantidad_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '3')
        .pressKey('enter')    
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(4000)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .wait(3000)
    //Se elimina el documento
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input'),('9598'))
        .wait(3000)
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(numero))
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')  
        .wait(5000)  
        //Ultimas validaciones
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_1').value).eql('2')
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_2').value).eql('3')

        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000)
     
        .switchToMainWindow();
    await cerrarSesion(t);
});
/*

fixture `Prueba Documentos off line Pos`
    .page (offPosConfig.pagina)

test('Prueba CRUD Documentos testerp', async t => {
   await t
  //Se ingresa al aplicativo
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', offPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', offPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('a').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '9598')
        .wait(2000)
        .click(Selector('div').withText('9598 - Prueba Aut Documentos').nth(9))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
            await t
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',formattedDate)
           .typeText('#txtDocumento_Descuento .dx-texteditor-input', '10')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('#txtDocumento')
        const numero = await documento.value;
        await t 
    //Se crean lineas productos
        //1er producto
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01QA')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        //2do producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check').visible).notOk('Sigue en la primera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_2', '02')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '2')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_2', '2000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        //3er producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check').visible).notOk('Sigue en la segunda línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_3', '03')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', '3')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_3', '3000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        //4to producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check').visible).notOk('Sigue en la tercera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_4', '04')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', '4')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_4')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_4', '4000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))

        
        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMovimientoPos(t, esHgi360(testPosConfig) ? 'Documentos' : 'DOCUMENTOS');
    await t
     
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input'),('9598'))
        .wait(2000)
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(numero))
        .wait(3000)
        .expect(Selector('td').withText(numero).exists).ok('no se encuentra el documento')
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        /*
    //Validación Botón imprimir deshabilitado para Documento sin haber enviado a la DIAN'
        .wait(4000)
        // Acceder al atributo aria-disabled
        const button = Selector('#BtnImprimirDocumento');
        const ariaDisabledValue = await button.getAttribute('aria-disabled'); 
        if(Selector('#frmDocumento label').withText('No recibido')){
         await t.expect(ariaDisabledValue).eql('true', 'El botón imprimir está  habilitado sin el documento haber sido enviado a la DIAN')
        }
        
        await t
        .wait(3000)
    //Se edita el documento
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '2')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click('#txtDocumento_Detalle_Cantidad_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '3')
        .pressKey('enter')    
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(4000)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .wait(3000)
    //Se elimina el documento
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
      
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input'),('9598'))
        .wait(3000)
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(numero))
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')  
        .wait(5000)  
        //Ultimas validaciones
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_1').value).eql('2')
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_2').value).eql('3')

        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000)
     
       
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))

});
*/
