import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { agregarLineaDocumento, cargarDocumento360, eliminarDocumentoActual360, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC030 - El documento se crea con 1 cuota (pestaña Ubicación) y la conserva después de agregar
 * una línea y volver a cargarlo. TX INC030, producto 01 a 1000. El documento se elimina al final.
 */

const cuotas = Selector('#Documento_Cuotas .dx-texteditor-input');

const leerCuotas = async t => {
    await t
        .click('#tabs_documento_Ubicacion')
        .expect(cuotas.with({ timeout: 10000 }).exists).ok('No apareció el campo Cuotas en Ubicación');
    return cuotas.value;
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, 'INC030', 'INC030');
    const numero = await guardarDocumento360(t);

    try {
        await t.expect(await leerCuotas(t)).eql('1', 'No se está creando con cuota 1 por defecto');
        if (!await Selector('#txtDocumento_Detalle_Producto_cursor_1').visible) {
            await t.click(Selector('[id^="tabs_documento_"]').withText(/Detalle|Documento/i).nth(0)).wait(1000);
        }
        await agregarLineaDocumento(t, '01', { valor: '1000' });
        await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(2500);
        await cargarDocumento360(t, numero);
        await t.expect(await leerCuotas(t)).eql('1', 'Se está cambiando la cuota 1 por defecto');
    } finally {
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Cuota 0 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cuota 0 Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Cuota 0 Admin Hgi360`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cuota 0 Admin Hgi360', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
