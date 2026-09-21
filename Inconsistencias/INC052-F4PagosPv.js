import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360PosConfig } from '../../ParametrosPruebas/Hgi360Pos8888.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';
import { offPosConfig } from '../../ParametrosPruebas/OffPos8906.js';

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

async function ingresarAplicacionOffline(t, config) {
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(1500)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
}

async function validarF4Pagos(t, config) {
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click(Selector('#BtnPuntoDeVenta_Movimientos div').withText('Movimientos'))
        .click(Selector('[title="Movimientos Pagos"] div i'))
        .click('#txtDocumento_Pago_Transaccion_1 .dx-icon.dx-icon-search')
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Transaccion button').withText('X'))
        .click(Selector('#txtDocumento_Pago_TipoCartera_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_TipoCartera button').withText('X'))
        .click(Selector('#txtDocumento_Pago_Concepto_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Conceptos button').withText('X'))
        .click(Selector('#txtDocumento_Pago_Naturaleza_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Naturalezas button').withText('X'))
        .click(Selector('#txtDocPago_Banco_FormaPago_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_FormaPagos button').withText('X'))
        .click(Selector('#txtDocPago_Banco_Banco_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Bancos button').withText('X'))
        .click(Selector('#txtDocPago_Banco_Naturaleza_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Naturalezas button').withText('X'))
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('[title="Cerrar"] .dx-icon.dx-icon-close'))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
}

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    await ingresar(t, config);
    await abrirMovimientoPos(t, esHgi360(config) ? 'Punto de Venta' : 'PUNTO DE VENTA');
    await validarF4Pagos(t, config);
    await cerrarSesion(t);
}

fixture `Prueba INC052 testERP`
    .page(testPosConfig.pagina);

test('Prueba INC052 Campos para busqueda con F4 testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba INC052 miErp`
    .page(hgi360PosConfig.pagina);

test('Prueba INC052 Campos para busqueda con F4 Hgi360', async t => {
    await ejecutarPrueba(t, hgi360PosConfig);
});

fixture `Prueba INC052 offline`
    .page(offPosConfig.pagina);

test('Prueba INC052 Campos para busqueda con F4 offline', async t => {
    await ejecutarPrueba(t, offPosConfig, ingresarAplicacionOffline);
});

fixture `Prueba INC052 testhappgi`
    .page(testHappgiPosConfig.pagina);

test('Prueba INC052 Campos para busqueda con F4 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
