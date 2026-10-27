import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    TERCERO
} from '../Funciones/HelpersHgi360Web.js';
import { eliminarDocumentoActual360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC112 - Control del plazo (máximo 32767 días): el documento 01FE no se guarda con plazo 32768 y el maestro de
 * terceros limita el plazo a 32767. El plazo del tercero se restaura al valor original.
 */

const PLAZO_MAXIMO = '32767';
const PLAZO_EXCEDENTE = '32768';
const PLAZO_EXCESIVO = '99999999999';
const MSG_PLAZO_DOCUMENTO = /El plazo no puede ser mayor a 32767 d[ií]as/;

const inputPlazoDocumento = Selector('#txtDocumento_Plazo .dx-texteditor-input');
const inputPlazoTercero = Selector('#txtTercero_Plazo .dx-texteditor-input');
const numeroDocumento = Selector('#txtDocumento .dx-texteditor-input');

async function escribir(t, input, valor) {
    await t
        .click(input)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(input, valor)
        .pressKey('tab')
        .wait(800);
}

async function validarPlazoDocumento(t) {
    await nuevoDocumento360(t, '01FE', /^\s*01FE -/i);
    await t.expect(inputPlazoDocumento.with({ timeout: 10000 }).exists).ok('El documento 01FE no muestra el campo Plazo');
    await escribir(t, inputPlazoDocumento, PLAZO_EXCEDENTE);
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible());
    const aviso = Selector('.erp-toast, .swal2-popup, .erp-form-error__text').filterVisible().withText(MSG_PLAZO_DOCUMENTO);
    const avisado = await aviso.with({ timeout: 10000 }).exists;
    await t.wait(2000);
    const numero = await numeroDocumento.value;
    if (numero) {
        await eliminarDocumentoActual360(t);
    }
    await cerrarPestana360(t);
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 2000 }).exists) {
        await t.click(confirmar);
    }
    await t.expect(avisado).ok(`No se mostró "El plazo no puede ser mayor a 32767 días"${numero ? ` (se guardó el documento ${numero}, se eliminó)` : ''}`);
}

async function validarPlazoTercero(t) {
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await buscarEnGrid360(t, 'gridTerceros', TERCERO);
    await t.wait(1500);
    await accionFilaGrid360(t, 'gridTerceros', TERCERO, 'Editar');
    // Versión actual: el plazo está en la pestaña "Condiciones comerciales"
    const condiciones = Selector('.dx-tab, [role="tab"]').filterVisible().withText(/Condiciones comerciales/i);
    if (await condiciones.with({ timeout: 15000 }).exists) {
        await t.click(condiciones.nth(0)).wait(1500);
    }
    await t.expect(inputPlazoTercero.with({ timeout: 15000 }).exists).ok('El tercero no muestra el campo Plazo (#txtTercero_Plazo)');
    const original = await inputPlazoTercero.value;
    await escribir(t, inputPlazoTercero, PLAZO_EXCEDENTE);
    const conExcedente = await inputPlazoTercero.value;
    await escribir(t, inputPlazoTercero, PLAZO_EXCESIVO);
    const conExcesivo = await inputPlazoTercero.value;
    await escribir(t, inputPlazoTercero, original || '0');
    await guardarMaestro360(t, 'Tercero');
    await cerrarPestana360(t);
    await t
        .expect(conExcedente.replace(/\D/g, '')).eql(PLAZO_MAXIMO, `El plazo del tercero con ${PLAZO_EXCEDENTE} quedó en ${conExcedente}`)
        .expect(conExcesivo.replace(/\D/g, '')).eql(PLAZO_MAXIMO, `El plazo del tercero con ${PLAZO_EXCESIVO} quedó en ${conExcesivo}`);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    let errorDocumento = null;
    try {
        await validarPlazoDocumento(t);
    } catch (e) {
        errorDocumento = e;
    }
    await validarPlazoTercero(t);
    if (errorDocumento) {
        throw errorDocumento;
    }
    await cerrarSesion360(t);
}

fixture `INC112 Control plazo - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC112 Control plazo - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC112 Control plazo - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC112 Control plazo - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
