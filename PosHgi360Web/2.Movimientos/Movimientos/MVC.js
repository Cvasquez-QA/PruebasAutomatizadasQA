import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    abrirMovimientosDeCaja360,
    leerMovimientoCaja360,
    venderEnPuntoDeVenta360,
    CAJA_PV
} from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos de Caja (test.hgi360.com, AutPos, caja 10):
// 1) Saldo = Base + Ventas - Retiros
// 2) Se hace una venta en el Punto de Venta (transacción 0101, producto 010203)
// 3) El saldo de la caja aumenta en el valor del documento
const TOLERANCIA = 1; // redondeo de decimales en el grid

async function ejecutarPruebaMovimientoCaja(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientosDeCaja360(t, CAJA_PV);

    const antes = await leerMovimientoCaja360(t);
    await t
        .expect(Math.abs(antes.saldo - (antes.base + antes.ventas - antes.retiros)))
        .lte(TOLERANCIA, `El saldo no es Base + Ventas - Retiros (${JSON.stringify(antes.texto)})`);
    await cerrarPestana360(t);

    const valorDocumento = await venderEnPuntoDeVenta360(t, { caja: CAJA_PV });

    await abrirMovimientosDeCaja360(t, CAJA_PV);
    const despues = await leerMovimientoCaja360(t);
    await t
        .expect(Math.abs(despues.saldo - (antes.saldo + valorDocumento)))
        .lte(TOLERANCIA, `El saldo debería aumentar en ${valorDocumento} (antes ${antes.saldo}, después ${despues.saldo})`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimiento de Caja testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba valores luego de un documento testerp - Test Hgi360', async t => {
    await ejecutarPruebaMovimientoCaja(t, testPosWebConfig);
});
