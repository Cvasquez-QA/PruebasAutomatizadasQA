import { ingresarAplicacion, cerrarPestana360, cerrarSesion360 } from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    venderEnPuntoDeVenta360,
    abrirMovimientosDeCaja360,
    asegurarCajaAbierta360,
    leerEstadoCaja360,
    CAJA_PV
} from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Punto de Venta enviado a la DIAN vs. Movimientos de Caja (test.hgi360.com, AutPos, caja 10).
// ATENCIÓN: esta prueba FINALIZA la factura (0101 - PRUEBA FACTURA PV) y se envía a la DIAN.
// 1) Lee Efectivo en Caja y las ventas de la caja (si está cerrada, la abre con 1 x 10.000).
// 2) Punto de Venta: 010203 x 1, pago en efectivo por el total y finaliza sin imprimir.
// 3) Valida en Movimientos de Caja que Efectivo en Caja subió en el valor de la venta y que
//    la pestaña Ventas tiene un documento nuevo por ese valor.

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    await abrirMovimientosDeCaja360(t, CAJA_PV);
    await asegurarCajaAbierta360(t);
    const antes = await leerEstadoCaja360(t);
    await cerrarPestana360(t);

    const valorVenta = await venderEnPuntoDeVenta360(t);
    await t.expect(valorVenta).gt(0, 'La venta quedó en 0');

    await abrirMovimientosDeCaja360(t, CAJA_PV);
    const despues = await leerEstadoCaja360(t);
    const nuevas = despues.ventas.filter(v => !antes.ventas.some(a => a.transaccion === v.transaccion && a.documento === v.documento));
    await t
        .expect(despues.efectivoCaja).eql(antes.efectivoCaja + valorVenta,
            `Efectivo en Caja debería ser ${antes.efectivoCaja} + ${valorVenta} y es ${despues.efectivoCaja}`)
        .expect(nuevas.length).eql(1, `Se esperaba 1 venta nueva en la caja y hay ${nuevas.length}`)
        .expect(nuevas[0] && nuevas[0].valor).eql(valorVenta, 'El valor de la venta en la caja no coincide con el documento');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimientos de Caja - Venta enviada a la DIAN - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Venta finalizada se refleja en Movimientos de Caja - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
