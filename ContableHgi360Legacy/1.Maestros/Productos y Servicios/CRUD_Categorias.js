import { Selector } from 'testcafe';
import { seleccionarOpcion, ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiCategoria';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';
const CODIGO_PADRE = 'GENERAL';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaCategorias(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Categorias');
        await eliminarRegistroSiExiste(t, '#gridCategoriasProd', CODIGO);
        await t
            .click('#gridCategoriasProd .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#CategoriasProd_StrIdCategoria', CODIGO)
            .typeText('#txtCategoriasProd_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtMaestroCategorias_CodigoPadre .dx-lookup-field')
            ;
    await seleccionarOpcion(t, CODIGO_PADRE);
    await t
            .click('#txtCategoriasProd_IntEstado .dx-checkbox-icon')
            .click('#txtCategoriasProd_IntMenu .dx-checkbox-icon')
            .click(Selector('#BtnGuardarCategoriasProd div').withText('Guardar'))
            //El sistema NO permite guardar una Sector sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridCategoriasProd td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridCategoriasProd [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtCategoriasProd_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCategoriasProd_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarCategoriasProd div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCategoriasProd');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Categorias - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CATEGORIAS Test Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaCategorias(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_Categorias - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CATEGORIAS Test Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaCategorias(t, testContableConfig, ingresarAplicacion);
});
