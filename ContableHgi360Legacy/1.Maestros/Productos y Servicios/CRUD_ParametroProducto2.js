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


async function ejecutarPruebaParametroProducto2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro2');
        await eliminarRegistroSiExiste(t, '#gridProdParametro2', CODIGO);
        await t
            .click('#gridProdParametro2 .dx-icon.dx-icon-add')
            .typeText('#txtStrIdPParametro2', CODIGO)
            .typeText('#txtProdParametro2_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarProdParametro2 div').withText('Guardar'))
            //se edita
            .click(Selector('#gridProdParametro2 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtProdParametro2_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtProdParametro2_Descripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarProdParametro2 div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridProdParametro2 td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridProdParametro2');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroProducto2 - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ParametroProd2 Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaParametroProducto2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroProducto2 - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ParametroProd2 Mi Contable - Test Contable', async t => {
    await ejecutarPruebaParametroProducto2(t, testContableConfig, ingresarAplicacion);
});
