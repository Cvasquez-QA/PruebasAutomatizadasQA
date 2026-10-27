import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';

/**
 * INC04 - Transacción nueva en el Punto de Venta (test.hgi360.com, POS).
 * Con el documento en blanco, Nuevo + Guardar debe mostrar las observaciones del documento.
 */

const btnGuardar = Selector('#PuntoDeVenta_BtnGuardarDocumento').filterVisible();

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC04-TxNueva', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);

    if (await btnGuardar.hasAttribute('aria-disabled')) {
        await t.expect(btnGuardar.getAttribute('aria-disabled')).eql('false', 'El botón GUARDAR está deshabilitado con el documento en blanco');
    }
    await t
        .click(Selector('#PuntoDeVenta_BtnNuevoDocumento').filterVisible())
        .click(btnGuardar)
        .expect(Selector('.dx-overlay-content, .modal').filterVisible().withText('Observaciones del Documento').with({ timeout: 10000 }).exists)
        .ok('No salió el mensaje emergente con las observaciones del documento')
        .pressKey('esc');

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
