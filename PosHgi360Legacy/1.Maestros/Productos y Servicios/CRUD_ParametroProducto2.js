import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'pruebaCodigoEdicion';
const DESCRIPCION = 'descEdicion';
const DESCRIPCION_EDIT = 'nuevaDescEdicion';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaParametroProducto2(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'PP2', 'productos');
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

fixture `CRUD_ParametroProducto2 - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD ParametroProd2 miERP - Test Hgi360', async t => {
    await ejecutarPruebaParametroProducto2(t, testPosConfig);
});

fixture `CRUD_ParametroProducto2 - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD ParametroProd2 miERP - Hgi360 Pos', async t => {
    await ejecutarPruebaParametroProducto2(t, hgiPosConfig);
});
