import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirMovimientos360,
    abrirTransaccion,
    cerrarPestana360,
    cerrarSesion360,
    marcarCheckboxSiNoEsta,
    ingresarAplicacion,
    seleccionarOpcion,
    TX_DOCUMENTO,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/** Moneda por defecto configurada en la transacciÃ³n (pestaÃ±a Pedidos) */
const MONEDA = 'DOLAR';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    // Configurar moneda por defecto en la transacciÃ³n
    await abrirMaestros360(t, 'Transacciones');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX_DOCUMENTO)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX_DOCUMENTO.toUpperCase()).exists).ok(
            `No se encontrÃ³ la transacciÃ³n ${TX_DOCUMENTO}`
        )
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .click('#tabs_documento_Pedidos')
        .click('#TxtTransaccion_StrMonedaDocAux .dx-lookup-field');

    await seleccionarOpcion(t, MONEDA);

    await t.click('#tabs_documento_Documentos');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Doc_ManejaMoneda');

    await t
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);

    await cerrarPestana360(t);

    // Validar que el documento trae la moneda por defecto en UbicaciÃ³n
    await abrirMovimientos360(t, 'Documentos');

    await t.click(Selector('#ListagridDocumentos .dx-button-content').nth(1));
    await abrirTransaccion(t, TX_DOCUMENTO);

    await t
        .click('#tabs_documento_Ubicacion')
        .expect(Selector('#Documento_Moneda div').withText(MONEDA).nth(1).visible).ok(
            `La moneda del documento no coincide con la moneda por defecto de la transacciÃ³n (${MONEDA})`
        );
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `INC107 Moneda defecto en documento - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC107 Moneda defecto en documento - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC107 Moneda defecto en documento - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC107 Moneda defecto en documento - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
