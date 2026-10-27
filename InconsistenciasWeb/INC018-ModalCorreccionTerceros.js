import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC18 - Un número de documento mayor que int32 (2147483648) muestra
 * "El número de documento supera el valor permitido" en Documentos (TX 25) y en el Punto de Venta
 * (test.hgi360.com). No guarda nada.
 */

const MENSAJE = 'El número de documento supera el valor permitido';
const NUMERO = '2147483648';
const mensajeVisible = Selector('.erp-toast, .swal2-popup').filterVisible().withText(MENSAJE);

fixture `Prueba Modal correccion terceros testerp`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Modal correccion terceros ', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await nuevoDocumento360(t, '25', '25 - VALIDACION CAMPOS');
    await t
        .typeText('#txtDocumento .dx-texteditor-input', NUMERO, { replace: true })
        .pressKey('enter')
        .expect(mensajeVisible.with({ timeout: 10000 }).exists).ok(`Documentos no mostró "${MENSAJE}"`);
    await cerrarPestana360(t);

    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await t
        .typeText('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input', NUMERO, { replace: true })
        .pressKey('enter')
        .expect(mensajeVisible.with({ timeout: 10000 }).exists).ok(`El Punto de Venta no mostró "${MENSAJE}"`)
        .click(Selector('button.swal2-confirm').filterVisible());
    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
});
