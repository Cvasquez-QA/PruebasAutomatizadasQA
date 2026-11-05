import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    ingresarAplicacion,
    
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360Legacy.js';
import {
    ingresarFormatos,
    switchToContextoConSelector
} from './HelpersNomina.js';

const CODIGO_FORMATO = '1973';
const DESCRIPCION_INICIAL = 'midesc';
const DESCRIPCION_EDITADA = 'minuevadesc';
const DOCUMENTO_PRUEBA = '10203040';

const ejecutarCrudFormatos = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarFormatos(t);

    await t
        .typeText(Selector('#gridFormatos .dx-texteditor-input'), CODIGO_FORMATO)
        .wait(2000);

    if (await Selector('#gridFormatos td').withText(CODIGO_FORMATO).exists) {
        await eliminarRegistroDesdeGrid(t, '#gridFormatos');
        await t
            .wait(3000);
    }

    if (await Selector('.swal2-container.swal2-shown').exists) {
        await t.click(Selector('.swal2-actions button').withText('Aceptar')).wait(2000);
    }

    await t
        .click(Selector('#gridFormatos .dx-button-content').nth(1))
        .wait(2000);

    await switchToContextoConSelector(t, '#txtIntIdFormato');

    await t
        .typeText(Selector('#txtIntIdFormato'), CODIGO_FORMATO)
        .click('#txtFormato_TipoFormato .dx-lookup-field')
        .click(Selector('div').withText('1 - Documentos').nth(9))
        .typeText('#txtFormato_Descripcion .dx-texteditor-input', DESCRIPCION_INICIAL)
        .click(Selector('#txtFormatosNet_ImprimeAnexo span').withText('Imprime anexo'))
        .click(Selector('#txtFormato_TipoAnexo div').withText('Pago').nth(1))
        .click(Selector('div').withText('2 - Pago').nth(19))
        .click('#txtFormato_TransaccionPrueba .dx-lookup-field')
        .click(Selector('div').withText('01 - FACTURA DE VENTA ELECTRÓNICA').nth(9))
        .typeText('#txtFormato_DocumentoPrueba .dx-texteditor-input', DOCUMENTO_PRUEBA)
        .click(Selector('#BtnGuardarFormato span').withText('Guardar'))
        .click(Selector('button').withText('Cancelar'))
        .wait(2000);

    await cerrarPestana360(t);
    await ingresarFormatos(t);

    await t
        .typeText(Selector('#gridFormatos .dx-texteditor-input'), CODIGO_FORMATO)
        .wait(2000)
        .expect(Selector('#gridFormatos td').withText(CODIGO_FORMATO).exists).ok('No se creó el formato')
        .click(Selector('#gridFormatos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtFormato_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtFormato_Descripcion .dx-texteditor-input', DESCRIPCION_EDITADA)
        .click(Selector('#BtnGuardarFormato div').withText('Guardar'))
        .click(Selector('button').withText('Cancelar'))
        .wait(2000);

    await cerrarPestana360(t);
    await ingresarFormatos(t);

    await t
        .typeText(Selector('#gridFormatos .dx-texteditor-input'), CODIGO_FORMATO)
        .wait(2000)
        .click(Selector('#gridFormatos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .expect(Selector('#txtFormato_Descripcion .dx-texteditor-input').value).eql(DESCRIPCION_EDITADA, 'No se guardó la edición')
        .click(Selector('button').withText('Cancelar'));
    await eliminarRegistroDesdeGrid(t, '#gridFormatos');
    await t
        .wait(2000);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

fixture `Prueba Formatos Hgi360 Nomina - MiHgi360 8893`
    .page(miNominaConfig.pagina);

test('[Mi Hgi360 8893] Formatos - CRUD y persistencia', async t => {
    await ejecutarCrudFormatos(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Formatos Hgi360 Nomina - Test Hgi360 8902`
    .page(testNominaConfig.pagina);

test('[Test Hgi360 8902] Formatos - CRUD y persistencia', async t => {
    await ejecutarCrudFormatos(t, testNominaConfig, ingresarAplicacion);
});
