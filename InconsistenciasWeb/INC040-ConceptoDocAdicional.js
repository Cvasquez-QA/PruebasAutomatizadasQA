import { Selector } from 'testcafe';
import { abrirMaestros360, buscarEnGrid360, accionFilaGrid360, cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { agregarLineaDocumento, enviarDocumentoDian360, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC040 - La transacción INC040 tiene el parámetro "Concepto doc adicional" (pestaña Documentos) y el documento
 * lo muestra en Ubicación. El documento con 010203 se envía a la DIAN y debe sincronizar.
 * El documento enviado a la DIAN no se puede eliminar: queda en el ambiente.
 */

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Transacciones');
    await buscarEnGrid360(t, 'gridTransacciones', 'INC040');
    await accionFilaGrid360(t, 'gridTransacciones', 'INC040', 'Editar');
    await t
        .click(Selector('#tabs_documento_Documentos').with({ timeout: 15000 }))
        .wait(1500)
        .expect(Selector('#TxtTransaccion_Doc_Cpto_Doc_Adicional').exists).ok('No está el parámetro del concepto doc adicional');
    const cancelar = Selector('[id^="BtnCancelarTransaccion"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPestana360(t);

    await nuevoDocumento360(t, 'INC040', 'INC040');
    await t
        .click('#tabs_documento_Ubicacion')
        .expect(Selector('#Documento_Cpto_Doc_Adicional .dx-lookup-field').with({ timeout: 10000 }).visible).ok('No está visible el parámetro');
    await guardarDocumento360(t);
    if (!await Selector('#txtDocumento_Detalle_Producto_cursor_1').visible) {
        await t.click(Selector('[id^="tabs_documento_"]').withText(/Detalle|Documento/i).nth(0)).wait(1000);
    }
    await agregarLineaDocumento(t, '010203', { cantidad: '1' });
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(2000);

    const exito = /se sincroniz[oó] correctamente a la DIAN/i;
    const mensaje = await enviarDocumentoDian360(t);
    const enPantalla = await Selector('body').withText(exito).exists;
    await t.expect(exito.test(mensaje) || enPantalla)
        .ok(`No se mostró el mensaje de confirmación de enviado a la DIAN. Mensaje: ${mensaje.replace(/\s+/g, ' ') || 'ninguno'}`);
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await cerrarSesion360(t);
}

fixture `Prueba INC040 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC040 Concepto Doc Adicional Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC040 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC040 Concepto Doc Adicional POS - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
