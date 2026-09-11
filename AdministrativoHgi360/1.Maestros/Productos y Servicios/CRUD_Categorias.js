import { Selector } from 'testcafe';
import {
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MiCategoria';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';
const CODIGO_PADRE = 'GENERAL';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaCategorias(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Categorias', 'productos');
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

fixture `CRUD_Categorias - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CATEGORIAS testerp CRUD - Test Hgi360', async t => {
    await ejecutarPruebaCategorias(t, testAdminConfig);
});

fixture `CRUD_Categorias - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CATEGORIAS Hgi360 Admin CRUD - Hgi360 Admin', async t => {
    await ejecutarPruebaCategorias(t, hgiAdminConfig);
});
