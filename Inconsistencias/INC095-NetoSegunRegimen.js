import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
const TERCERO_IVA_FILTRO = '81102143';
const TERCERO_IVA = '811021438';
const TERCERO_IVA_TEXTO = '811021438 - HGI S.A.S - HGI S.A.S';
const TERCERO_SIN_IVA_FILTRO = '71794230';
const TERCERO_SIN_IVA_TEXTO = '71794230 - Tercero Puntos';
const TX_PEDIDOS = '07';
const PRODUCTO = '01';

const parseValorNumerico = async selector => {
    const valor = await Selector(selector).value;

    return parseInt(valor.replace(/\./g, '').replace(/,/g, ''), 10) || 0;
};

let filtrarPor = HelpersHappgi.filtrarPor;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let abrirMaestros = HelpersHappgi.abrirMaestros;
let abrirMovimiento = HelpersHappgi.abrirMovimiento;

const usarHelpersDe = (config) => {
    const h = String(config?.pagina || '').toLowerCase().includes('hgi360') ? HelpersHgi360 : HelpersHappgi;
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    filtrarPor = h.filtrarPor;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = es360 && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    abrirMaestros = es360 ? h.abrirMaestros360 : h.abrirMaestros;
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
};

const ingresarModulo = async (t, config = testAdminConfig) => {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
};

const abrirMaestro = async (t, nombreMaestro, config = testAdminConfig) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    const map = { TERCEROS: 'Terceros', TRANSACCIONES: 'Transacciones' };
    await abrirMaestros(t, es360 ? (map[nombreMaestro] || nombreMaestro) : nombreMaestro);
};

const abrirDocumentos = async (t, config = testAdminConfig) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirMovimiento(t, 'Documentos');
};

const filtrarTercero = async (t, filtro, identificacion) => {
    await t
        .click(Selector('#gridTerceros .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), filtro)
        .wait(2000)
        .expect(Selector('#gridTerceros td').withText(identificacion).exists).ok(
            `No se encontró el tercero ${identificacion}`
        );
};

const configurarRegimenTercero = async (t, regimen) => {
    await t
        .click(Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#tabs_tercero_Tributaria')
        .click(Selector('#txtTercero_Regimen_Ventas .dx-lookup-field'))
        .click(Selector('.dx-item.dx-list-item').withText(regimen));
};

const marcarCheckboxSiNoEsta = async (t, selectorCheckbox) => {
    const checkbox = Selector(selectorCheckbox);
    const marcado = await checkbox.getAttribute('aria-checked');

    if (marcado !== 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

const verificarResponsabilidadesMarcadas = async t => {
    await marcarCheckboxSiNoEsta(t, '#txtTercero_Resp05 ');
    await marcarCheckboxSiNoEsta(t, '#txtTercero_Resp07');
    await marcarCheckboxSiNoEsta(t, '#txtTercero_Resp35');
};

const guardarTercero = async t => {
    await t
        .click(Selector('#BtnGuardarTercero span').withText('Guardar'))
        .wait(2000);
};

const seleccionarTransaccionDocumento = async t => {
    await abrirTransaccion(t, TX_PEDIDOS);
};

const seleccionarTerceroDocumento = async (t, filtro, textoTercero) => {
    await t
        .click('#Documento_Tercero .dx-lookup-field')
;
        
        await filtrarPor(t, filtro);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item').withText(textoTercero));
};

const agregarDetalleDocumento = async t => {
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .doubleClick('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000);
};

const verificarNetoDistintoDeCero = async t => {
    const neto = await parseValorNumerico('#txtDocumento_Neto .dx-texteditor-input');

    await t.expect(neto).notEql(0, 'El neto del documento no debe ser 0');
};

const eliminarDocumentoActual = async t => {
    await t
        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000);
};

fixture `INC095 Neto segun regimen Admin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC095 Neto segun regimen', async t => {
    await ingresarModulo(t);
    await abrirMaestro(t, 'Terceros');

    await filtrarTercero(t, TERCERO_IVA_FILTRO, TERCERO_IVA);
    await configurarRegimenTercero(t, 'Impuesto sobre las ventas - IVA');
    await verificarResponsabilidadesMarcadas(t);
    await guardarTercero(t);

    await filtrarTercero(t, TERCERO_SIN_IVA_FILTRO, TERCERO_SIN_IVA_FILTRO);
    await configurarRegimenTercero(t, 'No responsable de IVA');
    await verificarResponsabilidadesMarcadas(t);
    await guardarTercero(t);

    await cerrarPestana(t);
    await abrirDocumentos(t);

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await seleccionarTransaccionDocumento(t);
    await seleccionarTerceroDocumento(t, 'hgi', TERCERO_IVA_TEXTO);
    await t.click(Selector('#BtnGuardarDocumento div').withText('Guardar')).wait(2000);

    await agregarDetalleDocumento(t);
    await verificarNetoDistintoDeCero(t);
    await eliminarDocumentoActual(t);

    await seleccionarTerceroDocumento(t, 'puntos', TERCERO_SIN_IVA_TEXTO);
    await t.click(Selector('#BtnGuardarDocumento div').withText('Guardar')).wait(2000);

    await agregarDetalleDocumento(t);
    await verificarNetoDistintoDeCero(t);
    await eliminarDocumentoActual(t);

    await t
    //Se cierra sesión
        .switchToMainWindow();
    await cerrarSesion(t);
});
