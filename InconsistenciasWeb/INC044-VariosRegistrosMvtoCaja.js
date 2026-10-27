import { ClientFunction, Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, agregarProductoPV, elegirTransaccionPV, limpiarTemporalPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { hgiPosConfig, testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const PRODUCTOS_360 = ['01', '01', '01', '01'];

/** Alto del contenido y del área visible del grid de productos del Punto de Venta. */
const medirGridProductosPV = ClientFunction(() => {
    const grid = document.querySelector('#PuntoDeVenta_GridProductosConsulta');
    if (!grid) {
        return null;
    }
    const contenedor = grid.querySelector('.dx-datagrid-rowsview .dx-scrollable-container') || grid.querySelector('.dx-scrollable-container');
    const barra = grid.querySelector('.dx-datagrid-rowsview .dx-scrollable-scroll') || grid.querySelector('.dx-scrollable-scroll');
    return {
        contenido: contenedor ? contenedor.scrollHeight : 0,
        visible: contenedor ? contenedor.clientHeight : 0,
        barraOculta: barra ? barra.classList.contains('dx-state-invisible') || getComputedStyle(barra).display === 'none' : true,
        filas: grid.querySelectorAll('tr.dx-data-row').length
    };
});

/**
 * Hgi360 (ERP web): con varias líneas en el Punto de Venta, el grid de productos debe mostrar la barra de
 * desplazamiento vertical (sin pantalla completa). Las líneas se borran con el temporal al final.
 */
async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion360(t, config);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);

    try {
        for (const producto of PRODUCTOS_360) {
            await agregarProductoPV(t, producto, '1');
        }
        const salirPantallaCompleta = Selector('#PuntoDeVenta_BtnSalirFullPantalla').filterVisible();
        if (await salirPantallaCompleta.exists) {
            await t.click(salirPantallaCompleta).wait(2000);
        }
        const medida = await medirGridProductosPV();
        await t
            .expect(medida).ok('No se encontró el grid de productos del Punto de Venta')
            .expect(medida.contenido > medida.visible && !medida.barraOculta)
            .ok(`No se encontró la barra de desplazamiento vertical (filas: ${medida.filas}, alto contenido ${medida.contenido}, alto visible ${medida.visible})`);
    } finally {
        await limpiarTemporalPV(t);
        await salirPuntoDeVenta360(t);
    }
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

const PRODUCTO = '01';
const CANTIDAD_PRODUCTOS = 4;

async function ejecutarPruebaHappgi(t, config, transaccion) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field');
    await HelpersHappgi.seleccionarOpcion(t, transaccion);
    await t
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#PuntoDeVenta_Tercero div'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] div'), 'hgi')
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000);

    for (let i = 0; i < CANTIDAD_PRODUCTOS; i += 1) {
        await t
            .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', PRODUCTO)
            .wait(1500)
            .pressKey('enter')
            .click(Selector('.dx-icon.dx-icon-check'))
            .wait(4000);
    }

    await t
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .wait(2000)
        .expect(Selector('#PuntoDeVenta_GridProductosConsulta .dx-scrollable-scroll-content').nth(1).visible)
        .ok('No se encontró la barra de desplazamiento vertical')
        .wait(3000)
        .switchToMainWindow()
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000);
    await HelpersHappgi.cerrarSesion(t);
}

fixture `INC044 Varios Registros Mvto Caja - Test Hgi360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC044 Varios Registros Mvto Caja - Test Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `INC044 Varios Registros Mvto Caja - Test Happgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('INC044 Varios Registros Mvto Caja - Test Happgi Pos', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig, '01PV - PRUEBA FACTURA PV');
});

fixture `INC044 Varios Registros Mvto Caja - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC044 Varios Registros Mvto Caja - Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});
