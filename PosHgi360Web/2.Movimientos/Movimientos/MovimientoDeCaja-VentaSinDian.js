import { ingresarAplicacion, cerrarPestana360, cerrarSesion360 } from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    abrirPuntoDeVenta360,
    elegirTransaccionPV,
    agregarProductoPV,
    leerTotalPV,
    registrarPagoEfectivoPV,
    cancelarPagoPV,
    validarNoEliminaConPagosPV,
    eliminarPagosPV,
    eliminarTemporalPV,
    salirPuntoDeVenta360,
    abrirMovimientosDeCaja360,
    asegurarCajaAbierta360,
    leerEstadoCaja360,
    CAJA_PV,
    TX_PV_FILTRO,
    TX_PV,
    PRODUCTO_PV
} from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Punto de Venta sin enviar a la DIAN vs. Movimientos de Caja (test.hgi360.com, AutPos, caja 10).
// 1) Lee Efectivo en Caja y las ventas de la caja (si está cerrada, la abre con 1 x 10.000).
// 2) Punto de Venta: agrega 010203 x 1, registra el pago en efectivo por el total y CANCELA el pago
//    (el documento queda temporal, no se finaliza ni se envía a la DIAN).
// 3) Antes de eliminar el temporal: valida en Movimientos de Caja que Efectivo en Caja y las ventas no cambiaron.
// 4) Valida el aviso "no se puede eliminar porque tiene pagos", elimina el pago y luego el temporal.

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    // 1) Estado inicial de la caja
    await abrirMovimientosDeCaja360(t, CAJA_PV);
    await asegurarCajaAbierta360(t);
    const antes = await leerEstadoCaja360(t);
    await cerrarPestana360(t);

    // 2) Venta con pago cancelado (temporal)
    await abrirPuntoDeVenta360(t, CAJA_PV);
    await elegirTransaccionPV(t, TX_PV_FILTRO, TX_PV);
    const totalInicial = await leerTotalPV();
    const totalDocumento = await agregarProductoPV(t, PRODUCTO_PV, '1');
    await t.expect(totalDocumento).gt(totalInicial, 'El total no aumentó al agregar el producto');
    const pago = await registrarPagoEfectivoPV(t);
    await t
        .expect(pago.total).eql(totalDocumento, `El total a pagar (${pago.total}) no coincide con el total del documento (${totalDocumento})`)
        .expect(pago.cambio).eql(0, `El cambio debería quedar en 0 y quedó en ${pago.cambio}`);
    await cancelarPagoPV(t);
    await salirPuntoDeVenta360(t);

    // 3) La venta temporal no debe verse en la caja
    await abrirMovimientosDeCaja360(t, CAJA_PV);
    const despues = await leerEstadoCaja360(t);
    await t
        .expect(despues.efectivoCaja).eql(antes.efectivoCaja,
            `Efectivo en Caja cambió con un documento sin finalizar (${antes.efectivoCaja} -> ${despues.efectivoCaja})`)
        .expect(despues.ventas.length).eql(antes.ventas.length,
            `Aparecieron ventas nuevas en la caja con un documento sin finalizar (${antes.ventas.length} -> ${despues.ventas.length})`);
    await cerrarPestana360(t);

    // 4) Limpieza del temporal
    await abrirPuntoDeVenta360(t, CAJA_PV);
    await elegirTransaccionPV(t, TX_PV_FILTRO, TX_PV);
    await t.expect(await leerTotalPV()).eql(totalDocumento, 'El documento temporal no conservó el total');
    await validarNoEliminaConPagosPV(t);
    await eliminarPagosPV(t);
    await cancelarPagoPV(t);
    await eliminarTemporalPV(t);
    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimientos de Caja - Venta sin enviar a la DIAN - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Venta temporal no se refleja en Movimientos de Caja - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
