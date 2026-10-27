import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';

/**
 * INC15 - En el Punto de Venta, al pedir con la flecha abajo un temporal de otro usuario sale
 * "Documento temporal no esta asignado a este usuario" y el documento vuelve al temporal propio
 * (test.hgi360.com, POS, caja 1014 - Caja Camilo).
 */

const documentoNew = Selector('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input');
const aviso = Selector('.swal2-popup').filterVisible();

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC15-TemporalNoAsignado', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t, '1014 - Caja Camilo');
    await elegirTransaccionPV(t);
    const temporal = String(await documentoNew.value).trim();
    await t.expect(temporal).notEql('', 'No se cargó el documento temporal');

    await t
        .click(documentoNew)
        .pressKey('ctrl+a backspace')
        .pressKey('down')
        .pressKey('down')
        .pressKey('enter')
        .expect(aviso.withText('Documento temporal no esta asignado a este usuario').with({ timeout: 10000 }).exists)
        .ok('No salió el mensaje "Documento temporal no esta asignado a este usuario"')
        .click(Selector('button.swal2-confirm').filterVisible())
        .expect(documentoNew.value).eql(temporal, 'El documento no volvió al temporal del usuario', { timeout: 10000 });

    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
