import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    iframeTab,
    ingresarAplicacion,
    seleccionarOpcion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { hgiPosConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const CAJA = '10 - Caja Automatizacion';
const MENSAJE_CAJA_OCUPADA = 'La caja se encuentra en operaciÃ³n por:';

/** Si el PV avisa caja ocupada, acepta; si estÃ¡ abierto, sale. */
const cerrarOAceptarPuntoDeVenta = async t => {
    await t.switchToIframe(iframeTab).wait(2000);

    const mensajeCajaOcupada = Selector('.swal2-content div').withText(MENSAJE_CAJA_OCUPADA);
    const btnSalir = Selector('#PuntoDeVenta_BtnSalir span').withText('Salir');

    if (await mensajeCajaOcupada.with({ timeout: 3000 }).exists) {
        await t.click(Selector('button').withText('Aceptar')).wait(1000);
    } else if (await btnSalir.with({ timeout: 3000 }).exists) {
        await t.click(btnSalir).wait(2000);
    }

    await t.switchToMainWindow();
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
        // Si ya no hay pestaÃ±a abierta, continuar
    }

    // Movimientos de Caja: seleccionar la Ãºnica caja del usuario
    await abrirMovimientos360(t, 'Movimientos de Caja');

    await t.click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field');
    await seleccionarOpcion(t, caja);

    await t
        .expect(Selector('#PnlGridMovimientosCaja h2').withText('Detalle de caja').visible).ok(
            `No se mostrÃ³ el detalle de caja para "${caja}"`
        );

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `INC108 Usuario con una caja - Test Hgi360 Pos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC108 Usuario con una caja - Test Hgi360 Pos', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `INC108 Usuario con una caja - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC108 Usuario con una caja - Hgi360 Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
