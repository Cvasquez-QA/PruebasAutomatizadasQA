import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, seleccionarOpcion, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'codUni';
const DESCRIPCION = 'midescunidad';
const OPCION_CODIGO_DIAN = 'alimenta';
const OPCION_CODIGO_DIAN_LOOKUP = '91 - alimenta';
const DESCRIPCION_EDIT = 'minuevadescunidad';
const OPCION_CODIGO_DIAN_EDIT = 'A1 - 15 calorías C';


async function ejecutarPruebaUnidades1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Unidades');
        await eliminarRegistroSiExiste(t, '#gridUnidades', CODIGO);
        await t
            .click('#gridUnidades .dx-icon.dx-icon-add')
            .typeText('#txtStrIdUnidad', CODIGO)
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN);
    await t
            .click(Selector('#BtnGuardarUnidad span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridUnidades td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridUnidades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtUnidad_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN_EDIT);
    await t
            .click(Selector('#BtnGuardarUnidad div').withText('Guardar'))
        //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridUnidades');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaUnidades2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Unidades');
        await eliminarRegistroSiExiste(t, '#gridUnidades', CODIGO);
        await t
            .click('#gridUnidades .dx-icon.dx-icon-add')
            .typeText('#txtStrIdUnidad', CODIGO)
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN_LOOKUP);
    await t
            .click(Selector('#BtnGuardarUnidad span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridUnidades td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridUnidades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtUnidad_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN_EDIT);
    await t
            .click(Selector('#BtnGuardarUnidad div').withText('Guardar'))
        //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridUnidades');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_UnidadesUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Unidades CRUD Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaUnidades1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Unidades CRUD Test Contable - Mi ERP', async t => {
    await ejecutarPruebaUnidades2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_UnidadesUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Unidades CRUD Mi Contable - Test Contable', async t => {
    await ejecutarPruebaUnidades1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Unidades CRUD Test Contable - Test Contable', async t => {
    await ejecutarPruebaUnidades2(t, testContableConfig, ingresarAplicacion);
});
