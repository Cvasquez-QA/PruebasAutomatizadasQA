import { Selector } from 'testcafe';
import { abrirMovimientos360, cerrarPestana360, cerrarSesion360, filtrarPor, ingresarAplicacion, limpiarCacheChromeTestCafe, TERCERO } from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig, hgiPosConfig, testAdminConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC109 - Consulta de Documentos: con el filtro de tercero aplicado, al pulsar Nuevo y volver con Atrás
 * el filtro de tercero se conserva. No se guarda nada.
 */

const filtroTercero = Selector('#Documento_Consulta_Tercero, #Filtro_Documento_Tercero').filterVisible();

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 })
        .expect(filtroTercero.with({ timeout: 20000 }).exists).ok('La consulta de Documentos no tiene filtro de tercero')
        .click(filtroTercero.find('.dx-lookup-field, .dx-dropdowneditor-input-wrapper').nth(0));
    await filtrarPor(t, TERCERO);
    await t
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(new RegExp(`^\\s*${TERCERO} -`)).with({ timeout: 10000 }))
        .click(Selector('#ButtonConsultar_btn, #ButtonConsultar').filterVisible().nth(0))
        .wait(3000)
        .click(Selector('#BtnNuevoDocumento_btn, #BtnNuevoDocumento').filterVisible().nth(0))
        .expect(Selector('#Documento_Transaccion').with({ timeout: 15000 }).visible).ok('No abrió el documento nuevo')
        .click(Selector('#BtnAtrasDocumento_btn, #BtnAtrasDocumento').filterVisible().nth(0))
        .wait(2000);
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 2000 }).exists) {
        await t.click(confirmar);
    }
    await t.expect(filtroTercero.withText(TERCERO).with({ timeout: 10000 }).exists)
        .ok(`El filtro de tercero no conservó "${TERCERO}" al volver atrás`);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `INC109 Filtro consulta documentos - Test Hgi360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Test Hgi360 Pos', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});

fixture `INC109 Filtro consulta documentos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Hgi360 Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});

fixture `INC109 Filtro consulta documentos - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC109 Filtro consulta documentos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC109 Filtro consulta documentos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
