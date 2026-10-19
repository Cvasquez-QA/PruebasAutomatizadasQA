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
    pagarEfectivoPV,
    salirPuntoDeVenta360,
    CAJA_PV,
    TX_PV_FILTRO,
    TX_PV,
    PRODUCTO_PV
} from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Punto de Venta (test.hgi360.com, AutPos): caja 10, transacción 0101,
// vende el producto 010203, paga en efectivo y finaliza sin imprimir.
// Ojo: la factura queda creada (la transacción es de venta); no se puede borrar desde la prueba.

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirPuntoDeVenta360(t, CAJA_PV);
    await elegirTransaccionPV(t, TX_PV_FILTRO, TX_PV);

    // El documento temporal puede traer líneas de una prueba anterior: se valida la diferencia
    const totalInicial = await leerTotalPV();
    const totalConProducto = await agregarProductoPV(t, PRODUCTO_PV, '1');
    await t.expect(totalConProducto).gt(totalInicial, 'El total no aumentó al vender el producto');

    const valorPagado = await pagarEfectivoPV(t);
    await t.expect(valorPagado).eql(totalConProducto, 'El valor a pagar no coincide con el total del documento');

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
