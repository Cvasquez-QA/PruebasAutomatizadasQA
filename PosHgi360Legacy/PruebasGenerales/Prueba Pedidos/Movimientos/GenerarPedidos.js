import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const TX_PEDIDOS = '12 - PEDIDOS';
const TERCERO = '222222222222 - FINAL CONSUMIDOR';
const PRODUCTO_01 = '01';
const PRODUCTO_02 = '02';
const PRODUCTO_03 = '03';
const PRODUCTO_04 = '04';
const PRODUCTO_05 = '05';
const CANTIDAD_1 = '10';
const CANTIDAD_3 = '3';
const CANTIDAD_4 = '40';
const CANTIDAD_5 = '5';
const CANTIDAD_2_EDIT = '20';
const CANTIDAD_3_EDIT = '30';
const CANTIDAD_5_EDIT = '50';
const TX_FACTURA = '01 - FACTURA DE VENTA ELECTRÓNICA';
const DESCUENTO = '10';
const PREFIJO_SETP = 'SETP - ';

fixture `Prueba Pedidos Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Pedidos - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_PEDIDOS);
    await t
        //.typeText('#txtDocumento_Fecha .dx-texteditor-input','2024-10-24')
        .click(Selector('#Documento_Tercero .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TERCERO);
    await t
        .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', testPosConfig.fecha)
        //.click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-icon.dx-icon-chevronright'))
        //.click(Selector('[class^="dx-calendar-cell dx-calendar-other-view dx-calenda"] span').withText('1'))
        //.typeText('#txtDocumento_Descuento .dx-texteditor-input', '10')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
    //Se crean lineas productos
        //1er producto
        .click('#txtDocumento_Detalle_Producto_1 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_01))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD_1)
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        //2do producto
        .click('#txtDocumento_Detalle_Producto_2 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_02))
       // .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '20')
        .click('#txtDocumento_Detalle_Boton_2 .dx-button-content')
        //3er producto
        .click('#txtDocumento_Detalle_Producto_3 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_03))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', CANTIDAD_3)
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        //4to producto
        .click('#txtDocumento_Detalle_Producto_4 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_04))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', CANTIDAD_4)
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        //5to producto
        .click('#txtDocumento_Detalle_Producto_5 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_05))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_5', CANTIDAD_5)
        .click('#txtDocumento_Detalle_Boton_5 .dx-icon.dx-icon-check')
        /*
        //6to producto
        .click('#txtDocumento_Detalle_Producto_6 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText('01'))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_6', '10')
        .click('#txtDocumento_Detalle_Boton_6 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        //7mo
        .click('#txtDocumento_Detalle_Producto_7 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText('01'))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_7', '100')
        .click('#txtDocumento_Detalle_Boton_7 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        */
        .wait(3000)
        const numeroPedido = await (Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')).value;
    //Se valida si ya se creó el pedido

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numeroPedido)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(numeroPedido)).exists).ok('no se encuentra el pedido')
    //Se edita el pedido
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)
        .click('#txtDocumento_Detalle_Cantidad_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', CANTIDAD_2_EDIT)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')

        .click('#txtDocumento_Detalle_Cantidad_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', CANTIDAD_3_EDIT)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')


        .click('#txtDocumento_Detalle_Cantidad_cursor_5')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_5', CANTIDAD_5_EDIT)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_5 .dx-icon.dx-icon-check')


        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(28000)
        .wait(3000)
//------------------------------
//Se crea el documento donde se van a cargar los pedidos

    //Se ingresa a documentos

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    //Se adiciona un documento
        await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_FACTURA);
    await t
        .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',testPosConfig.fecha)
        .typeText('#txtDocumento_Descuento .dx-texteditor-input', DESCUENTO)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const numeroDoc = await (Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')).value;
    //Se valida si ya se creó el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numeroDoc)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(PREFIJO_SETP+numeroDoc)).exists).ok('no se encuentra el documento')
        .wait(3000)
//'Prueba carga pedido docu'
    //SE CARGAN LOS PEDIDOS AL DOCUMENTO
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)
        /*Con el F9
        .doubleClick('#txtDocumento')
        .pressKey('f9')
        .click('#Documento_Inicial_Pedido .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#Documento_Inicial_Pedido .dx-texteditor-input', '12')
        .click(Selector('#Btn_Documento_Pedido_Aceptar span').withText('Aceptar'))
        .wait(2000)
        */
        //CON LA FLECHA:
        .click(Selector('#Documento_Pedido .dx-lookup-field'));

        await filtrarPor(t, numeroPedido);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, numeroPedido+' - '+numeroPedido);
    await t
        .click('#Documento_Descargar_Pedido .dx-icon.dx-icon-download')
        .click(Selector('button').withText('Aceptar').nth(1))
       .wait(2000)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
        .wait(3000)
    /*
    //Se elimina el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numero)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(3000)
        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000)
        */
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Pedidos Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Pedidos - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_PEDIDOS);
    await t
        //.typeText('#txtDocumento_Fecha .dx-texteditor-input','2024-10-24')
        .click(Selector('#Documento_Tercero .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TERCERO);
    await t
        .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', hgiPosConfig.fecha)
        //.click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-icon.dx-icon-chevronright'))
        //.click(Selector('[class^="dx-calendar-cell dx-calendar-other-view dx-calenda"] span').withText('1'))
        //.typeText('#txtDocumento_Descuento .dx-texteditor-input', '10')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
    //Se crean lineas productos
        //1er producto
        .click('#txtDocumento_Detalle_Producto_1 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_01))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD_1)
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        //2do producto
        .click('#txtDocumento_Detalle_Producto_2 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_02))
       // .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '20')
        .click('#txtDocumento_Detalle_Boton_2 .dx-button-content')
        //3er producto
        .click('#txtDocumento_Detalle_Producto_3 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_03))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', CANTIDAD_3)
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        //4to producto
        .click('#txtDocumento_Detalle_Producto_4 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_04))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', CANTIDAD_4)
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        //5to producto
        .click('#txtDocumento_Detalle_Producto_5 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText(PRODUCTO_05))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_5', CANTIDAD_5)
        .click('#txtDocumento_Detalle_Boton_5 .dx-icon.dx-icon-check')
        /*
        //6to producto
        .click('#txtDocumento_Detalle_Producto_6 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText('01'))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_6', '10')
        .click('#txtDocumento_Detalle_Boton_6 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        //7mo
        .click('#txtDocumento_Detalle_Producto_7 .dx-icon.dx-icon-search')
        .doubleClick(Selector('#gridF4Productos td').withText('01'))
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_7', '100')
        .click('#txtDocumento_Detalle_Boton_7 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        */
        .wait(3000)
        const numeroPedido = await (Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')).value;
    //Se valida si ya se creó el pedido

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numeroPedido)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(numeroPedido)).exists).ok('no se encuentra el pedido')
    //Se edita el pedido
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)
        .click('#txtDocumento_Detalle_Cantidad_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', CANTIDAD_2_EDIT)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')

        .click('#txtDocumento_Detalle_Cantidad_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', CANTIDAD_3_EDIT)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')


        .click('#txtDocumento_Detalle_Cantidad_cursor_5')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_5', CANTIDAD_5_EDIT)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_5 .dx-icon.dx-icon-check')


        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(28000)
        .wait(3000)
//------------------------------
//Se crea el documento donde se van a cargar los pedidos

    //Se ingresa a documentos

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    //Se adiciona un documento
        await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_FACTURA);
    await t
        .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',hgiPosConfig.fecha)
        .typeText('#txtDocumento_Descuento .dx-texteditor-input', DESCUENTO)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const numeroDoc = await (Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')).value;
    //Se valida si ya se creó el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numeroDoc)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(PREFIJO_SETP+numeroDoc)).exists).ok('no se encuentra el documento')
        .wait(3000)
//'Prueba carga pedido docu'
    //SE CARGAN LOS PEDIDOS AL DOCUMENTO
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)
        /*Con el F9
        .doubleClick('#txtDocumento')
        .pressKey('f9')
        .click('#Documento_Inicial_Pedido .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#Documento_Inicial_Pedido .dx-texteditor-input', '12')
        .click(Selector('#Btn_Documento_Pedido_Aceptar span').withText('Aceptar'))
        .wait(2000)
        */
        //CON LA FLECHA:
        .click(Selector('#Documento_Pedido .dx-lookup-field'));

        await filtrarPor(t, numeroPedido);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, numeroPedido+' - '+numeroPedido);
    await t
        .click('#Documento_Descargar_Pedido .dx-icon.dx-icon-download')
        .click(Selector('button').withText('Aceptar').nth(1))
       .wait(2000)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
        .wait(3000)
    /*
    //Se elimina el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numero)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(3000)
        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000)
        */
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
