import {
    ingresarAplicacion,
    cerrarSesion360
} from '../../../Funciones/HelpersHgi360Web.js';
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
    CAJA_PV,
    TX_PV_FILTRO,
    TX_PV,
    PRODUCTO_PV
} from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Punto de Venta (test.hgi360.com, AutPos): caja 10, transacción 0101.
// 1) Guarda el encabezado y agrega el producto 010203 x 1 (la línea se habilita al guardar).
// 2) Pago: forma de pago 1 - Efectivo con Valor = total; valida Total a pagar = total del documento,
//    Recibido = total y Cambio = 0.
// 3) Cancela el pago (no se finaliza ni se envía nada a la DIAN).
// 4) Intenta eliminar el temporal y valida el aviso "No se puede eliminar el documento porque tiene pagos".
// 5) Elimina el pago y luego el documento temporal (el total queda en 0).
// Pasos revisados en el navegador el 21-oct-2026.

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirPuntoDeVenta360(t, CAJA_PV);
    await elegirTransaccionPV(t, TX_PV_FILTRO, TX_PV);

    // El documento temporal puede traer líneas de una prueba anterior: se valida la diferencia
    const totalInicial = await leerTotalPV();
    const totalDocumento = await agregarProductoPV(t, PRODUCTO_PV, '1');
    await t.expect(totalDocumento).gt(totalInicial, 'El total no aumentó al agregar el producto');

    // Pago en efectivo por el total
    const pago = await registrarPagoEfectivoPV(t);
    await t
        .expect(pago.total).eql(totalDocumento, `El total a pagar (${pago.total}) no coincide con el total del documento (${totalDocumento})`)
        .expect(pago.recibido).eql(pago.total, `Lo recibido (${pago.recibido}) no es igual al total a pagar (${pago.total})`)
        .expect(pago.cambio).eql(0, `El cambio debería quedar en 0 y quedó en ${pago.cambio}`);
    await cancelarPagoPV(t);

    // Con pagos no se puede eliminar el temporal
    await validarNoEliminaConPagosPV(t);

    // Limpieza: primero el pago y luego el documento temporal
    await eliminarPagosPV(t);
    await cancelarPagoPV(t);
    await eliminarTemporalPV(t);

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Punto de Venta testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Punto de venta Temporal - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
