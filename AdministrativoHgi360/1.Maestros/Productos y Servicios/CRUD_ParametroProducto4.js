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

async function ejecutarPruebaParametroProducto4(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Parametro4', 'productos');
        await eliminarRegistroSiExiste(t, '#gridProdParametro4', CODIGO);
        await t
            .click('#gridProdParametro4 .dx-icon.dx-icon-add')
            .typeText('#txtStrIdPParametro4', CODIGO)
            .typeText('#txtProdParametro4_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarProdParametro4 div').withText('Guardar'))
            //se edita
            .click(Selector('#gridProdParametro4 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtProdParametro4_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtProdParametro4_Descripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarProdParametro4 div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridProdParametro4 td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridProdParametro4');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroProducto4 - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD ParametroProd4 miERP - Test Hgi360', async t => {
    await ejecutarPruebaParametroProducto4(t, testAdminConfig);
});

fixture `CRUD_ParametroProducto4 - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD ParametroProd4 miERP - Hgi360 Admin', async t => {
    await ejecutarPruebaParametroProducto4(t, hgiAdminConfig);
});
