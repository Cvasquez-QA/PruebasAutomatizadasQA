import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiParam3';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaParametroTercero3(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Parametro Tercero 3');
        await eliminarRegistroSiExiste(t, '#gridTerParametro3', CODIGO);
        await t
            .click('#gridTerParametro3 .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#TerParametro3_StrIdParametro', CODIGO)
            .typeText('#txtTerParametro3_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTerParametro3  span').withText('Guardar'))
            //El sistema NO permite guardar una Sector sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridTerParametro3 td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridTerParametro3 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtTerParametro3_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTerParametro3_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarTerParametro3 div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000)
            .click('#gridTerParametro3 [class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]')
            .click(Selector('.swal2-actions button').withText('Aceptar'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroTercero3UX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba PARAMETRO TERCERO 3 Test Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaParametroTercero3(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_ParametroTercero3UX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba PARAMETRO TERCERO 3 Test Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaParametroTercero3(t, testContableConfig, ingresarAplicacion);
});
