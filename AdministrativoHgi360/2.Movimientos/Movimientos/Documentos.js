import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    parseValorNumerico,
    eliminarDocumento360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const TX_DOCUMENTO = '01FE';
const DESCUENTO = '10';
const PRODUCTO_1 = '01';
const TERCERO = '811021438';

async function ejecutarPruebaDocumentos(t, config, ingresar) {
    await ingresar(t, config);
    await abrirMovimientos360(t, 'Documentos');
    await t
    .wait(2000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, TX_DOCUMENTO);
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t.click('#Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, TERCERO);
    await t.wait(2000);
    await seleccionarOpcion(t, TERCERO);
    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(3000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO_1)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-delete dx"]'))
        .click(Selector('button').withText('Aceptar'))
        //Se vuelve a insertar el detalle
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO_1)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
    const valorDocumento = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');

    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(7000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;
    
        await cerrarPestana360(t);
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');
        await filtrarPor(t, TX_DOCUMENTO);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TX_DOCUMENTO))
        .doubleClick('#txtDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento .dx-texteditor-input', numeroDocumento)
        .pressKey('enter')
        .wait(2000)
    
        const button = Selector('#BtnImprimirDocumento');
        const ariaDisabledValue = await button.getAttribute('aria-disabled');
        if (Selector('#frmDocumento label').withText('No recibido')) {
            await t.expect(ariaDisabledValue).eql('true', 'El botón imprimir está  habilitado sin el documento haber sido enviado a la DIAN');
        }

        await t
            .wait(3000)
            .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]'))
            .click('#txtDocumento_Detalle_Cantidad_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '2')
            .pressKey('enter')
            .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
            .wait(4000)
            .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
            .wait(3000);
            const valorDocumento_2 = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');

    
        await cerrarPestana360(t);
        await abrirMovimientos360(t, 'Documentos');
        await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');
        await filtrarPor(t, TX_DOCUMENTO);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TX_DOCUMENTO))
        .doubleClick('#txtDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento .dx-texteditor-input', numeroDocumento)
        .pressKey('enter')
        .wait(2000)
        .expect(valorDocumento_2).notEql(valorDocumento, 'El valor del documento no es el esperado')
        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}


fixture `Prueba Documentos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Documentos Test Hgi360 admin - Test Hgi360', async t => {
    await ejecutarPruebaDocumentos(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Documentos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Documentos admin - Hgi360 Admin', async t => {
    await ejecutarPruebaDocumentos(t, hgiAdminConfig, ingresarAplicacion);
});
