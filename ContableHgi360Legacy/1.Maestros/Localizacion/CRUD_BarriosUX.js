import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MIBARRIO';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaBarrios(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Barrios');
        await eliminarRegistroSiExiste(t, '#gridBarrios', CODIGO);
        await t
            .click('#gridBarrios .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la Barrio
            .typeText('#txtBarrio_Codigofocus', CODIGO)
            .typeText('#txtBarrio_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarBarrio span').withText('Guardar'))
            //El sistema NO permite guardar una Barrio sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridBarrios td').withText(CODIGO).exists).ok()
    //Se edita la Barrio
            .click(Selector('#gridBarrios [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de la Barrio
            .click('#txtBarrio_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBarrio_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarBarrio div').withText('Guardar'))
    //Se elimina la Barrio
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridBarrios');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_BarriosUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba BARRIOS Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaBarrios(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_BarriosUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba BARRIOS Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaBarrios(t, testContableConfig, ingresarAplicacion);
});
