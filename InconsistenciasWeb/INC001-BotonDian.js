import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    abrirPuntoDeVenta360,
    agregarProductoPV,
    cancelarPagoPV,
    elegirTransaccionPV,
    eliminarPagosPV,
    eliminarTemporalPV,
    leerPagoPV,
    limpiarTemporalPV,
    registrarPagoEfectivoPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';

/**
 * INC01 - Botón DIAN del Punto de Venta (test.hgi360.com, POS).
 * Con el pago registrado pero el documento sin finalizar, y con el pago incompleto,
 * el botón DIAN no debe quedar habilitado. Al final borra los pagos y el documento temporal.
 */

// El id #PuntoDeVenta_BtnDian queda en un contenedor sin estado; el estado está en el botón con el data-testid
const btnDian = Selector('[data-testid="PuntoDeVenta_BtnDian"]').filterVisible();

async function validarDianDeshabilitado(t, mensaje) {
    await t.expect(btnDian.with({ timeout: 10000 }).exists).ok('No se ve el botón DIAN del Punto de Venta');
    const deshabilitado = await btnDian.getAttribute('aria-disabled') === 'true' || await btnDian.hasClass('dx-state-disabled');
    await t.expect(deshabilitado).ok(mensaje);
}

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC01-BotonDian', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    await agregarProductoPV(t, '010203', '1');

    try {
        // Pago completo registrado, pero sin finalizar el documento
        await registrarPagoEfectivoPV(t);
        await cancelarPagoPV(t);
        await validarDianDeshabilitado(t, 'El botón DIAN está habilitado con el pago registrado pero sin finalizar el documento');

        // Pago incompleto
        await eliminarPagosPV(t);
        const { total } = await leerPagoPV();
        await registrarPagoEfectivoPV(t, Math.floor(total / 2));
        await cancelarPagoPV(t);
        await validarDianDeshabilitado(t, 'El botón DIAN está habilitado con el documento pagado de forma incompleta');
    } finally {
        // Un error en la limpieza no debe tapar el fallo original de la prueba
        await eliminarPagosPV(t).catch(() => undefined);
        await cancelarPagoPV(t).catch(() => undefined);
        await eliminarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
