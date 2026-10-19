import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    TERCERO,
    TERCERO_TEXTO,
    TX_DOCUMENTO,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { hgiAdminConfig, hgiPosConfig, testAdminConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * @param {'pos'|'admin'} modulo
 */
async function ejecutarPrueba(t, config, modulo) {
    await ingresarAplicacion(t, config);

    await abrirMovimientos360(t, 'Documentos');

    // Filtro transacciÃ³n
    await t.click('#filtros_Documento_Transaccion .dx-dropdowneditor-icon');
    await filtrarPor(t, TX_DOCUMENTO);
    await t
        .wait(2000)
        .doubleClick(Selector('td').withText(TX_DOCUMENTO.toUpperCase()));

    // Filtro tercero
    await t.click('#Filtro_Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, TERCERO);
    await seleccionarOpcion(t, TERCERO_TEXTO);

    await t
        .click(Selector('#ButtonConsultar div').withText('Consultar'))
        .wait(2000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click(Selector('#BtnAtrasDocumento div').withText('Atras'));

    // El filtro de tercero debe conservarse al volver de crear documento
    await t
        .expect(
            Selector('.dx-lookup-field-wrapper div').withText(TERCERO_TEXTO).visible
        ).ok(
            `El filtro de tercero no conservÃ³ el valor "${TERCERO_TEXTO}" al volver atrÃ¡s`
        );

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `INC109 Filtro consulta documentos - Test Hgi360 Pos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Test Hgi360 Pos', async t => {
    await ejecutarPrueba(t, testPosConfig, 'pos');
});

fixture `INC109 Filtro consulta documentos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Hgi360 Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig, 'pos');
});

fixture `INC109 Filtro consulta documentos - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig, 'admin');
});

fixture `INC109 Filtro consulta documentos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, 'admin');
});
