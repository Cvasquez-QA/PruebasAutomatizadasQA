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

const CODIGO = 'MiParam4';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaParametroTercero4(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Parametro tercero 4', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridTerParametro4', CODIGO);
        await t
            .click('#gridTerParametro4 .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de el registro
            .typeText('#TerParametro4_StrIdParametro', CODIGO)
            .typeText('#txtTerParametro4_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarTerParametro4 span').withText('Guardar'))
            //El sistema NO permite guardar una Sector sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridTerParametro4 td').withText(CODIGO).exists).ok()
    //Se edita el registro
            .click(Selector('#gridTerParametro4 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de el registro
            .click('#txtTerParametro4_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtTerParametro4_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarTerParametro4 div').withText('Guardar'))
    //Se elimina el registro
            .wait(4000)
            .click('#gridTerParametro4 [class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]')
            .click(Selector('.swal2-actions button').withText('Aceptar'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ParametroTercero4UX - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba PARAMETRO TERCERO 4 testerp CRUD - Test Hgi360', async t => {
    await ejecutarPruebaParametroTercero4(t, testAdminConfig);
});

fixture `CRUD_ParametroTercero4UX - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba PARAMETRO TERCERO 4 Hgi360 Admin CRUD - Hgi360 Admin', async t => {
    await ejecutarPruebaParametroTercero4(t, hgiAdminConfig);
});
