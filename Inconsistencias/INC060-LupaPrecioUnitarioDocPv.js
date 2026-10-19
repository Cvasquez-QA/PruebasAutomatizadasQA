import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config, transaccion, validarTerceros = true) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimientoPos(t, 'Punto de Venta');
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(transaccion))
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '01')
        .wait(1500)
        .pressKey('enter')
        .click(Selector('.dx-icon.dx-icon-check'))
        .wait(4000)
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('enter')
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]'))
        .wait(1500)
        .click('#txtPuntoDeVenta_Detalle_ValorUnitario_1 .dx-icon.dx-icon-find')
        .expect(Selector('#moduleContainer div').withText('Seleccione una lista para aplicar el precio').visible).ok('No se deplegó el modal de lista de precios')
        .switchToMainWindow()
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-icon.dx-icon-close'));

    if (validarTerceros) {
        await t
            .click('#txtPuntoDeVenta_Detalle_Tercero_1 .dx-icon.dx-icon-search')
            .expect(Selector('h5').withText('Seleccionar Terceros').visible).ok('No se despliega la modal de terceros')
            .click('#cerrarModal_F4Terceros_PV');
    }

    await t
        .switchToMainWindow()
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla div i'))
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC060 test360 POS`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC060 validar barra desplazamiento detalles PV mipos', async t => {
    await ejecutarPrueba(t, testPosConfig, '0101 - PRUEBA FACTURA PV', true);
});

fixture `Prueba INC060 happgi POS`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC060 validar barra desplazamiento detalles PV HAPPGI', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig, '01PV - PRUEBA FACTURA PV', false);
});
