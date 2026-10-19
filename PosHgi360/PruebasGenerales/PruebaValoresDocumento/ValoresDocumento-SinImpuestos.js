import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const FILTRO_TX = '25';
const TX_DOCUMENTO = '25 - VALIDACIÓN CAMPOS';
const PRODUCTO_01 = '01';
const PRODUCTO_03 = '03';
const PRODUCTO_05 = '05';
const PREFIJO_SETP = 'SETP - ';

fixture `Prueba Valores Documentos - Impuestos no incluídos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Valores Documento 1 detalle - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText((Selector('.dx-texteditor-input-container').nth(57).find('.dx-texteditor-input')),FILTRO_TX)
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
        //.typeText('#txtDocumento_Fecha .dx-texteditor-input','2024-10-24')
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', testPosConfig.fecha)
        //.click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-icon.dx-icon-chevronright'))
        //.click(Selector('[class^="dx-calendar-cell dx-calendar-other-view dx-calenda"] span').withText('1'))
        //.typeText('#txtDocumento_Descuento .dx-texteditor-input', '10')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')
        const numero = await documento.value;
            //Se crean lineas productos
        //1er producto
        .click('#txtDocumento_Detalle_Producto_1 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_01))
        .pressKey('enter')
        //.typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')

        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
    //Se valida si ya se creó el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numero)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(PREFIJO_SETP+numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
        .typeText((Selector('#ListagridDocumentos .dx-texteditor-input').nth(1)),PREFIJO_SETP+numero)
        .wait(3000)
    //Validación Valores y cálculos correctos'
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)

        //Valor Impuesto 1
        let valorCampo =  await Selector('#txtDocumento_Detalle_VrImpuesto_1').innerText;
        let vlrParseado = valorCampo.replace(/\./g, '');
        let vlrImpuesto1 = parseInt(vlrParseado);

        //Valor Impuesto 2
        let valorCampo2 =  await Selector('#txtDocumento_Detalle_VrImpuesto2_1').innerText;
        let vlrParseado2 = valorCampo2.replace(/\./g, '');
        let vlrImpuesto2 = parseInt(vlrParseado2);

        /*
        let valorImpCon =  await Selector('#txtDocumento_ImpCon .dx-texteditor-input').value;
        let vlrParseado3 = valorCampo3.replace(/\./g, '');
        let vlrImpuesto2 = parseInt(vlrParseado2);
        */

        await t
        .expect(parseInt(((await Selector('#txtDocumento_ImpCon .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrImpuesto1+vlrImpuesto2)

        //Valor Iva
        let valorCampo3 =  await Selector('#txtDocumento_Detalle_VrIva_1').innerText;
        let vlrParseado3 = valorCampo3.replace(/\./g, '');
        let vlrImpuestoIva = parseInt(vlrParseado3);

        await t
        .expect(parseInt(((await Selector('#txtDocumento_Iva .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrImpuestoIva)

        //Valor subtotal
        let valorCampo4 =  await Selector('#txtDocumento_Detalle_total_1').innerText;
        let vlrParseado4 = valorCampo4.replace(/\./g, '');
        let vlrSubTotal = parseInt(vlrParseado4);

        await t
        .expect(parseInt(((await Selector('#txtDocumento_SubTotal .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrSubTotal)

        //sumatoria valor total
        .expect(parseInt(((await Selector('#txtDocumento_Total .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrSubTotal+vlrImpuesto1+vlrImpuesto2+vlrImpuestoIva)
        .wait(3000)
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
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
*/
test('Prueba Valores Documento varios detalles - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText((Selector('.dx-texteditor-input-container').nth(57).find('.dx-texteditor-input')),FILTRO_TX)
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', testPosConfig.fecha)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')
        const numero = await documento.value;
            //Se crean lineas productos
        //1er producto
        .click('#txtDocumento_Detalle_Producto_1 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_01))
        .wait(2000)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(2000)
        //2do producto
        .click('#txtDocumento_Detalle_Producto_2 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_03))
        .wait(2000)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(2000)
        //3er producto
        .click('#txtDocumento_Detalle_Producto_3 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_05))
        .wait(2000)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        .wait(2000)

        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
    //Se valida si ya se creó el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numero)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(PREFIJO_SETP+numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
        .typeText((Selector('#ListagridDocumentos .dx-texteditor-input').nth(1)),PREFIJO_SETP+numero)
        .wait(3000)
//Validación Valores y cálculos correctos'
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)

        let valorCampo;
        let vlrParseado;
        let vlrTotalDetalle;
        let vlrImpuesto1;
        let vlrImpuesto2;
        let vlrImpuestoIva;
        let sumImpuesto1=0;
        let sumImpuesto2=0;
        let sumSubTotal=0;
        let sumIva=0;

        for(let i=1; i<4; i++){
        //Detalles
        //Valor subtotal
        valorCampo =  await Selector('#txtDocumento_Detalle_total_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrTotalDetalle = parseInt(vlrParseado);
        //Valor Impuesto 1
        valorCampo =  await Selector('#txtDocumento_Detalle_VrImpuesto_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrImpuesto1 = parseInt(vlrParseado);
        //Valor Impuesto 2
        valorCampo =  await Selector('#txtDocumento_Detalle_VrImpuesto2_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrImpuesto2 = parseInt(vlrParseado);
        //Valor Iva
        valorCampo =  await Selector('#txtDocumento_Detalle_VrIva_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrImpuestoIva = parseInt(vlrParseado);

        sumImpuesto1 += vlrImpuesto1;
        sumImpuesto2 += vlrImpuesto2;
        sumSubTotal += vlrTotalDetalle;
        sumIva += vlrImpuestoIva;
        }

            //ImpCon
        .expect(parseInt(((await Selector('#txtDocumento_ImpCon .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumImpuesto1+sumImpuesto2)
        //Iva
        .expect(parseInt(((await Selector('#txtDocumento_Iva .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumIva)
        //SubTotal
        .expect(parseInt(((await Selector('#txtDocumento_SubTotal .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumSubTotal)
        //sumatoria valor total
       .expect(parseInt(((await Selector('#txtDocumento_Total .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumSubTotal+sumImpuesto1+sumImpuesto2+sumIva)
        .wait(3000)
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
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Valores Documentos - Impuestos no incluídos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Valores Documento 1 detalle - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText((Selector('.dx-texteditor-input-container').nth(57).find('.dx-texteditor-input')),FILTRO_TX)
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
        //.typeText('#txtDocumento_Fecha .dx-texteditor-input','2024-10-24')
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', hgiPosConfig.fecha)
        //.click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-icon.dx-icon-chevronright'))
        //.click(Selector('[class^="dx-calendar-cell dx-calendar-other-view dx-calenda"] span').withText('1'))
        //.typeText('#txtDocumento_Descuento .dx-texteditor-input', '10')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')
        const numero = await documento.value;
            //Se crean lineas productos
        //1er producto
        .click('#txtDocumento_Detalle_Producto_1 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_01))
        .pressKey('enter')
        //.typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')

        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
    //Se valida si ya se creó el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numero)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(PREFIJO_SETP+numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
        .typeText((Selector('#ListagridDocumentos .dx-texteditor-input').nth(1)),PREFIJO_SETP+numero)
        .wait(3000)
    //Validación Valores y cálculos correctos'
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)

        //Valor Impuesto 1
        let valorCampo =  await Selector('#txtDocumento_Detalle_VrImpuesto_1').innerText;
        let vlrParseado = valorCampo.replace(/\./g, '');
        let vlrImpuesto1 = parseInt(vlrParseado);

        //Valor Impuesto 2
        let valorCampo2 =  await Selector('#txtDocumento_Detalle_VrImpuesto2_1').innerText;
        let vlrParseado2 = valorCampo2.replace(/\./g, '');
        let vlrImpuesto2 = parseInt(vlrParseado2);

        /*
        let valorImpCon =  await Selector('#txtDocumento_ImpCon .dx-texteditor-input').value;
        let vlrParseado3 = valorCampo3.replace(/\./g, '');
        let vlrImpuesto2 = parseInt(vlrParseado2);
        */

        await t
        .expect(parseInt(((await Selector('#txtDocumento_ImpCon .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrImpuesto1+vlrImpuesto2)

        //Valor Iva
        let valorCampo3 =  await Selector('#txtDocumento_Detalle_VrIva_1').innerText;
        let vlrParseado3 = valorCampo3.replace(/\./g, '');
        let vlrImpuestoIva = parseInt(vlrParseado3);

        await t
        .expect(parseInt(((await Selector('#txtDocumento_Iva .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrImpuestoIva)

        //Valor subtotal
        let valorCampo4 =  await Selector('#txtDocumento_Detalle_total_1').innerText;
        let vlrParseado4 = valorCampo4.replace(/\./g, '');
        let vlrSubTotal = parseInt(vlrParseado4);

        await t
        .expect(parseInt(((await Selector('#txtDocumento_SubTotal .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrSubTotal)

        //sumatoria valor total
        .expect(parseInt(((await Selector('#txtDocumento_Total .dx-texteditor-input').value).replace(/\./g, '')))).eql(vlrSubTotal+vlrImpuesto1+vlrImpuesto2+vlrImpuestoIva)
        .wait(3000)
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
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
*/
test('Prueba Valores Documento varios detalles - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText((Selector('.dx-texteditor-input-container').nth(57).find('.dx-texteditor-input')),FILTRO_TX)
        .wait(3000)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', hgiPosConfig.fecha)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('[data-ng-include^="\\\'/Views/Pages/Administrativo/Documentos/Documentos"] .form-control')
        const numero = await documento.value;
            //Se crean lineas productos
        //1er producto
        .click('#txtDocumento_Detalle_Producto_1 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_01))
        .wait(2000)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(2000)
        //2do producto
        .click('#txtDocumento_Detalle_Producto_2 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_03))
        .wait(2000)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(2000)
        //3er producto
        .click('#txtDocumento_Detalle_Producto_3 .dx-icon.dx-icon-search')
        .click(Selector('#gridF4Productos td').withText(PRODUCTO_05))
        .wait(2000)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        .wait(2000)

        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
    //Se valida si ya se creó el documento

    await cerrarPestana360(t);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#filtros_Documento_NumeroDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#filtros_Documento_NumeroDocumento .dx-texteditor-input',numero)
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(3000)
        .expect((Selector('td').withText(PREFIJO_SETP+numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
        .typeText((Selector('#ListagridDocumentos .dx-texteditor-input').nth(1)),PREFIJO_SETP+numero)
        .wait(3000)
//Validación Valores y cálculos correctos'
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(4000)

        let valorCampo;
        let vlrParseado;
        let vlrTotalDetalle;
        let vlrImpuesto1;
        let vlrImpuesto2;
        let vlrImpuestoIva;
        let sumImpuesto1=0;
        let sumImpuesto2=0;
        let sumSubTotal=0;
        let sumIva=0;

        for(let i=1; i<4; i++){
        //Detalles
        //Valor subtotal
        valorCampo =  await Selector('#txtDocumento_Detalle_total_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrTotalDetalle = parseInt(vlrParseado);
        //Valor Impuesto 1
        valorCampo =  await Selector('#txtDocumento_Detalle_VrImpuesto_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrImpuesto1 = parseInt(vlrParseado);
        //Valor Impuesto 2
        valorCampo =  await Selector('#txtDocumento_Detalle_VrImpuesto2_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrImpuesto2 = parseInt(vlrParseado);
        //Valor Iva
        valorCampo =  await Selector('#txtDocumento_Detalle_VrIva_'+i).innerText;
        vlrParseado = valorCampo.replace(/\./g, '')|| 0;
        vlrImpuestoIva = parseInt(vlrParseado);

        sumImpuesto1 += vlrImpuesto1;
        sumImpuesto2 += vlrImpuesto2;
        sumSubTotal += vlrTotalDetalle;
        sumIva += vlrImpuestoIva;
        }

            //ImpCon
        .expect(parseInt(((await Selector('#txtDocumento_ImpCon .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumImpuesto1+sumImpuesto2)
        //Iva
        .expect(parseInt(((await Selector('#txtDocumento_Iva .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumIva)
        //SubTotal
        .expect(parseInt(((await Selector('#txtDocumento_SubTotal .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumSubTotal)
        //sumatoria valor total
       .expect(parseInt(((await Selector('#txtDocumento_Total .dx-texteditor-input').value).replace(/\./g, '')))).eql(sumSubTotal+sumImpuesto1+sumImpuesto2+sumIva)
        .wait(3000)
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
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
