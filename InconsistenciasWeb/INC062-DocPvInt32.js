import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { hgiPosConfig, testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * En el Punto de Venta el número de documento acepta el valor 2147483646 (dentro de Int32) sin el aviso
 * "supera el valor permitido" ni errores; después se sale del Punto de Venta.
 */
async function ejecutarPrueba360(t, config, filtroTx, transaccion) {
    const numero = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input, input#txtPuntoDeVenta_DocumentoNew').filterVisible().nth(0);
    const aviso = Selector('.swal2-popup, .erp-toast[data-type="error"]').filterVisible();
    await ingresarAplicacion360(t, config);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t, filtroTx, transaccion);
    await t
        .click(numero)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(numero, '2147483646')
        .pressKey('enter')
        .wait(3000);
    const texto = await aviso.exists ? (await aviso.innerText).replace(/\s+/g, ' ').trim() : '';
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }
    await t.expect(texto).notMatch(/supera el valor permitido|error|excepci[oó]n|Referencia a objeto/i, `Con 2147483646 salió: ${texto}`);
    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config, transaccion) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Punto de Venta');
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(transaccion))
        .click('#txtPuntoDeVenta_DocumentoNew')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPuntoDeVenta_DocumentoNew', '2147483646')
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC062 - Test Hgi360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC062 VALOR INT32 - Test Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, testPosWebConfig, '0101', '0101 - PRUEBA FACTURA PV');
});

fixture `Prueba INC062 Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC062 VALOR INT32 Hgi360', async t => {
    await ejecutarPrueba360(t, hgiPosConfig, '01PV', '01PV - PRUEBA FACTURA PV');
});

fixture `Prueba INC062 testhappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC062 VALOR INT32 testhappgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig, '01PV - PRUEBA FACTURA PV');
});
