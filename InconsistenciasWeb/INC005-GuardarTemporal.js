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
 * INC05 - Guardar temporal del Punto de Venta (test.hgi360.com, POS).
 * Después de guardar el encabezado del temporal se debe poder grabar una línea de producto.
 * Al final elimina el documento temporal.
 */

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC05-GuardarTemporal', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);

    try {
        await agregarProductoPV(t, '010203', '1');
    } finally {
        await eliminarTemporalPV(t).catch(() => undefined);
    }

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
