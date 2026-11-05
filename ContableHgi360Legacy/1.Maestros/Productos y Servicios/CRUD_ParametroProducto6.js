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


async function ejecutarPruebaParametroProducto6(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro6');
        await eliminarRegistroSiExiste(t, '#gridProdParametro6', CODIGO);
        await t
            .click('#gridProdParametro6 .dx-icon.dx-icon-add')
            .typeText('#txtStrIdPParametro6', CODIGO)
            .typeText('#txtProdParametro6_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarProdParametro6 div').withText('Guardar'))
            //se edita
            .click(Selector('#gridProdParametro6 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtProdParametro6_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtProdParametro6_Descripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarProdParametro6 div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridProdParametro6 td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridProdParametro6');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroProducto6 - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ParametroProd6 Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaParametroProducto6(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroProducto6 - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ParametroProd6 Mi Contable - Test Contable', async t => {
    await ejecutarPruebaParametroProducto6(t, testContableConfig, ingresarAplicacion);
});
