import { Selector } from 'testcafe';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { testHappgiPosConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC19 - Consecutivo mayor que int32 (2147483648): Documentos (TX 25) y Punto de Venta deben mostrar
 * "El número de documento supera el valor permitido". No guarda nada.
 * test.hgi360.com usa el ERP React; la prueba de Happgi se dejó como estaba (no se migra).
 */

const MENSAJE = 'El número de documento supera el valor permitido';
const NUMERO = '2147483648';
const mensajeVisible = Selector('.erp-toast, .swal2-popup').filterVisible().withText(MENSAJE);

fixture `Prueba int32 testERP`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Consecutivo int32 CRUD', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await nuevoDocumento360(t, '25', '25 - VALIDACION CAMPOS');
    await t
        .typeText('#txtDocumento .dx-texteditor-input', NUMERO, { replace: true })
        .pressKey('enter')
        .expect(mensajeVisible.with({ timeout: 10000 }).exists).ok(`Documentos no mostró "${MENSAJE}"`);
    await cerrarPestana360(t);

    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await t
        .typeText('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input', NUMERO, { replace: true })
        .pressKey('enter')
        .expect(mensajeVisible.with({ timeout: 10000 }).exists).ok(`El Punto de Venta no mostró "${MENSAJE}"`)
        .click(Selector('button.swal2-confirm').filterVisible());
    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});

async function aceptarCierreCajaSiAparece(t) {
    if (await Selector('.swal2-content div').withText('Desea cerrar la operación de esta caja?').exists) {
        await t.click(Selector('button').withText('Aceptar').nth(1));
    }
}

fixture `Prueba int32 testhappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Consecutivo int32 testhappgi', async t => {
    const config = testHappgiPosConfig;
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, '25');
    await t
        .click('#txtDocumento')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtDocumento'), NUMERO)
        .pressKey('enter')
        .expect(Selector('div').withText(MENSAJE).nth(2).exists).ok('El mensaje es diferente o no se muestra')
        .switchToMainWindow();
    await HelpersHappgi.cerrarPestana(t);
    await HelpersHappgi.abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('.dx-list-item').withText(config.caja))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'));
    await aceptarCierreCajaSiAparece(t);
    await t
        .wait(3000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .wait(3000)
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '01')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('01PV - FACTURA DE VENTA ELECTRÓNICA PV').nth(8))
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtPuntoDeVenta_DocumentoNew'), NUMERO)
        .wait(4000)
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('.dx-toast-content.dx-toast-error').exists).ok('El mensaje es diferente o no se muestra')
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen'))
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
});
