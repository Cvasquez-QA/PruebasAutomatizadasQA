import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js'; 

const CODIGO = 'pruebaCodigoEdicion';
const DESCRIPCION = 'descEdicion';
const DESCRIPCION_EDIT = 'nuevaDescEdicion';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaParametroProducto1(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Parametro1', 'productos');
        await eliminarRegistroSiExiste(t, '#gridProdParametro1', CODIGO);
        await t
            .click('#gridProdParametro1 .dx-icon.dx-icon-add')
            .typeText('#txtStrIdPParametro1', CODIGO)
            .typeText('#txtProdParametro1_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarProdParametro1 div').withText('Guardar'))
            //se edita
            .click(Selector('#gridProdParametro1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#ProdParametro1_StrDescripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#ProdParametro1_StrDescripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarProdParametro1 div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridProdParametro1 td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridProdParametro1');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroProducto1 - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD ParametroProd1 miERP - Test Hgi360', async t => {
    await ejecutarPruebaParametroProducto1(t, testAdminConfig);
});

fixture `CRUD_ParametroProducto1 - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD ParametroProd1 miERP - Hgi360 Admin', async t => {
    await ejecutarPruebaParametroProducto1(t, hgiAdminConfig);
});
