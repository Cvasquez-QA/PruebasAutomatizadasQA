import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';

/**
 * INC08 - Encabezado al cambiar de transacción en el Punto de Venta (test.hgi360.com, POS).
 * Al pasar de la 0101 a otra transacción, el encabezado debe cambiar (deja de verse la referencia
 * de compañía "General General").
 */

const TX_SEGUNDA_FILTRO = '0102';
const TX_SEGUNDA = '0102 - Factura de Venta No Electronica';

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC08-IndiceEncabezadoTx', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await elegirTransaccionPV(t, TX_SEGUNDA_FILTRO, TX_SEGUNDA);

    await t.expect(Selector('#PuntoDeVenta_Tercero_RefCia').filterVisible().withText('General General').exists)
        .notOk('No se cambian los encabezados al cambiarse de transacción', { timeout: 5000 });

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
