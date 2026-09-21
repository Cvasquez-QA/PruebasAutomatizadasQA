import { Selector } from 'testcafe';
import { filtrarPor } from '../../Funciones/HelpersGenerales.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
const TX_CARTERA = '0101Doc';
const TX_CARTERA_TEXTO = '0101Doc - PRUEBA FACTURA DE VENTA';
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

const ingresarModulo = async t => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
};

const cerrarPestana = async t => {
    await t
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close');
};

const abrirMaestro = async (t, nombreMaestro) => {
    await t
        .click(Selector('a').withText('Maestros'))
        .click(Selector('span').withText(nombreMaestro))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

const abrirDocumentos = async t => {
    await t
        .click(Selector('a').withText('Movimientos'))
        .click(Selector('span').withText('DOCUMENTOS'))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

const abrirReporteCartera = async t => {
    await t
        .click(Selector('a').withText('Reportes'))
        .click(Selector('span').withText('CARTERA'))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
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

const crearDocumentoCartera = async t => {
    await abrirDocumentos(t);

    await t
        .click(Selector('#ListagridDocumentos .dx-button-content').nth(1))
        .click('#Documento_Transaccion .dx-lookup-field');
        
        await filtrarPor(t, TX_CARTERA);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TX_CARTERA_TEXTO))
        .click('#Documento_Tercero .dx-lookup-field');
        
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

const eliminarDocumento = async (t, numeroDocumento) => {
    await abrirDocumentos(t);

    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');
        
        await filtrarPor(t, TX_CARTERA);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TX_CARTERA_TEXTO))
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

test('INC094 Reporte cartera Neto vs documento', async t => {
    await ingresarModulo(t);
    await configurarTransaccionCarteraNeto(t);

    const { numeroDocumento, valorNeto, valorTotal } = await crearDocumentoCartera(t);

    await validarReporteCarteraNeto(t, numeroDocumento, valorNeto, valorTotal);
    await eliminarDocumento(t, numeroDocumento);

    await t
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

test('INC094 Reporte cartera Total vs documento', async t => {
    await ingresarModulo(t);
    await configurarTransaccionCartera(t);

    const { numeroDocumento, valorNeto, valorTotal } = await crearDocumentoCartera(t);

    await validarReporteCarteraNeto(t, numeroDocumento, valorNeto, valorTotal);
    await eliminarDocumento(t, numeroDocumento);

    await t
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

