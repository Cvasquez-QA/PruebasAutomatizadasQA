import { ClientFunction, Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { eliminarDocumentoActual360, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

const btnPago = Selector('#BtnPago, #BtnPago_btn, #BtnPagoDocumento, #BtnPagoDocumento_btn').filterVisible();
const confirmar = Selector('button.swal2-confirm').filterVisible();

/** Ids de los botones visibles de la barra del documento (para el mensaje de error). */
const botonesVisibles = ClientFunction(() => Array.from(document.querySelectorAll('[id^="Btn"]'))
    .filter(function (nodo) { return nodo.getClientRects().length; })
    .map(function (nodo) { return nodo.id; })
    .join(', '));

/** Si la transacción exige dependencia, elige la primera de la lista. */
async function elegirPrimeraDependencia(t) {
    const lista = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    // Versión actual: la dependencia es un campo con lupa que ya trae "0 - General" por defecto
    if (!await Selector('#Documento_Dependencia .dx-lookup-field').exists) {
        return;
    }
    await t.click('#Documento_Dependencia .dx-lookup-field');
    if (await lista.with({ timeout: 8000 }).exists) {
        await t.click(lista.nth(0));
    } else {
        await t.pressKey('esc');
    }
}

/**
 * TX 0101: el botón Pago solo debe estar disponible con el documento guardado y, con total 0, debe avisar
 * "El total del documento no puede ser cero (0).".
 */
async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion360(t, config);
    await nuevoDocumento360(t, '0101', /^\s*0101 -/);
    const pagoAntes = await btnPago.exists && !await btnPago.hasClass('dx-state-disabled');
    await elegirPrimeraDependencia(t);
    await guardarDocumento360(t);
    try {
        await t.expect(pagoAntes).notOk('El botón de PAGO está habilitado antes de guardar el documento');
        if (!await btnPago.with({ timeout: 5000 }).exists) {
            await t.expect(false).ok(`No aparece el botón de PAGO con el documento guardado. Botones: ${await botonesVisibles()}`);
        }
        await t
            .expect(btnPago.hasClass('dx-state-disabled')).notOk('El botón de PAGO está inhabilitado con el documento guardado')
            .click(btnPago)
            .expect(Selector('.swal2-popup, .erp-toast').filterVisible().withText('El total del documento no puede ser cero (0).').with({ timeout: 10000 }).exists)
            .ok('No salió el mensaje "El total del documento no puede ser cero (0)."');
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await t.pressKey('esc');
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config, filtroTx) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, filtroTx);
    await t
        .click('#BtnNuevoDocumento')
        .expect(Selector('#Documento_ModalValidacionDIAN h5').withText('Validación Tercero').visible).ok('No está saliendo el control del tercero')
        .click(Selector('#Documento_ModalValidacionDIAN_BtnCancelar span').withText('Cancelar'))
        .wait(2000)
        .expect(Selector('#BtnPago').visible).notOk('El botón de PAGO está habilitado')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('#BtnPago').visible).ok('El botón de PAGO está INhabilitado')
        .wait(2000)
        .click(Selector('#BtnPago'))
        .expect(Selector('.swal2-content div').withText('El total del documento no puede ser cero (0).').visible).ok('no salió el mensaje genérico')
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC074 mensaje control botón Pago Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC074 mensaje control botón Pago Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba INC074 mensaje control botón Pago Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC074 mensaje control botón Pago Happgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig, '01PV');
});
