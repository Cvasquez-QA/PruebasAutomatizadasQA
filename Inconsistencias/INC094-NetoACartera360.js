import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    abrirMaestros360,
    abrirMovimientos360,
    abrirReportes360,
    abrirTransaccion,
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    filtrarPor,
    ingresarAplicacion,
    marcarCheckboxSiNoEsta,
    marcarRadioSiNoEsta,
    parseTextoNumerico,
    parseValorNumerico,
    seleccionarOpcion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const TX_CARTERA = 'INC094';
const TERCERO_TEXTO = '811021438 - HGI S.A.S';
const DEPENDENCIA = '0 - General';
const PRODUCTO = '01';
const PLANTILLA_CARTERA = 'Cartera X Edades';

const configurarParametrosCarteraCuotas = async t => {
    await abrirHerramientas360(t, 'Parámetros');

    await t
        .click('#tabs_parametrosAdmin_Cartera')
        .click(Selector('#BtnEditar span').withText('Editar'))
        .wait(2000);

    await marcarRadioSiNoEsta(t, '#TxtParametrosGenerales_CarteraFormaCxC', 1);
    await marcarRadioSiNoEsta(t, '#TxtParametrosGenerales_CarteraFormaCxP', 1);

    await t
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .wait(4000)
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);

    await cerrarPestana360(t);
};

const configurarParametrosCarteraGeneral = async t => {
    await abrirHerramientas360(t, 'Parámetros');

    await t
        .click('#tabs_parametrosAdmin_Cartera')
        .click(Selector('#BtnEditar span').withText('Editar'))
        .wait(2000);

    await marcarRadioSiNoEsta(t, '#TxtParametrosGenerales_CarteraFormaCxC', 0);
    await marcarRadioSiNoEsta(t, '#TxtParametrosGenerales_CarteraFormaCxP', 0);

    await t
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .wait(4000)
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
    await cerrarPestana360(t);
};

/**
 * Configura la pestaña Cartera de la transacción.
 * tipo: 'CxC' | 'CxP'
 * forma: 'General' | 'Cuotas'
 * valor: 'Neto' | 'Total'
 */
const configurarTransaccionCartera = async (t, { tipo, forma, valor }) => {
    await abrirMaestros360(t, 'Transacciones');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX_CARTERA)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX_CARTERA).exists).ok(
            `No se encontró la transacción ${TX_CARTERA}`
        )
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#tabs_documento_Cartera');

    if (tipo === 'CxC') {
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');
    } else {
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');
    }

    if (forma === 'Cuotas') {
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    } else {
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    }

    await t
        .click(Selector('#TxtTransaccion_Cartera_TotalNeto div').withText(valor).nth(2))
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana360(t);
};

const crearDocumentoCartera = async t => {
    await abrirMovimientos360(t, 'Documentos');

    await t.click(Selector('#ListagridDocumentos .dx-button-content').nth(1));
    await abrirTransaccion(t, TX_CARTERA);
    await t.click('#Documento_Tercero .dx-lookup-field');

    await filtrarPor(t, 'hgi');
    await t.wait(2000);
    await seleccionarOpcion(t, TERCERO_TEXTO);

    await t.doubleClick('#Documento_Buscar_Dependencia .dx-icon.dx-icon-search')
    await t.click(Selector('[data-bind="dxControlsDescendantBindings: true"] td').withText('0'))
    await t.click(Selector('#btnSeleccionarDependencias_documentos span').withText('Seleccionar'))
    await t
        .wait(2000)
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

    await cerrarPestana360(t);

    return { numeroDocumento, valorNeto, valorTotal };
};

const aplicarFiltroReporteCxP = async t => {
    await t
        .click(Selector('.dx-item.dx-accordion-item.dx-accordion-item-closed div').withText('Filtros de Búsqueda'))
        .click(Selector('[class^="dx-filterbuilder-action-icon dx-icon-remove dx-fil"]'))
        .click(Selector('[class^="dx-filterbuilder-action-icon dx-icon-plus dx-filte"]'))
        .click(Selector('div').withText('Transaccion').nth(16))
        .click(Selector('[data-item-id="CxP"] div div span'))
        .doubleClick(Selector('.dx-filterbuilder-text.dx-filterbuilder-item-value div').withText('<rellene con un valor>'))
        .click(Selector('.dx-item.dx-list-item').withText('1 - Es CxP'));
};

/**
 * Valida el valor del reporte Cartera X Edades contra Neto o Total.
 * esCxP: aplica filtro de búsqueda CxP antes de generar.
 */
const validarReporteCartera = async (t, { numeroDocumento, valorNeto, valorTotal, valorEsperado, esCxP = false }) => {
    const esperado = valorEsperado === 'Neto' ? valorNeto : valorTotal;
    const otro = valorEsperado === 'Neto' ? valorTotal : valorNeto;
    const errorIgualOtro = valorEsperado === 'Neto'
        ? `ERROR_IGUAL_TOTAL: el reporte es igual al total; se esperaba el neto (${valorNeto})`
        : `ERROR_IGUAL_NETO: el reporte es igual al neto; se esperaba el total (${valorTotal})`;

    await abrirReportes360(t, 'Cartera');

    await t.click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'));
    await seleccionarOpcion(t, PLANTILLA_CARTERA);

    if (esCxP) {
        await aplicarFiltroReporteCxP(t);
    }

    await t
        .click(Selector('span').withText('Generar'))
        .wait(5000)
        .typeText(Selector('.dx-texteditor-input').nth(4), numeroDocumento)
        .wait(3000)
        .click(Selector('.dx-datagrid-group-closed'));

    const valorReporte = parseTextoNumerico(
        await Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines"]').find('td').nth(6).innerText
    );

    if (valorReporte === esperado) {
        await t.expect(valorReporte).eql(esperado, `El valor del reporte coincide con el ${valorEsperado.toLowerCase()}`);
    } else if (valorReporte === otro) {
        await t.expect(valorReporte).eql(esperado, `${errorIgualOtro} (reporte=${valorReporte})`);
    } else {
        await t.expect(valorReporte).eql(
            esperado,
            `ERROR_VALOR_DIFERENTE: el reporte (${valorReporte}) no coincide con ${valorEsperado.toLowerCase()} (${esperado}) ni con el otro valor (${otro})`
        );
    }

    await cerrarPestana360(t);
};

const eliminarDocumentoCartera = async (t, numeroDocumento) => {
    await abrirMovimientos360(t, 'Documentos');

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

const ejecutarEscenario = async (t, config, { tipo, forma, valor }) => {
    await ingresarAplicacion(t, config);

    if (forma === 'Cuotas') {
        await configurarParametrosCarteraCuotas(t);
    } else {
        await configurarParametrosCarteraGeneral(t);
    }
    await configurarTransaccionCartera(t, { tipo, forma, valor });
    const { numeroDocumento, valorNeto, valorTotal } = await crearDocumentoCartera(t);
    await validarReporteCartera(t, {
        numeroDocumento,
        valorNeto,
        valorTotal,
        valorEsperado: valor,
        esCxP: tipo === 'CxP',
    });
    await eliminarDocumentoCartera(t, numeroDocumento);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
};

// ---------------------------------------------------------------------------
// Test Hgi360 Admin ejecución en cascada (un test tras otro)
// ---------------------------------------------------------------------------
fixture `INC094 Reporte cartera vs documento - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC094 Reporte cartera CxC General vs documento Neto - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxC', forma: 'General', valor: 'Neto' });
});

test('INC094 Reporte cartera CxC Cuotas vs documento Neto - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxC', forma: 'Cuotas', valor: 'Neto' });
});

test('INC094 Reporte cartera CxC General vs documento Total - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxC', forma: 'General', valor: 'Total' });
});

test('INC094 Reporte cartera CxC Cuotas vs documento Total - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxC', forma: 'Cuotas', valor: 'Total' });
});

test('INC094 Reporte cartera CxP General vs documento Neto - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxP', forma: 'General', valor: 'Neto' });
});

test('INC094 Reporte cartera CxP Cuotas vs documento Neto - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxP', forma: 'Cuotas', valor: 'Neto' });
});

test('INC094 Reporte cartera CxP General vs documento Total - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxP', forma: 'General', valor: 'Total' });
});

test('INC094 Reporte cartera CxP Cuotas vs documento Total - Test Hgi360 Admin', async t => {
    await ejecutarEscenario(t, testAdminConfig, { tipo: 'CxP', forma: 'Cuotas', valor: 'Total' });
});

// ---------------------------------------------------------------------------
    // Hgi360 Admin ejecución en cascada (un test tras otro)
// ---------------------------------------------------------------------------
fixture `INC094 Reporte cartera vs documento - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC094 Reporte cartera CxC General vs documento Neto - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxC', forma: 'General', valor: 'Neto' });
});

test('INC094 Reporte cartera CxC Cuotas vs documento Neto - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxC', forma: 'Cuotas', valor: 'Neto' });
});

test('INC094 Reporte cartera CxC General vs documento Total - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxC', forma: 'General', valor: 'Total' });
});

test('INC094 Reporte cartera CxC Cuotas vs documento Total - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxC', forma: 'Cuotas', valor: 'Total' });
});

test('INC094 Reporte cartera CxP General vs documento Neto - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxP', forma: 'General', valor: 'Neto' });
});

test('INC094 Reporte cartera CxP Cuotas vs documento Neto - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxP', forma: 'Cuotas', valor: 'Neto' });
});

test('INC094 Reporte cartera CxP General vs documento Total - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxP', forma: 'General', valor: 'Total' });
});

test('INC094 Reporte cartera CxP Cuotas vs documento Total - Hgi360 Admin', async t => {
    await ejecutarEscenario(t, hgiAdminConfig, { tipo: 'CxP', forma: 'Cuotas', valor: 'Total' });
});
 