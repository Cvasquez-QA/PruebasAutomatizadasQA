import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../../ParametrosPruebas/Hgi360Admin8888.js';
const DECIMALES = '5';
const FORMATO_VALOR = '5';
const FORMATO_VALOR_GUARDADO = 'n5';
const FORMATO_DOCUMENTO = '8 - Comprobante Contable';
const FORMATO_DOCUMENTO_TEXTO = 'Comprobante Contable';
const DECIMALES_RESTAURAR = '0';
const FORMATO_VALOR_RESTAURAR = '0';

async function ejecutarPrueba3ParametrosContable(t, config) {
    await ingresarAplicacion(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#tabs_parametros_Contable')
            .click(Selector('#BtnEditar div').withText('Editar'))
            //
            .click('#TxtPrm_Contable_IntInterfazLinea .dx-checkbox-icon')
            .click('#TxtPrm_Contable_IntConCuadra .dx-checkbox-icon')
            .click('#TxtPrm_Contable_IntDescuadreInterfaz .dx-checkbox-icon')
            //
            .click('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input', DECIMALES)
            .click('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input', FORMATO_VALOR)
            //
            .click(Selector('#TxtPrm_Contable_IntFormatoDocumentoCon div').withText(FORMATO_DOCUMENTO_TEXTO).nth(1))
            ;
    await seleccionarOpcion(t, FORMATO_DOCUMENTO);
    await t
            .click('#BtnGuardar .dx-icon.dx-icon-save')
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000)
            .click('#tabs_parametros_Contable')
            .click(Selector('#BtnEditar div').withText('Editar'))
        //Se validan los cambios
            const mensajeValidacion = 'No se guardó el cambio'
            await t
            .expect(Selector('#TxtPrm_Contable_IntInterfazLinea').getAttribute('aria-checked')).eql('true',mensajeValidacion)
            .expect(Selector('#TxtPrm_Contable_IntConCuadra').getAttribute('aria-checked')).eql('true',mensajeValidacion)
            .expect(Selector('#TxtPrm_Contable_IntDescuadreInterfaz').getAttribute('aria-checked')).eql('true',mensajeValidacion)
            //
            .expect(Selector('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input').value).eql(DECIMALES,mensajeValidacion)
            .expect(Selector('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input').value).eql(FORMATO_VALOR_GUARDADO,mensajeValidacion)
            //
            .expect(Selector('#TxtPrm_Contable_IntFormatoDocumentoCon .dx-lookup-field').innerText).eql(FORMATO_DOCUMENTO_TEXTO,mensajeValidacion)
        //Se restauran los valores
            .click('#TxtPrm_Contable_IntInterfazLinea .dx-checkbox-icon')
            .click('#TxtPrm_Contable_IntConCuadra .dx-checkbox-icon')
            .click('#TxtPrm_Contable_IntDescuadreInterfaz .dx-checkbox-icon')
            //
            .click('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Contable_IntDecimalesCon .dx-texteditor-input', DECIMALES_RESTAURAR)
            .click('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtPrm_Contable_StrFormatoValorContable .dx-texteditor-input', FORMATO_VALOR_RESTAURAR)
            //
            .click(Selector('#TxtPrm_Contable_IntFormatoDocumentoCon div').withText(FORMATO_DOCUMENTO_TEXTO).nth(1))
            ;
    await seleccionarOpcion(t, FORMATO_DOCUMENTO);
    await t
            .click('#BtnGuardar .dx-icon.dx-icon-save')
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `3.Parametros-Contable - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Parametros Contable ERP POS - Test Hgi360', async t => {
    await ejecutarPrueba3ParametrosContable(t, testAdminConfig);
});

fixture `3.Parametros-Contable - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Parametros Contable ERP POS - Hgi360 Admin', async t => {
    await ejecutarPrueba3ParametrosContable(t, hgiAdminConfig);
});
