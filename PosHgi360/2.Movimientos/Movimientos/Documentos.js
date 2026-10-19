import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    abrirMovimientos360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const TX_DOCUMENTO = '25';
const TX_DOCUMENTO_TEXTO = '25 - VALIDACION CAMPOS';
const DESCUENTO = '10';
const PRODUCTO_1 = '01';
const CANTIDAD_1 = '1';
const VALOR_UNITARIO_1 = '1000';
const PRODUCTO_2 = '02';
const CANTIDAD_2 = '2';
const VALOR_UNITARIO_2 = '2000';
const PRODUCTO_3 = '03';
const CANTIDAD_3 = '3';
const VALOR_UNITARIO_3 = '3000';
const PRODUCTO_4 = '04';
const CANTIDAD_4 = '4';
const VALOR_UNITARIO_4 = '4000';
const CANTIDAD_EDIT_1 = '2';
const CANTIDAD_EDIT_2 = '3';
const PREFIJO_DOCUMENTO = 'SETP - ';
const TX_DOCUMENTO_ENVIO = '0101';
const TX_DOCUMENTO_ENVIO_TEXTO = '0101Doc - PRUEBA FACTURA DE VENTA';
const TERCERO_FILTRO = 'hgi';
const TERCERO_TEXTO = '811021438 - HGI S.A.S - HGI S.A.S';
const PRODUCTO = '010203';
const CANTIDAD = '1';
const VALOR_UNITARIO = '1000';

fixture `Prueba Documentos testERP Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Documentos testerp - Test Hgi360', async t => {
   await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000);

        await filtrarPor(t, TX_DOCUMENTO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO_TEXTO);
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).ok('No muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#modal_Documento_validacion .close'))
        .click('#Documento_Dependencia .dx-lookup-field')
        .pressKey('down')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
            await t
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',formattedDate)
           .typeText('#txtDocumento_Descuento .dx-texteditor-input', DESCUENTO)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('#txtDocumento')
        const numero = await documento.value;
            //Se crean lineas productos
        //1er producto
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO_1)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD_1)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', VALOR_UNITARIO_1)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        //2do producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check').visible).notOk('Sigue en la primera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_2', PRODUCTO_2)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', CANTIDAD_2)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_2', VALOR_UNITARIO_2)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        //3er producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check').visible).notOk('Sigue en la segunda línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_3', PRODUCTO_3)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', CANTIDAD_3)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_3', VALOR_UNITARIO_3)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        //4to producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check').visible).notOk('Sigue en la tercera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_4', PRODUCTO_4)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', CANTIDAD_4)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_4')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_4', VALOR_UNITARIO_4)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'));

        await cerrarPestana360(t);
        await t.wait(3000);
        //Se valida si ya se creó el documento
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(PREFIJO_DOCUMENTO + numero))
        .wait(6000)
        .expect((Selector('td').withText(PREFIJO_DOCUMENTO + numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
    //Validación Botón imprimir deshabilitado para Documento sin haber enviado a la DIAN'
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
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
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD_EDIT_1)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click('#txtDocumento_Detalle_Cantidad_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', CANTIDAD_EDIT_2)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(4000)
       /*
        .click('#txtDocumento_Detalle_Cantidad_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', '4')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')

        .click('#txtDocumento_Detalle_Cantidad_cursor_4')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', '5')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        */
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        /////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////


        await cerrarPestana360(t);
        await t.wait(3000);
    //Se elimina el documento
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(PREFIJO_DOCUMENTO + numero))
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(5000)
        //Ultimas validaciones
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_1').value).eql(CANTIDAD_EDIT_1)
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_2').value).eql(CANTIDAD_EDIT_2)

        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

test('Prueba ENVIO Documentos testerp - Test Hgi360', async t => {
   await ingresarAplicacion(t, testPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        //Se crea el documento
        .wait(4000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');

        await filtrarPor(t, TX_DOCUMENTO_ENVIO);
        await t
        .wait(1500)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO_ENVIO_TEXTO);
    await t
        .click(Selector('#Documento_Tercero .dx-lookup-field'));

        await filtrarPor(t, TERCERO_FILTRO);
            await seleccionarOpcion(t, TERCERO_TEXTO);
    await t
        //.click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        /*
        .click('#tabs_documento_Ubicacion')
        .click(Selector('#Documento_Cpto_Doc_Adicional .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, 'OC - Orden de compra');
    await t
        */
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).ok('No muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#modal_Documento_validacion .close'))
        .click('#Documento_Dependencia .dx-lookup-field')
        .pressKey('down')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(3000)
        const documento = Selector('#txtDocumento')
        const numero = await documento.value;
                //Se ingresan detalles
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .pressKey('enter')
        //la cantidad
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD)
        .pressKey('enter')
        //el precio unitario
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', VALOR_UNITARIO)
        .pressKey('enter')
        .pressKey('enter')//con este se guarda el detalle
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .click(Selector('[title="Enviar"] div').withText('Enviar'))
        .wait(5000)
        const texto = await Selector('.swal2-popup.swal2-modal.swal2-show');
        if(await texto.exists){
            textoMensaje = await Selector('#swal2-content').innerText;
            await t
        .expect(textoMensaje.exists).notOk('No se pudo enviar el documento por el error: '+textoMensaje)
            //.expect(Selector('#swal2-content').withText('No se encontró parametrización del concepto de documento adicional para el documento referencia').exists).notOk('No se pudo enviar el documeto')
        }
        await t
        .wait(1500);
        await cerrarPestana360(t);
                //Se vuelve a abrir el modal de documentos parta validar su creación y si envió a la DIAN
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click('#ListagridDocumentos .dx-context-menu-container-border')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] span').withText('Igual'))
        .doubleClick(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(PREFIJO_DOCUMENTO + numero))
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(6000)
        .expect((Selector('td').withText(PREFIJO_DOCUMENTO + numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(3000)
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .expect(Selector('[title="XML"] div').withText('XML').visible).ok('No se envió a la DIAN')
    //Se cierra sesión
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Documentos testERP Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Documentos testerp - Hgi360 Pos', async t => {
   await ingresarAplicacion(t, hgiPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000);

        await filtrarPor(t, TX_DOCUMENTO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO_TEXTO);
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).ok('No muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#modal_Documento_validacion .close'))
        .click('#Documento_Dependencia .dx-lookup-field')
        .pressKey('down')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // yyyy-mm-dd
            await t
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',formattedDate)
           .typeText('#txtDocumento_Descuento .dx-texteditor-input', DESCUENTO)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        const documento = Selector('#txtDocumento')
        const numero = await documento.value;
            //Se crean lineas productos
        //1er producto
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO_1)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD_1)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', VALOR_UNITARIO_1)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        //2do producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check').visible).notOk('Sigue en la primera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_2', PRODUCTO_2)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', CANTIDAD_2)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_2', VALOR_UNITARIO_2)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        //3er producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check').visible).notOk('Sigue en la segunda línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_3', PRODUCTO_3)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', CANTIDAD_3)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_3', VALOR_UNITARIO_3)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')
        //4to producto
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check').visible).notOk('Sigue en la tercera línea')
        .typeText('#txtDocumento_Detalle_Producto_cursor_4', PRODUCTO_4)
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', CANTIDAD_4)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_4')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_4', VALOR_UNITARIO_4)
        //.pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'));

        await cerrarPestana360(t);
        await t.wait(3000);
        //Se valida si ya se creó el documento
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(PREFIJO_DOCUMENTO + numero))
        .wait(6000)
        .expect((Selector('td').withText(PREFIJO_DOCUMENTO + numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
    //Validación Botón imprimir deshabilitado para Documento sin haber enviado a la DIAN'
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
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
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD_EDIT_1)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click('#txtDocumento_Detalle_Cantidad_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', CANTIDAD_EDIT_2)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(4000)
       /*
        .click('#txtDocumento_Detalle_Cantidad_cursor_3')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_3', '4')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_3 .dx-icon.dx-icon-check')

        .click('#txtDocumento_Detalle_Cantidad_cursor_4')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_4', '5')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_4 .dx-icon.dx-icon-check')
        */
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        /////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////


        await cerrarPestana360(t);
        await t.wait(3000);
    //Se elimina el documento
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(PREFIJO_DOCUMENTO + numero))
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(5000)
        //Ultimas validaciones
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_1').value).eql(CANTIDAD_EDIT_1)
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_2').value).eql(CANTIDAD_EDIT_2)

        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

test('Prueba ENVIO Documentos testerp - Hgi360 Pos', async t => {
   await ingresarAplicacion(t, hgiPosConfig);
    await abrirMovimientos360(t, 'Documentos');
    await t
        //Se crea el documento
        .wait(4000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');

        await filtrarPor(t, TX_DOCUMENTO_ENVIO);
        await t
        .wait(1500)
        ;
    await seleccionarOpcion(t, TX_DOCUMENTO_ENVIO_TEXTO);
    await t
        .click(Selector('#Documento_Tercero .dx-lookup-field'));

        await filtrarPor(t, TERCERO_FILTRO);
            await seleccionarOpcion(t, TERCERO_TEXTO);
    await t
        //.click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        /*
        .click('#tabs_documento_Ubicacion')
        .click(Selector('#Documento_Cpto_Doc_Adicional .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, 'OC - Orden de compra');
    await t
        */
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).ok('No muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#modal_Documento_validacion .close'))
        .click('#Documento_Dependencia .dx-lookup-field')
        .pressKey('down')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(3000)
        const documento = Selector('#txtDocumento')
        const numero = await documento.value;
                //Se ingresan detalles
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .pressKey('enter')
        //la cantidad
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD)
        .pressKey('enter')
        //el precio unitario
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', VALOR_UNITARIO)
        .pressKey('enter')
        .pressKey('enter')//con este se guarda el detalle
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .click(Selector('[title="Enviar"] div').withText('Enviar'))
        .wait(5000)
        const texto = await Selector('.swal2-popup.swal2-modal.swal2-show');
        if(await texto.exists){
            textoMensaje = await Selector('#swal2-content').innerText;
            await t
        .expect(textoMensaje.exists).notOk('No se pudo enviar el documento por el error: '+textoMensaje)
            //.expect(Selector('#swal2-content').withText('No se encontró parametrización del concepto de documento adicional para el documento referencia').exists).notOk('No se pudo enviar el documeto')
        }
        await t
        .wait(1500);
        await cerrarPestana360(t);
                //Se vuelve a abrir el modal de documentos parta validar su creación y si envió a la DIAN
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click('#ListagridDocumentos .dx-context-menu-container-border')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] span').withText('Igual'))
        .doubleClick(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1),(PREFIJO_DOCUMENTO + numero))
        .click(Selector('#PnlConsultaDocumentos span').withText('Consultar'))
        .wait(6000)
        .expect((Selector('td').withText(PREFIJO_DOCUMENTO + numero)).exists).ok('no se encuentra el documento')
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(3000)
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .expect(Selector('[title="XML"] div').withText('XML').visible).ok('No se envió a la DIAN')
    //Se cierra sesión
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
