import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirMovimientos360,
    abrirTransaccion,
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    eliminarDocumento,
    ingresarAplicacion,
    marcarCheckboxSiNoEsta,
    parseValorNumerico,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const TX = '01QA';
const PRODUCTO = '01';
const IMPUESTO2 = 5000;

const inputImpuesto2 = Selector('#txtDocumento_Detalle_VrImpuesto2_cursor_1');
const btnEditarDetalle = Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]');
const btnEditarTransaccion = Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1);
const chkCuentaPagar = '#TxtTransaccion_Cartera_CuentaPagar';

const crearDocumentoConImpuesto2 = async t => {
    await abrirMovimientos360(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, TX);

    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .doubleClick(inputImpuesto2)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(inputImpuesto2, String(IMPUESTO2))
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(2000)
        .click(btnEditarDetalle);
};

const configurarCuentaPagarTransaccion = async (t, activar) => {
    await abrirMaestros360(t, 'Transacciones');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX).exists).ok(
            `No se encontrÃ³ la transacciÃ³n ${TX}`
        )
        .click(btnEditarTransaccion)
        .click('#tabs_documento_Cartera');

    if (activar) {
        await marcarCheckboxSiNoEsta(t, chkCuentaPagar);
    } else {
        await desmarcarCheckboxSiEsta(t, chkCuentaPagar);
    }

    await t
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana360(t);
};

const validarImpuesto2NoSeConserva = async t => {
    await crearDocumentoConImpuesto2(t);

    const impuesto2 = await parseValorNumerico(inputImpuesto2);
    await t.expect(impuesto2).notEql(
        IMPUESTO2,
        `Se esperaba que el Impuesto 2 no se conserve en ${IMPUESTO2}, obtuvo ${impuesto2}`
    );

    await eliminarDocumento(t);
    await cerrarPestana360(t);
};

const validarImpuesto2SeConserva = async t => {
    await crearDocumentoConImpuesto2(t);

    const impuesto2 = await parseValorNumerico(inputImpuesto2);
    await t.expect(impuesto2).eql(
        IMPUESTO2,
        `Se esperaba conservar Impuesto 2 = ${IMPUESTO2}, obtuvo ${impuesto2}`
    );

    await eliminarDocumento(t);
    await cerrarPestana360(t);
};

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);

    // Estado inicial (sin Cuenta por Pagar): el Impuesto 2 no se conserva
    await validarImpuesto2NoSeConserva(t);

    // Activa Cuenta por Pagar en la TX
    
    await configurarCuentaPagarTransaccion(t, true);

    // Con Cuenta por Pagar: el Impuesto 2 sÃ­ se conserva
    
    await validarImpuesto2SeConserva(t);

    // Restaura la TX (quita Cuenta por Pagar)
    
    await configurarCuentaPagarTransaccion(t, false);

    await cerrarSesion360(t);
};

fixture `INC113 Impuesto 2 detalle - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC113 Impuesto 2 detalle - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC113 Impuesto 2 detalle - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC113 Impuesto 2 detalle - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
