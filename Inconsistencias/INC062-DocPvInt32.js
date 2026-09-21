import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360PosConfig } from '../../ParametrosPruebas/Hgi360Pos8888.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimientoPos;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimientoPos;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config, transaccion) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimientoPos(t, esHgi360(config) ? 'Punto de Venta' : 'PUNTO DE VENTA');
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
    await cerrarSesion(t);
}

fixture `Prueba INC062 testERP`
    .page(testPosConfig.pagina);

test('Prueba INC062 VALOR INT32', async t => {
    await ejecutarPrueba(t, testPosConfig, '0101 - PRUEBA FACTURA PV');
});

fixture `Prueba INC062 miErp`
    .page(hgi360PosConfig.pagina);

test('Prueba INC062 Campos para busqueda con F4 Hgi360', async t => {
    await ejecutarPrueba(t, hgi360PosConfig, '01PV - PRUEBA FACTURA PV');
});

fixture `Prueba INC062 testhappgi`
    .page(testHappgiPosConfig.pagina);

test('Prueba INC062 Campos para busqueda con F4 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig, '01PV - PRUEBA FACTURA PV');
});
