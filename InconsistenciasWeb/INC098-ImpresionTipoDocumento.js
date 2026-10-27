import { Selector } from 'testcafe';
import { abrirMaestros360, cerrarPestana360, cerrarSesion360, ingresarAplicacion, selectorOpcion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

fixture `INC098 Impresion Tipo Documento testAdmin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC098 Impresion Tipo Documento', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros360(t, 'Transacciones');
    const editar = Selector('[data-testid="gridTransacciones"], #gridTransacciones').filterVisible().find('[aria-label="Editar"]');
    await t
        .click(editar.with({ timeout: 30000 }).nth(0))
        .expect(Selector('#txtTransaccion_Tipo .dx-lookup-field').with({ timeout: 15000 }).visible).ok('No abrió la edición de la transacción')
        .wait(1500)
        .click('#txtTransaccion_Tipo .dx-lookup-field')
        .click(selectorOpcion('Documentos'))
        .expect(Selector('#Transaccion_Seccion_OpcionImpresion label').withText('Opciones de impresión').visible).ok('No se encontró la sección de opciones de impresión')
        .expect(Selector('#Transaccion_IntOpcionImpresion div').withText('Impresión directa').nth(2).visible).ok('No se encontró la opción de impresión directa')
        .expect(Selector('#Transaccion_IntOpcionImpresion div').withText('Nueva pestaña').nth(2).visible).ok('No se encontró la opción de nueva pestaña')
        .click('#txtTransaccion_Tipo .dx-lookup-field')
        .click(selectorOpcion('Pagos'))
        .wait(1500)
        .expect(Selector('#Transaccion_Seccion_OpcionImpresion label').withText('Opciones de impresión').visible).notOk('Se encontró la sección de opciones de impresión')
        .expect(Selector('#Transaccion_IntOpcionImpresion div').withText('Impresión directa').nth(2).visible).notOk('Se encontró la opción de impresión directa')
        .expect(Selector('#Transaccion_IntOpcionImpresion div').withText('Nueva pestaña').nth(2).visible).notOk('Se encontró la opción de nueva pestaña')
        .click('#txtTransaccion_Tipo .dx-lookup-field')
        .click(selectorOpcion('Causaciones'))
        .wait(1500)
        .expect(Selector('#Transaccion_Seccion_OpcionImpresion label').withText('Opciones de impresión').visible).notOk('Se encontró la sección de opciones de impresión')
        .expect(Selector('#Transaccion_IntOpcionImpresion div').withText('Impresión directa').nth(2).visible).notOk('Se encontró la opción de impresión directa')
        .expect(Selector('#Transaccion_IntOpcionImpresion div').withText('Nueva pestaña').nth(2).visible).notOk('Se encontró la opción de nueva pestaña');
    const cancelar = Selector('[id^="BtnCancelarTransaccion"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 3000 }).exists) {
        await t.click(confirmar);
    }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
