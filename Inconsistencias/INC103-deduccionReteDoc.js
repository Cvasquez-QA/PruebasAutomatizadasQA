import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let eliminarDocumento = HelpersHappgi.eliminarDocumento;
let filtrarPor = HelpersHappgi.filtrarPor;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let selectorOpcion = HelpersHappgi.selectorOpcion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarPestana = es360 && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    eliminarDocumento = h.eliminarDocumento;
    filtrarPor = h.filtrarPor;
    abrirTransaccion = h.abrirTransaccion;
    ingresarAplicacion = h.ingresarAplicacion;
    selectorOpcion = h.selectorOpcion;
};
import { testHappgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_TRANSACCION = '01QA';
const PRODUCTO = '01';
const CANTIDAD = '1';
const VALOR_UNITARIO = '252000';
const TERCERO_FILTRO = 'hgi';
const TERCERO = '811021438';

const campoNeto = '#txtDocumento_Neto .dx-texteditor-input';
const campoTotal = '#txtDocumento_Total .dx-texteditor-input';
const SELECTORES_RET_ICA = [
    '#txtDocumento_RetIca .dx-texteditor-input',
    '#txtDocumento_ReteIca .dx-texteditor-input',
    '#txtDocumento_RetencionIca .dx-texteditor-input',
];

/** Convierte montos tipo "2.100,84", "2.100,8400", "2100" o "$ 1.234,56" a número. */
const parseMonto = valor => {
    const limpio = String(valor ?? '').replace(/[$\s]/g, '').trim();
    if (!limpio) return 0;

    const negativo = limpio.startsWith('-');
    let numero = limpio.replace(/^-/, '');

    if (numero.includes(',')) {
        const [parteEntera, parteDecimal = '0'] = numero.split(',');
        numero = `${parteEntera.replace(/\./g, '')}.${parteDecimal}`;
    } else {
        numero = numero.replace(/\./g, '');
    }

    const parseado = parseFloat(numero);
    if (Number.isNaN(parseado)) return 0;
    return negativo ? -parseado : parseado;
};

const redondear2 = valor => Math.round(valor * 100) / 100;

const leerMontoCampo = async selector => {
    const elemento = Selector(selector);
    const valor = await elemento.value;
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        return parseMonto(valor);
    }
    return parseMonto(await elemento.innerText);
};

async function leerRetIca() {
    for (const selector of SELECTORES_RET_ICA) {
        if (await Selector(selector).filterVisible().exists) {
            return {
                encontrado: true,
                valor: await leerMontoCampo(selector),
            };
        }
    }

    const porEtiqueta = Selector('label, span, div')
        .withText(/Ret\s*Ica/i)
        .parent()
        .find('.dx-texteditor-input')
        .filterVisible()
        .nth(0);

    if (await porEtiqueta.exists) {
        const valor = await porEtiqueta.value;
        return {
            encontrado: true,
            valor: parseMonto(valor || await porEtiqueta.innerText),
        };
    }

    return { encontrado: false, valor: null };
}

async function crearDocumentoConProducto(t) {
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, CODIGO_TRANSACCION);
    await t.click('#Documento_Tercero .dx-lookup-field');

    await filtrarPor(t, TERCERO_FILTRO);
    await t
        .wait(2000)
        .click(selectorOpcion(TERCERO))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', CANTIDAD)
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', VALOR_UNITARIO)
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'Documentos');
    await crearDocumentoConProducto(t);

    const valorNeto = await leerMontoCampo(campoNeto);
    const valorTotal = await leerMontoCampo(campoTotal);
    const { encontrado, valor: valorRetIca } = await leerRetIca();

    const diferencia = redondear2(Math.abs(valorNeto - valorTotal));
    const retIca = redondear2(valorRetIca);

    await t
        .expect(encontrado).ok('No se encontró el campo Ret Ica en los totales del documento')
        .expect(diferencia)
        .eql(
            retIca,
            `|Neto (${valorNeto}) - Total (${valorTotal})| = ${diferencia}, pero Ret Ica es ${retIca}`
        );
    await eliminarDocumento(t);
    await cerrarPestana(t);
    await cerrarSesion(t);
}

fixture `INC103 Deduccion Rete Doc - Test Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC103 Deduccion Rete Doc - Test Happgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `INC103 Deduccion Rete Doc - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC103 Deduccion Rete Doc - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
