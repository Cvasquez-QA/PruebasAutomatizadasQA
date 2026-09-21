import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    selectorOpcion,
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

fixture `INC098 Impresion Tipo Documento testAdmin HGI360`
    .page(testAdminConfig.pagina);

test('INC098 Impresion Tipo Documento', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros360(t, 'Transacciones');
    await t
        .wait(2000)
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
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
    await t.click(Selector('#BtnCancelarTransaccion .dx-icon.dx-icon-close'));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
