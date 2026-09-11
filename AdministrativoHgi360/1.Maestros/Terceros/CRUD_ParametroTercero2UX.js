import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MiParam2';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaParametroTercero2(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Parametro tercero 2', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridTerParametro2', CODIGO);
        await t
            .click('#gridTerParametro2 .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#TerParametro2_StrIdParametro', CODIGO)
            .typeText('#txtTerParametro2_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTerParametro2 span').withText('Guardar'))
            //El sistema NO permite guardar una Sector sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridTerParametro2 td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridTerParametro2 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtTerParametro2_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTerParametro2_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarTerParametro2 div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000)
            .click('#gridTerParametro2 [class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]')
            .click(Selector('.swal2-actions button').withText('Aceptar'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroTercero2UX - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba PARAMETRO TERCERO 2 testerp CRUD - Test Hgi360', async t => {
    await ejecutarPruebaParametroTercero2(t, testAdminConfig);
});

fixture `CRUD_ParametroTercero2UX - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba PARAMETRO TERCERO 2 Hgi360 Admin CRUD - Hgi360 Admin', async t => {
    await ejecutarPruebaParametroTercero2(t, hgiAdminConfig);
});
