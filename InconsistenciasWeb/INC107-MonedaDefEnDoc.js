import { Selector } from 'testcafe';
import {
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    editarTransaccion360,
    elegirEnLookup360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta
} from '../Funciones/HelpersHgi360Web.js';
import { nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC107 - Con moneda por defecto DOLAR en la TX 01FE (pestaña Pedidos) y "Maneja moneda" marcado, un documento nuevo
 * trae DOLAR en Ubicación. Al final se restauran la moneda y el check originales de la TX. No se guarda ningún documento.
 */

const TX = ['01FE', /^\s*01FE -/i];
const MONEDA = 'DOLAR';
const LOOKUP_MONEDA = '#TxtTransaccion_StrMonedaDocAux';
const CHECK_MONEDA = '#TxtTransaccion_Doc_ManejaMoneda';
const confirmar = Selector('button.swal2-confirm').filterVisible();

async function configurarTransaccion(t, moneda, manejaMoneda) {
    await editarTransaccion360(t, TX[0], 'Pedidos');
    const anterior = (await Selector(`${LOOKUP_MONEDA} .dx-lookup-field`).innerText).replace(/\s+/g, ' ').trim();
    if (moneda) {
        await elegirEnLookup360(t, LOOKUP_MONEDA, moneda);
    } else {
        const limpiar = Selector(`${LOOKUP_MONEDA} .dx-clear-button-area`);
        if (await limpiar.exists) {
            await t.click(limpiar);
        }
    }
    await t.click('#tabs_documento_Documentos').wait(1000);
    const manejabaMoneda = await Selector(CHECK_MONEDA).getAttribute('aria-checked') === 'true';
    if (manejaMoneda) {
        await marcarCheckboxSiNoEsta(t, CHECK_MONEDA);
    } else {
        await desmarcarCheckboxSiEsta(t, CHECK_MONEDA);
    }
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);
    return { moneda: /^(Seleccione|Select)/i.test(anterior) ? '' : anterior, manejaMoneda: manejabaMoneda };
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const original = await configurarTransaccion(t, MONEDA, true);
    let monedaDocumento = '';
    try {
        await nuevoDocumento360(t, TX[0], TX[1]);
        await t.click('#tabs_documento_Ubicacion').wait(1500);
        monedaDocumento = (await Selector('#Documento_Moneda').innerText).replace(/\s+/g, ' ').trim();
        await cerrarPestana360(t);
        if (await confirmar.with({ timeout: 2000 }).exists) {
            await t.click(confirmar);
        }
    } finally {
        await configurarTransaccion(t, original.moneda, original.manejaMoneda);
    }
    await t.expect(monedaDocumento).contains(MONEDA,
        `La moneda del documento ("${monedaDocumento}") no coincide con la moneda por defecto de la transacción (${MONEDA})`);
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
