import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'pruebaCodigoEdicion';
const DESCRIPCION = 'descEdicion';
const DESCRIPCION_EDIT = 'nuevaDescEdicion';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaParametroProducto1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro1');
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

fixture `CRUD_ParametroProducto1 - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ParametroProd1 Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaParametroProducto1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroProducto1 - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ParametroProd1 Mi Contable - Test Contable', async t => {
    await ejecutarPruebaParametroProducto1(t, testContableConfig, ingresarAplicacion);
});
