import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMaestros = HelpersHappgi.abrirMaestros;
let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let eliminarDocumento = HelpersHappgi.eliminarDocumento;
let filtrarPor = HelpersHappgi.filtrarPor;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let parseValorNumerico = HelpersHappgi.parseValorNumerico;
let seleccionarOpcion = HelpersHappgi.seleccionarOpcion;
let selectorOpcion = HelpersHappgi.selectorOpcion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMaestros = es360 ? h.abrirMaestros360 : h.abrirMaestros;
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = es360 && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    eliminarDocumento = h.eliminarDocumento;
    filtrarPor = h.filtrarPor;
    ingresarAplicacion = h.ingresarAplicacion;
    parseValorNumerico = h.parseValorNumerico;
    seleccionarOpcion = h.seleccionarOpcion;
    selectorOpcion = h.selectorOpcion;
};

const CODIGO_TX = '01QA';
const PRODUCTO = '010203';
const CAMPO_VALOR_UNITARIO = '#txtDocumento_Detalle_ValorUnitario_cursor_1';
const CAMPO_CANTIDAD = '#txtDocumento_Detalle_Cantidad_cursor_1';

const PRECIO_CANTIDAD_1 = 5000;
const PRECIO_CANTIDAD_2 = 200;
const PRECIO_CANTIDAD_3 = 300;

const filtroTransaccion = Selector('#gridTransacciones .dx-texteditor-input');
const btnEditarTransaccion = Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1);

async function filtrarTransaccion(t, codigo) {
    await t
        .click(filtroTransaccion)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroTransaccion, codigo)
        .wait(2000);
}

async function configurarPrecioSegunCantidad(t, config) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirMaestros(t, es360 ? 'Transacciones' : 'TRANSACCIONES');
    await filtrarTransaccion(t, CODIGO_TX);
    await t
        .expect(Selector('#gridTransacciones td').withText(CODIGO_TX).exists)
        .ok(`No se encontró la transacción ${CODIGO_TX}`)
        .click(btnEditarTransaccion)
        .wait(2000)
        .click(Selector('#TxtTransaccion_Precio_Unitario div').withText('Precio producto sugerido'))
        .click(Selector('#TxtTransaccion_Origen_Precio_Unitario div').withText('Segun Cantidad'))
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);
    await cerrarPestana(t);
}

async function crearDocumentoConTx(t, config) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirMovimiento(t, es360 ? 'Documentos' : 'DOCUMENTOS');
    await t.click(Selector('#ListagridDocumentos .dx-button-content').nth(1));
    await abrirTransaccion(t, CODIGO_TX);
    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(3500);
}

async function ingresarProducto(t) {
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .wait(2000);
}

async function expectValorUnitario(t, esperado, contexto) {
    const valor = await parseValorNumerico(CAMPO_VALOR_UNITARIO);
    await t
        .expect(valor)
        .eql(esperado, `Valor unitario incorrecto ${contexto}. Obtenido: ${valor}, esperado: ${esperado}`);
}

async function cambiarCantidadYValidarPrecio(t, cantidad, precioEsperado) {
    await t
        .click(CAMPO_CANTIDAD)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(CAMPO_CANTIDAD, cantidad)
        .pressKey('enter')
        .wait(2000);
    await expectValorUnitario(t, precioEsperado, `con cantidad ${cantidad}`);
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);

    await configurarPrecioSegunCantidad(t, config);
    await crearDocumentoConTx(t, config);
    await ingresarProducto(t);

    await expectValorUnitario(t, PRECIO_CANTIDAD_1, 'al ingresar el producto');
    await cambiarCantidadYValidarPrecio(t, '1', PRECIO_CANTIDAD_1);
    await cambiarCantidadYValidarPrecio(t, '2', PRECIO_CANTIDAD_2);
    await cambiarCantidadYValidarPrecio(t, '3', PRECIO_CANTIDAD_3);

    await eliminarDocumento(t);
    await cerrarPestana(t);
    await cerrarSesion(t);
}

fixture `INC104 Precio Segun Unidad - Test Happgi`
    .page(testHappgiAdminConfig.pagina);

test('INC104 Precio Segun Unidad - Test Happgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `INC104 Precio Segun Unidad - Test Hgi360`
    .page(testAdminConfig.pagina);

test('INC104 Precio Segun Unidad - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
