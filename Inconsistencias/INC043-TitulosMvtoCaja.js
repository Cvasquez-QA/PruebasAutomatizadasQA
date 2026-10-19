import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let seleccionarOpcion = HelpersHappgi.seleccionarOpcion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimientoPos = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    seleccionarOpcion = h.seleccionarOpcion;
};

const PRODUCTO = '01';
const CANTIDAD_PRODUCTOS = 4;

async function abrirPuntoDeVenta(t, config) {
    await abrirMovimientoPos(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000);
}

async function agregarProducto(t, producto = PRODUCTO) {
    await t
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', producto)
        .wait(1500)
        .pressKey('enter')
        .click(Selector('.dx-icon.dx-icon-check'))
        .wait(4000);
}

async function ejecutarPrueba(t, config, opciones = {}) {
    const { transaccion, validarVisible = true } = opciones;
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirPuntoDeVenta(t, config);

    await t
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field');
    await seleccionarOpcion(t, transaccion);
    await t
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#PuntoDeVenta_Tercero div'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'hgi')
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000);

    for (let i = 0; i < CANTIDAD_PRODUCTOS; i += 1) {
        await agregarProducto(t);
    }

    const barraDesplazamiento = Selector('#PuntoDeVenta_GridProductosConsulta .dx-scrollable-scroll-content').nth(1);
    await t
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .wait(2000);

    if (validarVisible) {
        await t.expect(barraDesplazamiento.visible).ok('No se encontró la barra de desplazamiento vertical');
    } else {
        await t.expect(barraDesplazamiento.exists).ok('No se encontró la barra de desplazamiento vertical');
    }

    await t
        .wait(3000)
        .switchToMainWindow()
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000);
    await cerrarSesion(t);
}

fixture `INC043 Titulos Mvto Caja - Test Hgi360 Pos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC043 Titulos Mvto Caja - Test Hgi360 Pos', async t => {
    await ejecutarPrueba(t, testPosConfig, {
        transaccion: '0101 - PRUEBA FACTURA PV',
        validarVisible: true,
    });
});

fixture `INC043 Titulos Mvto Caja - Test Happgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC043 Titulos Mvto Caja - Test Happgi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig, {
        transaccion: '01PV - PRUEBA FACTURA PV',
        validarVisible: true,
    });
});

fixture `INC043 Titulos Mvto Caja - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC043 Titulos Mvto Caja - Hgi360 Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig, {
        transaccion: '01PV - PRUEBA FACTURA PVQA',
        validarVisible: false,
    });
});
