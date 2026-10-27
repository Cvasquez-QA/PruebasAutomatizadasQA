import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    eliminarDocumentoActual360,
    enviarDocumentoDian360,
    esperarLineasDocumento,
    escribirProductoDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC078 - TX 0101 (Admin): sin dependencia Guardar avisa "Debe seleccionar la dependencia". Con una línea en
 * cantidad 0, el envío a la DIAN debe avisar que el detalle "no puede tener cantidad cero". El documento se elimina.
 */

const avisoDependencia = Selector('.erp-form-error__text, .dx-validationsummary-item, .erp-toast, .swal2-popup')
    .filterVisible().withText(/Debe seleccionar la dependencia/i);
const confirmar = Selector('button.swal2-confirm').filterVisible();
const cantidad = Selector('#txtDocumento_Detalle_Cantidad_cursor_1');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, '0101', /^\s*0101 -/);
    await t
        .click(Selector('#BtnGuardarDocumento_btn').filterVisible())
        .expect(avisoDependencia.with({ timeout: 10000 }).exists).ok('No muestra el mensaje de seleccionar la dependencia');
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t
        .click('#Documento_Dependencia .dx-lookup-field')
        .expect(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').with({ timeout: 10000 }).exists)
        .ok('La lista de dependencias está vacía')
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').nth(0));
    await guardarDocumento360(t);

    let mensaje = '';
    try {
        await escribirProductoDocumento(t, '010203');
        await t
            .click(cantidad)
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(cantidad, '0')
            .click('#txtDocumento_Detalle_Boton_1 .dx-icon-save')
            .wait(1500);
        const avisoLinea = Selector('.swal2-popup, .erp-toast[data-type="error"], .erp-toast[data-type="warning"]').filterVisible();
        if (await avisoLinea.exists) {
            mensaje = (await avisoLinea.innerText).replace(/\s+/g, ' ').trim();
            if (await confirmar.exists) {
                await t.click(confirmar);
            }
        } else {
            await esperarLineasDocumento(t, 1, 'No se grabó la línea en cantidad 0');
            mensaje = (await enviarDocumentoDian360(t)).replace(/\s+/g, ' ').trim();
        }
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await eliminarDocumentoActual360(t);
    }
    await t.expect(mensaje).match(/no puede tener cantidad cero/i, `No salió el aviso de cantidad cero. Mensaje: "${mensaje}"`);
    await cerrarSesion360(t);
}

fixture `Prueba INC078 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC078 Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
