import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    abrirPuntoDeVenta360,
    agregarProductoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';

/**
 * INC16 - Una transacción que bloquea productos sin kardex (0101NoKdx) debe dejar vender el producto
 * 1014 "Producto Sin Kardex" en el Punto de Venta (test.hgi360.com, POS). El temporal se elimina al final.
 */

const TX_SIN_KARDEX = '0101NoKdx - PRUEBA FACTURA PUNTO DE VENTA';

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC16-TxBloqueoProductoSinKardex.js', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t, 'NoKdx', TX_SIN_KARDEX);
    await limpiarTemporalPV(t);

    try {
        await agregarProductoPV(t, '1014', '1');
        await t.expect(Selector('#PuntoDeVenta_GridProductos td').withText('Producto Sin Kardex').exists)
            .ok('No quedó la línea del "Producto Sin Kardex"', { timeout: 10000 });
    } finally {
        await eliminarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
