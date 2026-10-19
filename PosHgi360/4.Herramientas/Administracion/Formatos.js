import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_FORMATO = '1973';
const TIPO_FORMATO = '1 - Documentos';
const DESCRIPCION = 'midesc';
const TIPO_ANEXO = '2 - Pago';
const TRANSACCION_PRUEBA = '01 - FACTURA DE VENTA ELECTRÓNICA';
const DOCUMENTO_PRUEBA = '10203040';
const DESCRIPCION_EDIT = 'minuevadesc';

fixture `Prueba Formatos Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Parametros - Formatos - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
await t
        .wait(3000)

        await abrirHerramientas360(t, 'Formatos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#gridFormatos .dx-button-content').nth(1))
        .typeText('#txtIntIdFormato', CODIGO_FORMATO)
        .click('#txtFormato_TipoFormato .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TIPO_FORMATO);
    await t
        .typeText('#txtFormato_Descripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#txtFormatosNet_ImprimeAnexo span').withText('Imprime anexo'))
        .click(Selector('#txtFormato_TipoAnexo div').withText('Pago').nth(1))
        ;
    await seleccionarOpcion(t, TIPO_ANEXO);
    await t
        .click('#txtFormato_TransaccionPrueba .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TRANSACCION_PRUEBA);
    await t
        .typeText('#txtFormato_DocumentoPrueba .dx-texteditor-input', DOCUMENTO_PRUEBA)
        .click(Selector('#BtnGuardarFormato span').withText('Guardar'))
        .click(Selector('button').withText('Cancelar'));
//Se valida la creación

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Formatos');
    await t
        .typeText('#gridFormatos .dx-texteditor-input', CODIGO_FORMATO)
        .expect((Selector('#gridFormatos td').withText(CODIGO_FORMATO)).exists).ok('no se creó el formato')
//Se edita
        .wait(1000)
        .click(Selector('#gridFormatos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(2))
        .click('#txtFormato_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtFormato_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
        .click(Selector('#BtnGuardarFormato div').withText('Guardar'))
        .click(Selector('button').withText('Cancelar'))
        .wait(3000)
//Se elimina
        ;
    await eliminarRegistroDesdeGrid(t, '#gridFormatos');
        .click('#gridFormatos .dx-icon.dx-icon-refresh')
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Formatos Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Parametros - Formatos - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
await t
        .wait(3000)

        await abrirHerramientas360(t, 'Formatos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#gridFormatos .dx-button-content').nth(1))
        .typeText('#txtIntIdFormato', CODIGO_FORMATO)
        .click('#txtFormato_TipoFormato .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TIPO_FORMATO);
    await t
        .typeText('#txtFormato_Descripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#txtFormatosNet_ImprimeAnexo span').withText('Imprime anexo'))
        .click(Selector('#txtFormato_TipoAnexo div').withText('Pago').nth(1))
        ;
    await seleccionarOpcion(t, TIPO_ANEXO);
    await t
        .click('#txtFormato_TransaccionPrueba .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TRANSACCION_PRUEBA);
    await t
        .typeText('#txtFormato_DocumentoPrueba .dx-texteditor-input', DOCUMENTO_PRUEBA)
        .click(Selector('#BtnGuardarFormato span').withText('Guardar'))
        .click(Selector('button').withText('Cancelar'));
//Se valida la creación

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Formatos');
    await t
        .typeText('#gridFormatos .dx-texteditor-input', CODIGO_FORMATO)
        .expect((Selector('#gridFormatos td').withText(CODIGO_FORMATO)).exists).ok('no se creó el formato')
//Se edita
        .wait(1000)
        .click(Selector('#gridFormatos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(2))
        .click('#txtFormato_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtFormato_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
        .click(Selector('#BtnGuardarFormato div').withText('Guardar'))
        .click(Selector('button').withText('Cancelar'))
        .wait(3000)
//Se elimina
        ;
    await eliminarRegistroDesdeGrid(t, '#gridFormatos');
        .click('#gridFormatos .dx-icon.dx-icon-refresh')
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
