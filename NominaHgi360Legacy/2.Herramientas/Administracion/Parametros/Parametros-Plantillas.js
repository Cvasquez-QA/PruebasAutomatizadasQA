import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    ingresarAplicacion,
    
    cerrarSesion360,
    seleccionarOpcion
} from '../../../../Funciones/HelpersHgi360Legacy.js';
import {
    ingresarParametros,
    editarParametros,
    reabrirParametros
} from '../HelpersNomina.js';

const CODIGO_PLANTILLA = 'pruebaNomina';
const TAB_PLANTILLA = '#tabs_parametros_Plantilla';
const TIPO_PLANTILLA = 'Nómina';
const MENSAJE_INICIAL = 'pruebaMensajeNomina';
const MENSAJE_EDITADO = 'nuevoMensajeNomina';

const ejecutarCrudPlantillas = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametros(t, TAB_PLANTILLA);
    await editarParametros(t);

    await t
        .click('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon')
        ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
        .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(1), CODIGO_PLANTILLA)
        .wait(2000);

    if (await Selector('#gridParametrosGeneralesPlantillas td').withText(CODIGO_PLANTILLA).exists) {
        await t
            .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
            .click(Selector('span').withText('Sí'))
            .wait(2000);
    }

    await t
        .click('#gridParametrosGeneralesPlantillas .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(3))
        ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
        .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(4), CODIGO_PLANTILLA)
        .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(5), MENSAJE_INICIAL)
        .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
        .click('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon')
        ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
        .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(1), CODIGO_PLANTILLA)
        .wait(2000)
        .expect(Selector('#gridParametrosGeneralesPlantillas td').withText(CODIGO_PLANTILLA).exists).ok('No existe el registro')
        .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon')
        .click(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(5))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(5), MENSAJE_EDITADO)
        .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .click(Selector('#PanelParametrosGenerales div').withText('Guardar'))
        .wait(2000)
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await reabrirParametros(t, TAB_PLANTILLA);

    await t
        .click('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon')
        ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
        .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(1), CODIGO_PLANTILLA)
        .wait(2000)
        .expect(Selector('#gridParametrosGeneralesPlantillas td').withText(MENSAJE_EDITADO).exists).ok('No se guardó la edición')
        .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .click(Selector('span').withText('Sí'))
        .wait(2000);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

fixture `Prueba Parametros Plantillas Nomina - MiHgi360 8893`
    .page(miNominaConfig.pagina);

test('[Mi Hgi360 8893] Parametros Plantillas - CRUD y persistencia', async t => {
    await ejecutarCrudPlantillas(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Parametros Plantillas Nomina - Test Hgi360 8902`
    .page(testNominaConfig.pagina);

test('[Test Hgi360 8902] Parametros Plantillas - CRUD y persistencia', async t => {
    await ejecutarCrudPlantillas(t, testNominaConfig, ingresarAplicacion);
});
