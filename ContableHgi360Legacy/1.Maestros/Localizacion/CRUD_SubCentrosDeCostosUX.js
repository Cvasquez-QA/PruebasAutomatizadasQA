import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiSubCC';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaSubCentrosDeCostos(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Subcentros De Costo');
        await eliminarRegistroSiExiste(t, '#gridSubCentrosCostos', CODIGO);
        await t
            .click('#gridSubCentrosCostos .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Sucursal
            .typeText('#txtSubCentroCosto_Codigofocus', CODIGO)
            .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtSubCentroCosto_Estado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarSubCentroCosto span').withText('Guardar'))
            //El sistema NO permite guardar una Sucursal sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridSubCentrosCostos td').withText(CODIGO).exists).ok()
    //Se edita la Sucursal
            .click(Selector('#gridSubCentrosCostos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de la Sucursal
            .click('#txtSubCentroCosto_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarSubCentroCosto div').withText('Guardar'))
    //Se elimina la Sucursal
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridSubCentrosCostos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_SubCentrosDeCostosUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba SUBCENTROS DE COSTO Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaSubCentrosDeCostos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_SubCentrosDeCostosUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba SUBCENTROS DE COSTO Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaSubCentrosDeCostos(t, testContableConfig, ingresarAplicacion);
});
