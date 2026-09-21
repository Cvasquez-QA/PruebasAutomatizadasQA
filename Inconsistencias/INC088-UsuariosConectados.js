import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

const desplegableLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input');

const normalizarNumero = valor => {
    if (valor === null || valor === undefined) return NaN;
    const limpio = String(valor).trim();
    if (!limpio) return NaN;
    return parseFloat(limpio.replace(/\./g, '').replace(',', '.'));
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, esHgi360(config) ? 'Documentos' : 'DOCUMENTOS');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '087p');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '100')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);

    const numeroPedido = (await Selector('#txtDocumento').value).trim();

    await t
        .expect(numeroPedido).notEql('', 'No se capturó el número del pedido')
        .click('#BtnNuevoDocumento .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '087F');
    await t
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
        .click('#Documento_Pedido .dx-lookup-field')
        .typeText(desplegableLookup, `${numeroPedido} - ${numeroPedido}`)
        .wait(2000)
        .click(Selector('.dx-list-item').withText(`${numeroPedido} - ${numeroPedido}`))
        .click('#Documento_Descargar_Pedido .dx-icon.dx-icon-download')
        .click(Selector('button').withText('Aceptar'))
        .expect(Selector('.swal2-content div').withText('El Pedido aún no ha sido gestionado').visible).ok()
        .click(Selector('button').withText('Aceptar'));
    await abrirTransaccion(t, '087P');
    await t
        .click('#txtDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento .dx-texteditor-input', numeroPedido)
        .pressKey('enter')
        .wait(2000)
        .click(Selector('#BtnGestionPedidoDocumento div').withText('Gestión'))
        .expect(Selector('[class^="dx-overlay-content dx-toast-success dx-toast-content"] div')
            .withText('El pedido ha sido gestionado.').visible).ok();
    await abrirTransaccion(t, '087F');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .click('#Documento_Pedido .dx-lookup-field')
        .typeText(desplegableLookup, `${numeroPedido} - ${numeroPedido}`)
        .wait(2000)
        .click(Selector('.dx-list-item').withText(`${numeroPedido} - ${numeroPedido}`))
        .click('#Documento_Descargar_Pedido .dx-icon.dx-icon-download')
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);

    const totalDocumento = normalizarNumero(await Selector('#txtDocumento_Total .dx-texteditor-input').value);

    await t
        .expect(totalDocumento).notEql(0, 'El total del documento es 0')
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Gestion Pedidos INC088 testHGI360 Admin`
    .page(testAdminConfig.pagina);

test('Prueba Gestion Pedidos INC088 test Hgi360 admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
