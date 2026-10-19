import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
const PRODUCTO = '010204';
const TX_VENTA = '0101Doc';
const TX_COMPRA = '05qa';
const TERCERO = '811021438';
const TERCERO_TEXTO = '811021438 - HGI S.A.S - HGI S.A.S';

const PV_CAJA = testPosConfig.caja;
const PV_TX_CON_IVA = '0101 - PRUEBA FACTURA PV';
const PV_TX_SIN_IVA = '0101.2 - PRUEBA FACTURA PV';
const CELDA_IVA_DETALLE_PV = Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(13).find('td').nth(11);

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
let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let selectorOpcion = HelpersHappgi.selectorOpcion;

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
    abrirMovimientoPos = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    selectorOpcion = h.selectorOpcion;
};

const ingresarModulo = async (t, config) => {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
};

const abrirMaestro = async (t, nombreMaestro, config) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    const map = { PRODUCTOS: 'Productos', TRANSACCIONES: 'Transacciones' };
    await abrirMaestros(t, es360 ? (map[nombreMaestro] || nombreMaestro) : nombreMaestro);
};

const abrirDocumentos = async (t, config) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirMovimiento(t, 'Documentos');
};

const marcarCheckboxSiNoEsta = async (t, selectorCheckbox) => {
    const checkbox = Selector(selectorCheckbox);
    const marcado = await checkbox.getAttribute('aria-checked');

    if (marcado !== 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

const desmarcarCheckboxSiEsta = async (t, selectorCheckbox) => {
    const checkbox = Selector(selectorCheckbox);
    const marcado = await checkbox.getAttribute('aria-checked');

    if (marcado === 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

const filtrarTransaccion = async (t, codigoTransaccion) => {
    await t
        .click('#gridTransacciones .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#gridTransacciones .dx-texteditor-input', codigoTransaccion)
        .wait(2000);
};

const editarTransaccionFiltrada = async t => {
    await t.click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1));
};

const guardarTransaccion = async t => {
    await t.click(Selector('#BtnGuardarTransaccion span').withText('Guardar')).wait(2000);
};

const seleccionarTransaccionDocumento = async (t, codigo) => {
    await abrirTransaccion(t, codigo);
};

const seleccionarTerceroDocumento = async t => {
    await t
        .click('#Documento_Tercero .dx-lookup-field')
;
        
        await filtrarPor(t, TERCERO);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TERCERO_TEXTO));
};

const agregarDetalleDocumento = async (t, { cantidad = '1', valorUnitario = null } = {}) => {
    await t
        .doubleClick('#txtDocumento_Detalle_Producto_cursor_1')
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .doubleClick('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', cantidad);

    if (valorUnitario !== null) {
        await t
            .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', valorUnitario);
    }

    await t
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000);
};

const eliminarDocumentoActual = async t => {
    await t
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(5000);
};

const abrirPuntoDeVenta = async (t, config) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirMovimientoPos(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(PV_CAJA))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(4000);
};

const agregarDetallePv = async t => {
    await t
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click('#txtPuntoDeVenta_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000);
};

const obtenerIvaDetallePv = async () => {
    const valor = await CELDA_IVA_DETALLE_PV.innerText;

    return parseInt(valor.replace(/\./g, '').replace(/,/g, ''), 10) || 0;
};

const guardarDocumentoPv = async t => {
    await t.click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar')).wait(2000);
};

const seleccionarTransaccionPv = async (t, textoTransaccion) => {
    await t
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(textoTransaccion));
};

const eliminarDocumentoPv = async t => {
    await t
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(4000);
};

const cerrarSesionPos = async t => {
    await t
        .click('#PuntoDeVenta_BtnSalir .dx-icon.fas.fa-sign-out-alt')
        .switchToMainWindow();
    await cerrarSesion(t);
};

fixture `INC093 Iva Monofasico Admin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

    test('INC093 Iva Monofasico', async t => {
        await ingresarModulo(t, testAdminConfig);
    
        await abrirMaestro(t, 'Productos', testAdminConfig);
        await t
            .typeText('#gridProductos .dx-texteditor-input', PRODUCTO)
            .wait(2000)
            .click(Selector('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1));
    
        await marcarCheckboxSiNoEsta(t, '#txtMaestroProductos_IvaMonofasico');
    
        await t.click(Selector('#BtnGuardarProducto span').withText('Guardar')).wait(2000);
        await cerrarPestana(t);
    
        await abrirMaestro(t, 'Transacciones', testAdminConfig);
    
        await filtrarTransaccion(t, TX_VENTA);
        await editarTransaccionFiltrada(t);
        await t.click('#tabs_documento_Documentos');
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Tribu_Iva_Monofasico');
        await guardarTransaccion(t);
    
        await filtrarTransaccion(t, TX_COMPRA);
        await editarTransaccionFiltrada(t);
        await t.click('#tabs_documento_Documentos');
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Tribu_Iva_Monofasico');
        await guardarTransaccion(t);
    
        await cerrarPestana(t);
        await abrirDocumentos(t, testAdminConfig);
    
        await t
            .click('#ListagridDocumentos .dx-icon.dx-icon-add')
            .pressKey('enter');
    
        await seleccionarTransaccionDocumento(t, TX_COMPRA);
        await seleccionarTerceroDocumento(t);
        await t.click(Selector('#BtnGuardarDocumento span').withText('Guardar')).wait(2000);
    
        await agregarDetalleDocumento(t, { cantidad: '1', valorUnitario: '100' });
    
        await t.expect(Selector('[title="IVA: 0,00"]').exists).ok('La compra no debe traer IVA');
        await t.expect(parseInt((await Selector('#txtDocumento_Iva .dx-texteditor-input').value).replace(/\./g, '').replace(/,/g, ''), 10) || 0).eql(0, 'El total IVA del documento debe ser 0');
        
    
        await eliminarDocumentoActual(t);
    
        await t.click(Selector('#BtnNuevoDocumento div').withText('Nuevo'));
        await seleccionarTransaccionDocumento(t, TX_VENTA);
        await t
            .click('#Documento_Dependencia .dx-lookup-field')
            .pressKey('down')
            .pressKey('enter')
            .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
            .wait(2000);
    
        await agregarDetalleDocumento(t, { cantidad: '1' });
    
        await t.expect(Selector('[title="IVA: 1000,00"]').exists).ok('La venta debe traer IVA')
        
        //await t.expect(parseInt((await Selector('#txtDocumento_Iva .dx-texteditor-input').value).replace(/\./g, '').replace(/,/g, ''), 10) || 0).eql(1000, 'El total IVA del documento debe ser 1000');
    
        const iva = parseInt(
            (await Selector('#txtDocumento_Iva .dx-texteditor-input').value)
                .split(',')[0]
                .replace(/\./g, ''),
            10
        );
        
        await t.expect(iva).eql(1000, 'El total IVA del documento debe ser 1000');
        
        await eliminarDocumentoActual(t);
    
        await t.switchToMainWindow();
        await cerrarSesion(t);
    });

fixture `INC093 Iva Monofasico Pos HGI360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC093 Iva Monofasico Punto de Venta', async t => {
    await ingresarModulo(t, testPosConfig);
    await abrirPuntoDeVenta(t, testPosConfig);

    await seleccionarTransaccionPv(t, PV_TX_CON_IVA);
    await guardarDocumentoPv(t);
    await agregarDetallePv(t);

    const ivaDetalleConIva = await obtenerIvaDetallePv();
    await t.expect(ivaDetalleConIva).notEql(0, 'La transaccion 0101 debe traer IVA en el detalle');

    await eliminarDocumentoPv(t);

    await t.click(Selector('#PuntoDeVenta_BtnNuevoDocumento span').withText('Nuevo'));
    await seleccionarTransaccionPv(t, PV_TX_SIN_IVA);
    await guardarDocumentoPv(t);
    await agregarDetallePv(t);

    const ivaDetalleSinIva = await obtenerIvaDetallePv();
    await t.expect(ivaDetalleSinIva).eql(0, 'La transaccion 0101.2 no debe traer IVA en el detalle');

    await eliminarDocumentoPv(t);
    await cerrarSesionPos(t);
});
