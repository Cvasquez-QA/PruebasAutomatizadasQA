import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_FORMATO = '1973';
const TIPO_FORMATO = '1 - Documentos';
const DESCRIPCION = 'midesc';
const TIPO_ANEXO = '2 - Pago';
const TRANSACCION_PRUEBA = '01 - FACTURA DE VENTA ELECTRÓNICA';
const DOCUMENTO_PRUEBA = '10203040';
const DESCRIPCION_EDIT = 'minuevadesc';

async function ejecutarPruebaFormatos(t, config, ingresar) {
    await ingresar(t, config);
    await t.wait(3000);
    await abrirHerramientas(t, 'FORMATOS');
    await t
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
        await abrirHerramientas(t, 'FORMATOS');
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
            await t
                .click('#gridFormatos .dx-icon.dx-icon-refresh')
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Formatos - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Parametros - Formatos - Mi ERP', async t => {
    await ejecutarPruebaFormatos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Formatos - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Parametros - Formatos - Test Contable', async t => {
    await ejecutarPruebaFormatos(t, testContableConfig, ingresarAplicacion);
});
