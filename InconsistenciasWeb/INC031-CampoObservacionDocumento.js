import { Selector } from 'testcafe';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    cargarDocumento360,
    eliminarDocumentoActual360,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC31 - Observaciones del documento (test.hgi360.com, Administrativo > Movimientos > Documentos, TX INC031).
 * Con el tercero 0 - General la observación inicia vacía; al escribirla y guardar queda grabada.
 * El documento se elimina al final. La prueba de Happgi se dejó como estaba (no se migra).
 */

const OBSERVACION = 'Prueba Observacion 1';
const observaciones = Selector('#txtDocumento_Observaciones .dx-texteditor-input');

fixture `Prueba campo observacion documento Admin testerp`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba campo observacion documento testerp Admin', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await nuevoDocumento360(t, 'INC031', 'INC031');
    const numero = await guardarDocumento360(t);

    try {
        await t
            .expect(observaciones.value).eql('', 'La observación no inicia vacía con el tercero 0 - General')
            .typeText(observaciones, OBSERVACION, { replace: true })
            .click(Selector('#BtnGuardarDocumento_btn').filterVisible())
            .wait(3000);
        await cargarDocumento360(t, numero);
        await t.expect(observaciones.value).eql(OBSERVACION, 'No se actualizó el campo observación', { timeout: 10000 });
    } finally {
        await eliminarDocumentoActual360(t).catch(() => undefined);
    }
    await t.expect(Selector('#txtDocumento .dx-texteditor-input').value).notOk(`No se eliminó el documento ${numero}`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba campo observacion documento Admin testhappgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba campo observacion documento testhappgi Admin', async t => {
    await HelpersHappgi.ingresarAplicacion(t, testHappgiAdminConfig);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, 'INC031');
    await t
        .wait(1500)
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .expect(Selector('#txtDocumento_Observaciones .dx-texteditor-input').value).eql('', 'SE está mostrando un valor diferente al del tercero 0-General')
        .typeText('#txtDocumento_Observaciones .dx-texteditor-input', OBSERVACION)
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .click(Selector('#txtDocumento'))
        .pressKey('enter')
        .wait(1500)
        .expect(Selector('#txtDocumento_Observaciones .dx-texteditor-input').value).eql(OBSERVACION, 'No se actualizó el campo observación')
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);
    await HelpersHappgi.cerrarSesion(t);
});
