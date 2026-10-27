import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { eliminarDocumentoActual360, elegirTerceroDocumento, guardarDocumento360, nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC056 - TX INC056 exige dependencia: sin ella Guardar muestra "Debe seleccionar la dependencia"; con una
 * dependencia (o con el tercero 1000099598) el documento se guarda. Los documentos se eliminan.
 */

const MENSAJE = /Debe seleccionar la dependencia/i;
const avisoDependencia = Selector('.erp-form-error__text, .dx-validationsummary-item, .erp-toast, .swal2-popup').filterVisible().withText(MENSAJE);
const numeroDocumento = Selector('#txtDocumento .dx-texteditor-input');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, 'INC056', 'INC056');
    await t
        .click(Selector('#BtnGuardarDocumento_btn').filterVisible())
        .expect(avisoDependencia.with({ timeout: 10000 }).exists).ok('No muestra el mensaje de seleccionar la dependencia')
        .expect(numeroDocumento.value).notOk('Guardó el documento sin dependencia');
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar);
    }

    await t
        .click('#Documento_Dependencia .dx-lookup-field')
        .expect(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').with({ timeout: 10000 }).exists)
        .ok('La lista de dependencias está vacía')
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').nth(0));
    await guardarDocumento360(t);
    await t.expect(avisoDependencia.exists).notOk('Muestra el mensaje de seleccionar la dependencia');
    await eliminarDocumentoActual360(t);

    await nuevoDocumento360(t, 'INC056', 'INC056', { abrir: false });
    await elegirTerceroDocumento(t, '1000099598');
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
    const guardado = await numeroDocumento.value;
    const conAviso = await avisoDependencia.exists;
    if (guardado) {
        await eliminarDocumentoActual360(t);
    }
    await t
        .expect(conAviso).notOk('Con el tercero 1000099598 muestra el mensaje de seleccionar la dependencia')
        .expect(guardado).ok('Con el tercero 1000099598 el documento no se guardó');
    await cerrarSesion360(t);
}

fixture `Prueba dependencia 0 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba dependencia 0 Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba dependencia 0 Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba dependencia 0 Pos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
