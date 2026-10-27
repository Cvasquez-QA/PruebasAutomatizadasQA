import { Selector } from 'testcafe';
import { cerrarSesion360, elegirEnLookup360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { cargarDocumento360, eliminarDocumentoActual360, elegirTerceroDocumento, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC025 - El vendedor elegido en el encabezado debe conservarse al guardar y volver a cargar el documento.
 * TX INC025, vendedor 0 - GENERAL. El documento se elimina al final.
 */

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, 'INC025', 'INC025');
    // Con el tercero por defecto (0 - GENERAL) Guardar abre "Validación tercero: NIT incorrecto"
    await elegirTerceroDocumento(t, '811021438');
    await elegirEnLookup360(t, '#Documento_Vendedor', '0 - GENERAL', 'general');
    const numero = await guardarDocumento360(t);

    try {
        await cargarDocumento360(t, numero);
        await t
            .expect(Selector('#Documento_Vendedor .dx-lookup-field').innerText).contains('GENERAL', 'No se cambió el vendedor por el seleccionado');
    } finally {
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Cambio de Vendedor - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cambio de vendedor - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Cambio de Vendedor - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Cambio de vendedor - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
