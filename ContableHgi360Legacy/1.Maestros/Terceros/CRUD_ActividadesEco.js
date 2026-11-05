import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'pruebaCodigoActividadEco';
const DESCRIPCION = 'descActividadEco';
const DESCRIPCION_EDIT = 'nuevaDescActividadEco';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaActividadesEco(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Actividades Eco');
        await eliminarRegistroSiExiste(t, '#gridActividadesEconomicas', CODIGO);
        await t
            .click(Selector('#gridActividadesEconomicas .dx-icon.dx-icon-add'))
        //Se comienza con la inserción de datos para la creación de la activadad economica
            .typeText('#txtStrIdActividadEco', CODIGO)
            .typeText('#txtActividadEconomica_Descripcion', DESCRIPCION)
            .click(Selector('#BtnGuardarActividadEconomica span').withText('Guardar'))
        //Se valida su creación 
            .wait(3000)
            .expect(Selector('#gridActividadesEconomicas td').withText(CODIGO).exists).ok()
        //Se edita el ActividadEco
            .click(Selector('#gridActividadesEconomicas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtActividadEconomica_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtActividadEconomica_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarActividadEconomica span').withText('Guardar'))
        //Se elimina el ActividadEco
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridActividadesEconomicas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ActividadesEco - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ActividadesEco Test Contable - Mi ERP', async t => {
    await ejecutarPruebaActividadesEco(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ActividadesEco - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ActividadesEco Test Contable - Test Contable', async t => {
    await ejecutarPruebaActividadesEco(t, testContableConfig, ingresarAplicacion);
});
