import { Selector } from 'testcafe';
import {
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    TX_DOCUMENTO,
    TX_DOCUMENTO_TEXTO,
    TERCERO,
    PRODUCTO
} from '../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import {
    nuevoDocumento360,
    elegirTerceroDocumento,
    guardarDocumento360,
    agregarLineaDocumento,
    esperarTotalDocumento,
    enviarDocumentoDian360
} from '../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Facturación Electrónica (test.hgi360.com, AutPos):
// crea una factura 01FE con el producto 010203, la envía a la DIAN desde el documento y valida que
// aparezca en Facturación Electrónica > Factura E. La factura enviada queda creada (no se puede borrar).
// PENDIENTE: validar en el navegador los selectores de la pantalla Factura E (se busca el número en el grid).

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, TX_DOCUMENTO, TX_DOCUMENTO_TEXTO);
    await elegirTerceroDocumento(t, TERCERO);
    const numero = await guardarDocumento360(t);
    await agregarLineaDocumento(t, PRODUCTO, { cantidad: '1', valor: '1000' });
    await esperarTotalDocumento(t, total => total > 0, 'El total de la factura quedó en 0');
    await guardarDocumento360(t);

    const mensaje = await enviarDocumentoDian360(t);
    await t.expect(/error|no se pudo|rechaz/i.test(mensaje)).notOk(`No se pudo enviar la factura: ${mensaje}`);
    await cerrarPestana360(t);

    await t
        .click(Selector('#ErpSidebarModulos span').withExactText('Facturación Electrónica'))
        .click(Selector('#ErpMenuCardGrid .erp-menu-child-text').withExactText('Factura E').filterVisible())
        .wait(4000);
    const buscador = Selector('.dx-datagrid-search-panel .dx-texteditor-input').filterVisible();
    if (await buscador.with({ timeout: 10000 }).exists) {
        await t.typeText(buscador, String(numero), { replace: true }).wait(2000);
    }
    await t.expect(Selector('tr.dx-data-row td').filterVisible().withText(String(numero)).with({ timeout: 15000 }).exists)
        .ok(`La factura ${numero} no aparece en Factura E`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba FacturaE ERP POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Factura E POS ERP - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
