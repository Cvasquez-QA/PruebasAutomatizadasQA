import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
const TX_CARTERA = '0101Doc';
const TERCERO_TEXTO = '811021438 - HGI S.A.S - HGI S.A.S';
const DEPENDENCIA = '0 - General';
const PRODUCTO = '01';
const PLANTILLA_CARTERA = 'Cartera X Edades';

const castearValorEntero = valor => {
    const parteEntera = String(valor ?? '').split(',')[0].replace(/\./g, '').trim();

    return parseInt(parteEntera, 10) || 0;
};

const parseValorNumerico = async selector => {
    const valor = await Selector(selector).value;

    return castearValorEntero(valor);
};

const parseTextoNumerico = texto => castearValorEntero(texto);

let filtrarPor = HelpersHappgi.filtrarPor;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let abrirMaestros = HelpersHappgi.abrirMaestros;
let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirReportes = HelpersHappgi.abrirReportes;

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
    abrirReportes = es360 ? h.abrirReportes360 : h.abrirReportes;
};

const ingresarModulo = async (t, config = testAdminConfig) => {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
};

const abrirMaestro = async (t, nombreMaestro, config = testAdminConfig) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    const map = { TRANSACCIONES: 'Transacciones', TERCEROS: 'Terceros' };
    await abrirMaestros(t, es360 ? (map[nombreMaestro] || nombreMaestro) : nombreMaestro);
};

const abrirDocumentos = async (t, config = testAdminConfig) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirMovimiento(t, es360 ? 'Documentos' : 'DOCUMENTOS');
};

const abrirReporteCartera = async (t, config = testAdminConfig) => {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirReportes(t, es360 ? 'Cartera' : 'CARTERA');
};

const marcarRadioSiNoEsta = async (t, contenedor, indice = 0) => {
    const radio = Selector(contenedor).find('.dx-radiobutton').nth(indice);
    const marcado = await radio.getAttribute('aria-checked');

    if (marcado !== 'true') {
        await t.click(radio.find('.dx-radiobutton-icon'));
    }
};

const configurarParametrosCarteraNeto = async t => {
    await t
        .click(Selector('a').withText('Herramientas'))
        .click(Selector('a').withText('PARÁMETROS'))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500)
        .click('#tabs_parametrosAdmin_Cartera')
        .click(Selector('#BtnEditar span').withText('Editar'))
        .wait(2000);

    await marcarRadioSiNoEsta(t, '#TxtParametrosGenerales_CarteraFormaCxC', 1);
    await marcarRadioSiNoEsta(t, '#TxtParametrosGenerales_CarteraFormaCxP', 0);

    await t
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);

    await cerrarPestana(t);
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

const configurarTransaccionCarteraNeto = async t => {
    await abrirMaestro(t, 'TRANSACCIONES');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX_CARTERA)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX_CARTERA).exists).ok(
            `No se encontró la transacción ${TX_CARTERA}`
        )
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#tabs_documento_Cartera');

    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');

    await t
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana(t);
};


const configurarTransaccionCarteraTotalCxC = async t => {
    await abrirMaestro(t, 'TRANSACCIONES');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX_CARTERA)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX_CARTERA).exists).ok(
            `No se encontró la transacción ${TX_CARTERA}`
        )
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#tabs_documento_Cartera');

    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');

    await t
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana(t);
};


const configurarTransaccionCarteraCxP = async t => {
    await abrirMaestro(t, 'TRANSACCIONES');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX_CARTERA)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX_CARTERA).exists).ok(
            `No se encontró la transacción ${TX_CARTERA}`
        )
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#tabs_documento_Cartera');

    await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
    await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');

    await t
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana(t);
};



const crearDocumentoCartera = async t => {
    await abrirDocumentos(t);

    await t.click(Selector('#ListagridDocumentos .dx-button-content').nth(1));
    await abrirTransaccion(t, TX_CARTERA);
    await t
        .click('#Documento_Tercero .dx-lookup-field')
;
        
        await filtrarPor(t, 'hgi');
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item').withText(TERCERO_TEXTO))
        .click('#Documento_Dependencia .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(DEPENDENCIA))
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(5000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;

    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000);

    const valorNeto = await parseValorNumerico('#txtDocumento_Neto .dx-texteditor-input');
    const valorTotal = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');

    await cerrarPestana(t);

    return { numeroDocumento, valorNeto, valorTotal };
};

const validarReporteCarteraNeto = async (t, numeroDocumento, valorNeto, valorTotal) => {
    await abrirReporteCartera(t);

    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-item.dx-list-item div').withText(PLANTILLA_CARTERA))
        .click(Selector('span').withText('Generar'))
        .wait(5000)
        .typeText(Selector('.dx-texteditor-input').nth(4), numeroDocumento)
        .wait(3000)
        .click(Selector('.dx-datagrid-group-closed'));

    const valorReporte = parseTextoNumerico(
        await Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines"]').find('td').nth(6).innerText
    );

    if (valorReporte === valorNeto) {
        await t.expect(valorReporte).eql(valorNeto, 'El valor del reporte coincide con el neto');
    } else if (valorReporte === valorTotal) {
        await t.expect(valorReporte).eql(
            valorNeto,
            `ERROR_IGUAL_TOTAL: el reporte (${valorReporte}) es igual al total; se esperaba el neto (${valorNeto})`
        );
    } else {
        await t.expect(valorReporte).eql(
            valorNeto,
            `ERROR_VALOR_DIFERENTE: el reporte (${valorReporte}) no coincide con neto (${valorNeto}) ni total (${valorTotal})`
        );
    }

    await cerrarPestana(t);
};


const validarReporteCarteraTotal = async (t, numeroDocumento, valorNeto, valorTotal) => {
    await abrirReporteCartera(t);

    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-item.dx-list-item div').withText(PLANTILLA_CARTERA))
        .click(Selector('span').withText('Generar'))
        .wait(5000)
        .typeText(Selector('.dx-texteditor-input').nth(4), numeroDocumento)
        .wait(3000)
        .click(Selector('.dx-datagrid-group-closed'));

    const valorReporte = parseTextoNumerico(
        await Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines"]').find('td').nth(6).innerText
    );

    if (valorReporte === valorTotal) {
        await t.expect(valorReporte).eql(valorTotal, 'El valor del reporte coincide con el total');
    } else if (valorReporte === valorNeto) {
        await t.expect(valorReporte).eql(
            valorTotal,
            `ERROR_IGUAL_NETO: el reporte (${valorReporte}) es igual al neto; se esperaba el total (${valorTotal})`
        );
    } else {
        await t.expect(valorReporte).eql(
            valorTotal,
            `ERROR_VALOR_DIFERENTE: el reporte (${valorReporte}) no coincide con total (${valorTotal}) ni neto (${valorNeto})`
        );
    }

    await cerrarPestana(t);
};

const aplicarFiltroReporteCxP = async t => {
    await t
        .click(Selector('.dx-item.dx-accordion-item.dx-accordion-item-closed div').withText('Filtros de Búsqueda'))
        .click(Selector('[class^="dx-filterbuilder-action-icon dx-icon-remove dx-fil"]'))
        .click(Selector('[class^="dx-filterbuilder-action-icon dx-icon-plus dx-filte"]'))
        .click(Selector('div').withText('Transaccion').nth(16))
        .click(Selector('.dx-filterbuilder-item-field div').withText('CxP'))
        .click(Selector('.dx-filterbuilder-text.dx-filterbuilder-item-value div').withText('<rellene con un valor>'))
        .click(Selector('.dx-item.dx-list-item').withText('1 - Es CxP'));
};

const validarReporteCarteraCxP = async (t, numeroDocumento, valorNeto, valorTotal) => {
    await abrirReporteCartera(t);

    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-item.dx-list-item div').withText(PLANTILLA_CARTERA));

    await aplicarFiltroReporteCxP(t);

    await t
        .click(Selector('span').withText('Generar'))
        .wait(5000)
        .typeText(Selector('.dx-texteditor-input').nth(4), numeroDocumento)
        .wait(3000)
        .click(Selector('.dx-datagrid-group-closed'));

    const valorReporte = parseTextoNumerico(
        await Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines"]').find('td').nth(6).innerText
    );

    if (valorReporte === valorTotal) {
        await t.expect(valorReporte).eql(valorTotal, 'El valor del reporte coincide con el total');
    } else if (valorReporte === valorNeto) {
        await t.expect(valorReporte).eql(
            valorTotal,
            `ERROR_IGUAL_NETO: el reporte (${valorReporte}) es igual al neto; se esperaba el total (${valorTotal})`
        );
    } else {
        await t.expect(valorReporte).eql(
            valorTotal,
            `ERROR_VALOR_DIFERENTE: el reporte (${valorReporte}) no coincide con total (${valorTotal}) ni neto (${valorNeto})`
        );
    }

    await cerrarPestana(t);
};

const eliminarDocumento = async (t, numeroDocumento) => {
    await abrirDocumentos(t);

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, TX_CARTERA);
    await t
        .click('#txtDocumento .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento .dx-texteditor-input', numeroDocumento)
        .pressKey('enter')
        .wait(4000)
        .click(Selector('#BtnEliminarDocumento div').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
};

fixture `INC094 Reporte cartera vs documento Admin HGI360`
    .page(testAdminConfig.pagina);

test('INC094 Reporte cartera CxC vs documento Neto', async t => {
    await ingresarModulo(t);
    await configurarParametrosCarteraNeto(t);
    await configurarTransaccionCarteraNeto(t);

    const { numeroDocumento, valorNeto, valorTotal } = await crearDocumentoCartera(t);

    await validarReporteCarteraTotalCxC(t, numeroDocumento, valorNeto, valorTotal);
    await eliminarDocumento(t, numeroDocumento);

    await t.switchToMainWindow();
    await cerrarSesion(t);
});



test('INC094 Reporte cartera CxC vs documento Total', async t => {
    await ingresarModulo(t);
    await configurarParametrosCarteraNeto(t);
    await configurarTransaccionCarteraTotalCxC(t);

    const { numeroDocumento, valorNeto, valorTotal } = await crearDocumentoCartera(t);

    await validarReporteCarteraTotal(t, numeroDocumento, valorNeto, valorTotal);
    await eliminarDocumento(t, numeroDocumento);

    await t.switchToMainWindow();
    await cerrarSesion(t);
});


test('INC094 Reporte cartera CxP vs documento Neto', async t => {
    await ingresarModulo(t);
    await configurarParametrosCarteraNeto(t);
    await configurarTransaccionCarteraCxP(t);

    const { numeroDocumento, valorNeto, valorTotal } = await crearDocumentoCartera(t);

    await validarReporteCarteraCxP(t, numeroDocumento, valorNeto, valorTotal);
    await eliminarDocumento(t, numeroDocumento);

    await t.switchToMainWindow();
    await cerrarSesion(t);
});

