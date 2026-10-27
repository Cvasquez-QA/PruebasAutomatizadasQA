import { Selector } from 'testcafe';
import { abrirMovimientos360, cerrarPestana360, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { hgiPosConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const CAJA = '10 - Caja Automatizacion';
const MENSAJE_CAJA_OCUPADA = 'La caja se encuentra en operación por:';

/** Si el PV avisa caja ocupada, acepta; si está abierto, sale. */
const cerrarOAceptarPuntoDeVenta = async t => {
    await t.wait(2000);

    const mensajeCajaOcupada = Selector('.swal2-popup').filterVisible().withText(/La caja se encuentra en operaci[oó]n por/);
    const btnSalir = Selector('#PuntoDeVenta_BtnSalir_btn, #PuntoDeVenta_BtnSalir').filterVisible();

    // Versión actual: el PV abre primero el modal "Ingreso al punto de venta" para elegir la caja
    const ingresoPV = Selector('.dx-overlay-content, .modal-content').filterVisible().withText(/Ingreso al punto de venta/i);

    if (await mensajeCajaOcupada.with({ timeout: 3000 }).exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible()).wait(1000);
    } else if (await ingresoPV.with({ timeout: 3000 }).exists) {
        await t.click(ingresoPV.find('.dx-button, button').withText(/^\s*Cancelar\s*$/).nth(0)).wait(1500);
    } else if (await btnSalir.with({ timeout: 3000 }).exists) {
        await t.click(btnSalir.nth(0)).wait(2000);
    }

};

async function ejecutarPrueba(t, config) {
    const caja = config.caja || CAJA;

    await ingresarAplicacion(t, config);

    // Abrir Punto de Venta y liberar / aceptar aviso de caja
    await abrirMovimientos360(t, 'Punto de Venta');
    await cerrarOAceptarPuntoDeVenta(t);

    try {
        await cerrarPestana360(t);
    } catch (e) {
        // Si ya no hay pestaña abierta, continuar
    }

    // Movimientos de Caja: seleccionar la única caja del usuario
    await abrirMovimientos360(t, 'Movimientos de Caja');

    await t.click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field');
    const opcionCaja = Selector('.dx-overlay-content .dx-list-item').filterVisible().withText(caja);
    if (await opcionCaja.with({ timeout: 5000 }).exists) {
        await t.click(opcionCaja.nth(0)).wait(2000);
    } else {
        await seleccionarOpcion(t, caja);
    }

    await t
        .expect(Selector('#PnlGridMovimientosCaja h2, .movimientos-de-caja-estado').filterVisible().withText(/Detalle de caja/i).with({ timeout: 15000 }).exists).ok(
            `No se mostró el detalle de caja para "${caja}"`
        );

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `INC108 Usuario con una caja - Test Hgi360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC108 Usuario con una caja - Test Hgi360 Pos', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});

fixture `INC108 Usuario con una caja - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC108 Usuario con una caja - Hgi360 Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
