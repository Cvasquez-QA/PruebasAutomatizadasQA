import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, elegirEnLookup360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { eliminarDocumentoActual360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * Documento de la TX 60 (nota): sin Notas DIAN Guardar valida; con "4 - Otro" sale la Validación Tercero.
 * Si se cancela esa validación (documento sin guardar) y se intenta grabar una línea, el ERP debe avisar con un
 * mensaje y no con un error genérico ("Referencia a objeto no establecida...").
 */
async function ejecutarPrueba360(t, config) {
    const aviso = Selector('.swal2-popup, .erp-toast, .erp-form-error__text').filterVisible();
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    await ingresarAplicacion360(t, config);
    await nuevoDocumento360(t, '60', /^\s*0?60 -/);
    await t
        .click(Selector('#BtnGuardarDocumento_btn').filterVisible())
        .expect(aviso.with({ timeout: 10000 }).exists).ok('Guardar sin Notas DIAN no mostró ninguna validación');
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t.click('#tabs_documento_Ubicacion');
    await elegirEnLookup360(t, '#Documento_NotasDIAN', '4 - Otro');
    await t
        .click(Selector('#BtnGuardarDocumento_btn').filterVisible())
        .expect(Selector('#Documento_ModalValidacionDIAN').filterVisible().withText('Validación Tercero').with({ timeout: 10000 }).exists)
        .ok('No está saliendo el control del tercero')
        .click(Selector('#Documento_ModalValidacionDIAN_BtnCancelar_btn, #Documento_ModalValidacionDIAN_BtnCancelar').filterVisible().nth(0))
        .wait(1500);

    const producto = Selector('#txtDocumento_Detalle_Producto_cursor_1');
    if (!await producto.visible) {
        await t.click(Selector('[id^="tabs_documento_"]').withText(/Detalle|Documento/i).nth(0)).wait(1000);
    }
    let texto = '';
    if (await producto.visible && !await producto.hasAttribute('disabled')) {
        await t
            .typeText(producto, '010203', { replace: true })
            .pressKey('enter')
            .wait(1500)
            .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '100', { replace: true })
            .click('#txtDocumento_Detalle_Boton_1 .dx-icon-save')
            .expect(aviso.with({ timeout: 10000 }).exists).ok('Grabar la línea de un documento sin guardar no mostró ningún mensaje');
        texto = (await aviso.nth(0).innerText).replace(/\s+/g, ' ').trim();
    }
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    if (await Selector('#txtDocumento .dx-texteditor-input').value) {
        await eliminarDocumentoActual360(t);
    }
    await t.expect(texto).notMatch(/Referencia a objeto no establecida/i, `Sale el mensaje genérico: ${texto}`);
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, '60');
    await t
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .click(Selector('#modal_Documento_validacion button').withText('×'))
        .click('#tabs_documento_Ubicacion')
        .click('#Documento_NotasDIAN .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('div').withText('4 - Otro').nth(9))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('#Documento_ModalValidacionDIAN h5').withText('Validación Tercero').visible).ok('No está saliendo el control del tercero')
        .click(Selector('#Documento_ModalValidacionDIAN_BtnCancelar span').withText('Cancelar'))
        .doubleClick('#txtDocumento_Detalle_Producto_cursor_1')
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '100')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .expect(Selector('.swal2-content div').withText('Referencia a objeto no establecida como instancia').visible).ok('no salió el mensaje genérico')
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC071 mensaje doc sin guardar POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC071 mensaje doc sin guardar POS - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC071 mensaje doc sin guardar Happgi POS`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC071 mensaje doc sin guardar Happgi POS', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig);
});
