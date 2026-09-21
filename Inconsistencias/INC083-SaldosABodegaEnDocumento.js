/*
SE DEBE CAMBIAR LA TX Y BODEGA PARA HAPPGI Y PARA HGI360
*/


import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMaestros = HelpersHappgi.abrirMaestros;
let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMaestros = esHgi360(config) ? h.abrirMaestros360 : h.abrirMaestros;
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
}; 


fixture `Prueba Documentos testHappgi Admin`
    .page (testHappgiAdminConfig.pagina)

test('Prueba Documentos testhappgi admin', async t => {
    usarHelpersDe(testHappgiAdminConfig);
    await ingresarAplicacion(t, testHappgiAdminConfig);
    await abrirMaestros(t, esHgi360(testHappgiAdminConfig) ? 'Productos' : 'PRODUCTOS');
    await t
    await t
        .typeText(Selector('.dx-texteditor-input'), '010202')
        .wait(2000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .typeText(Selector('.dx-texteditor-input').nth(35),'01') 
        .wait(2000)
     const producto = await Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(1).find('td').nth(1).innerText
        const saldo = Number(producto.replace(',', '.'));
        await t 
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('a').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '04');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .click(Selector('#Documento_Bodega .dx-lookup-field'))
        .click(Selector('.dx-item-content').withText('01'))
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
    //Se crean lineas productos
        //1er producto
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010202')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '10')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .wait(3000)
    //Se valida si tomó la Bodega
         .click(Selector('a').withText('Maestros'))
        .click(Selector('span').withText('PRODUCTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    await t
        .typeText(Selector('.dx-texteditor-input'), '010202')
        .wait(2000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .typeText(Selector('.dx-texteditor-input').nth(35),'01') 
        .wait(2000)
        const productoNew = await Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(1).find('td').nth(1).innerText
        const saldoNew =  Number(productoNew.replace(',', '.'));
        await t 
        .expect(saldoNew).eql(saldo + 10, 'el valor del saldo no corresponde al correcto luego de hacer la compra')
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
    //Se cierra sesión
        .switchToMainWindow();
    await cerrarSesion(t);
});

/*
***********
*************
**************
***********
**************
**********
********
*/

fixture `Prueba Documentos testHappgi Admin`
    .page (testAdminConfig.pagina)

test('Prueba Documentos testhappgi admin', async t => {
    usarHelpersDe(testAdminConfig);
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros(t, esHgi360(testAdminConfig) ? 'Productos' : 'PRODUCTOS');
    await t
    await t
        .typeText(Selector('.dx-texteditor-input'), '010202')
        .wait(2000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .typeText(Selector('.dx-texteditor-input').nth(35),'01') 
        .wait(2000)
     const producto = await Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(1).find('td').nth(4).innerText
        const saldo = Number(producto.replace(',', '.'));
        await t 
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('a').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '05QA');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .click(Selector('#Documento_Bodega .dx-lookup-field'))
        .click(Selector('.dx-item-content').withText('01 - PRINCIPAL'))
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
    //Se crean lineas productos
        //1er producto
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010202')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '10')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .wait(3000)
    //Se valida si tomó la Bodega
         .click(Selector('a').withText('Maestros'))
        .click(Selector('span').withText('PRODUCTOS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    await t
        .typeText(Selector('.dx-texteditor-input'), '010202')
        .wait(2000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .typeText(Selector('.dx-texteditor-input').nth(35),'01') 
        .wait(2000)
        const productoNew = await Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(1).find('td').nth(4).innerText
        const saldoNew =  Number(productoNew.replace(',', '.'));
        await t 
        .expect(saldoNew).eql(saldo + 10, 'el valor del saldo no corresponde al correcto luego de hacer la compra')
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
    //Se cierra sesión
        .switchToMainWindow();
    await cerrarSesion(t);
});