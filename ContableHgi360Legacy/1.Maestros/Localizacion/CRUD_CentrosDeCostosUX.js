import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiCentroCosto';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaCentrosDeCostos(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Centros De Costo');
        await eliminarRegistroSiExiste(t, '#gridCentrosCostos', CODIGO);
        await t
            .click('#gridCentrosCostos .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Sucursal
            .typeText('#txtCentroCosto_Codigofocus', CODIGO)
            .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtCentroCosto_Estado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarCentroCosto span').withText('Guardar'))
            //El sistema NO permite guardar una Sucursal sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridCentrosCostos td').withText(CODIGO).exists).ok()
    //Se edita la Sucursal
            .click(Selector('#gridCentrosCostos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de la Sucursal
            .click('#txtCentroCosto_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarCentroCosto div').withText('Guardar'))
    //Se elimina la Sucursal
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCentrosCostos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_CentrosDeCostosUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CENTROS DE COSTO Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaCentrosDeCostos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_CentrosDeCostosUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CENTROS DE COSTO Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaCentrosDeCostos(t, testContableConfig, ingresarAplicacion);
});
