import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js'; 

const TIPO_PLANTILLA = 'Nómina';
const NOMBRE_PLANTILLA = 'pruebaNomina';
const MENSAJE_PLANTILLA = 'pruebaMensajeNomina';
const MENSAJE_PLANTILLA_EDIT = 'nuevoMensajepruebaNomina';


async function ejecutarPruebaParametrosPlantillas(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'PARÁMETROS');
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
        await abrirHerramientas(t, 'PARÁMETROS');
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
        await abrirHerramientas(t, 'PARÁMETROS');
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
        await abrirHerramientas(t, 'PARÁMETROS');
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

fixture `Parametros-Plantillas - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Crear Parámetro - Plantilla - Mi ERP', async t => {
    await ejecutarPruebaParametrosPlantillas(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Parametros-Plantillas - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Crear Parámetro - Plantilla - Test Contable', async t => {
    await ejecutarPruebaParametrosPlantillas(t, testContableConfig, ingresarAplicacion);
});
