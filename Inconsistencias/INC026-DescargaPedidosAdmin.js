import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

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

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, 'INC026P');
    await t
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'));
    const pedido = await Selector('#txtDocumento .dx-texteditor-input').value;
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '3')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .wait(1500)
        .click(Selector('#txtDocumento_Observaciones .dx-texteditor-input'))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtDocumento_Observaciones .dx-texteditor-input'), 'Prueba observacion INC026')
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#BtnNuevoDocumento span').withText('Nuevo'));
    await abrirTransaccion(t, 'INC026F');
    await t
        .wait(1500)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(1500)
        .click('#Documento_Pedido .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), pedido)
        .expect(Selector('.dx-list-item').withText(`${pedido} - ${pedido}`).exists).ok('No se encuentra el pedido relacionado')
        .click(Selector('.dx-list-item').withText(`${pedido} - ${pedido}`));
    const flecha = Selector('#Documento_Descargar_Pedido .dx-icon.dx-icon-download');
    await t
        .expect(flecha.exists).ok('No se encontró la flecha para descargar los pedidos')
        .click(flecha)
        .click(Selector('button').withText('Aceptar'))
        .wait(esHgi360(config) ? 25000 : 4000)
        .expect(Selector('td').withText('010203').exists).ok('No se encontró el producto en la grilla')
        .expect(Selector('td').withText('3,00').exists).ok('No se encontró la cantidad en la grilla')
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#BtnAtrasDocumento span').withText('Atras'))
        .click(Selector('#ButtonConsultar span').withText('Consultar'))
        .wait(3000)
        .click('#ListagridDocumentos .dx-texteditor-input')
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input'), 'INC026P')
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1), pedido)
        .wait(2000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(1500)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Descarga Pedido Admin testerp`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Descarga Pedido Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Descarga Pedido Admin HappgiTest`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Descarga Pedido Happgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});
