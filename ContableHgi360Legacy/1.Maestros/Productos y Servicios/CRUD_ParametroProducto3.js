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


async function ejecutarPruebaParametroProducto3(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro3');
        await eliminarRegistroSiExiste(t, '#gridProdParametro3', CODIGO);
        await t
            .click('#gridProdParametro3 .dx-icon.dx-icon-add')
            .typeText('#txtStrIdPParametro3', CODIGO)
            .typeText('#txtProdParametro3_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarProdParametro3 div').withText('Guardar'))
            //se edita
            .click(Selector('#gridProdParametro3 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtProdParametro3_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtProdParametro3_Descripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarProdParametro3 div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridProdParametro3 td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridProdParametro3');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroProducto3 - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ParametroProd3 Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaParametroProducto3(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroProducto3 - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ParametroProd3 Mi Contable - Test Contable', async t => {
    await ejecutarPruebaParametroProducto3(t, testContableConfig, ingresarAplicacion);
});
