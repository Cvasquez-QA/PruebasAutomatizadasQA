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


async function ejecutarPruebaParametroProducto4(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro4');
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

fixture `CRUD_ParametroProducto4 - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ParametroProd4 Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaParametroProducto4(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroProducto4 - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ParametroProd4 Mi Contable - Test Contable', async t => {
    await ejecutarPruebaParametroProducto4(t, testContableConfig, ingresarAplicacion);
});
