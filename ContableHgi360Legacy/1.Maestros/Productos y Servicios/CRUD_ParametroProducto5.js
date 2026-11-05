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


async function ejecutarPruebaParametroProducto5(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro5');
        await eliminarRegistroSiExiste(t, '#gridProdParametro5', CODIGO);
        await t
            .click('#gridProdParametro5 .dx-icon.dx-icon-add')
            .typeText('#txtStrIdPParametro5', CODIGO)
            .typeText('#txtProdParametro5_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarProdParametro5 div').withText('Guardar'))
            //se edita
            .click(Selector('#gridProdParametro5 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtProdParametro5_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtProdParametro5_Descripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarProdParametro5 div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridProdParametro5 td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridProdParametro5');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroProducto5 - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD ParametroProd5 Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaParametroProducto5(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroProducto5 - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD ParametroProd5 Mi Contable - Test Contable', async t => {
    await ejecutarPruebaParametroProducto5(t, testContableConfig, ingresarAplicacion);
});
