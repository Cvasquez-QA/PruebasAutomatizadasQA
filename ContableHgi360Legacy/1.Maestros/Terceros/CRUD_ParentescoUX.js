import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiParentesco';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaParentesco(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parentesco');
        await eliminarRegistroSiExiste(t, '#gridParentesco', CODIGO);
        await t
            .click('#gridParentesco .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#Parentesco_StrIdParentesco', CODIGO)
            .typeText('#txtParentesco_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarParentesco span').withText('Guardar'))
            
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridParentesco td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridParentesco [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtParentesco_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParentesco_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarParentesco div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridParentesco');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParentescoUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba PARENTESCO Test Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaParentesco(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParentescoUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba PARENTESCO Test Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaParentesco(t, testContableConfig, ingresarAplicacion);
});
