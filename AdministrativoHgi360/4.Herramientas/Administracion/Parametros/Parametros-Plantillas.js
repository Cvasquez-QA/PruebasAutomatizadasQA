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

const TIPO_PLANTILLA = 'Nómina';
const NOMBRE_PLANTILLA = 'pruebaNomina';
const MENSAJE_PLANTILLA = 'pruebaMensajeNomina';
const MENSAJE_PLANTILLA_EDIT = 'nuevoMensajepruebaNomina';

async function ejecutarPruebaParametrosPlantillas(t, config) {
    await ingresarAplicacion(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .wait(3000)
            .click('#tabs_parametros_Plantilla')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .click('#gridParametrosGeneralesPlantillas .dx-icon.dx-icon-edit-button-addrow')
            .click(Selector('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon').nth(1))
            ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
            .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(4), NOMBRE_PLANTILLA)
            .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(5), MENSAJE_PLANTILLA)
            .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .wait(2000)
      //'Consultar Parametro - Plantilla';
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametros_Plantilla')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .click('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
            .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(1), NOMBRE_PLANTILLA)
            .wait(2000)
            .expect(Selector('#gridParametrosGeneralesPlantillas td').withText(NOMBRE_PLANTILLA).exists).ok('El registro existe','No existe el registro')
      //'Editar Parametro - Plantilla';
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametros_Plantilla')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .click('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
            .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(1), NOMBRE_PLANTILLA)
            .wait(2000)
            .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon')
            .click(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(5))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(5), MENSAJE_PLANTILLA_EDIT)
            .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .click(Selector('#PanelParametrosGenerales div').withText('Guardar'))
    //'Eliminar Parametro - Plantilla';
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametros_Plantilla')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .click('#gridParametrosGeneralesPlantillas .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, TIPO_PLANTILLA);
    await t
            .typeText(Selector('#gridParametrosGeneralesPlantillas .dx-texteditor-input').nth(1), NOMBRE_PLANTILLA)
            .wait(2000)
            .click('#gridParametrosGeneralesPlantillas .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
            .click(Selector('span').withText('Sí'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Parametros-Plantillas - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Crear Parámetro - Plantilla - Test Hgi360', async t => {
    await ejecutarPruebaParametrosPlantillas(t, testAdminConfig);
});

fixture `Parametros-Plantillas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Crear Parámetro - Plantilla - Hgi360 Admin', async t => {
    await ejecutarPruebaParametrosPlantillas(t, hgiAdminConfig);
});
