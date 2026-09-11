import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js'; 

const CODIGO = 'pruebaCodigoColor';
const DESCRIPCION = 'descColor';
const DESCRIPCION_EDIT = 'nuevaDescColor';
const ORDEN = '87';
const ORDEN_EDIT = '4';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaColores(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Colores', 'productos');
        await eliminarRegistroSiExiste(t, '#gridColores', CODIGO);
                //se adiciona
            await t
            .click('#gridColores .dx-icon.dx-icon-add')
            .typeText('#Colores_StrIdColor', CODIGO)
            .typeText('#txtColores_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtColores_IntOrden .dx-texteditor-input', ORDEN)
            .click('#txtColores_Color .dx-dropdowneditor-icon')
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] [class^="dx-colorview-palette-gradient dx-colorview-palette"]').nth(1))
            .click(Selector('span').withText('Aceptar'))
            .click('#BtnGuardarColores .dx-icon.dx-icon-save')
            //Se valida la creación
            .wait(1500)
            .expect((Selector('#gridColores td').withText(DESCRIPCION)).exists).ok('no se encontro el registro creado')
            //se edita
            .click(Selector('#gridColores [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtColores_StrDescripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtColores_StrDescripcion', DESCRIPCION_EDIT)
            .click('#txtColores_IntOrden .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtColores_IntOrden .dx-texteditor-input', ORDEN_EDIT)
            .click('#BtnGuardarColores .dx-icon.dx-icon-save')
            //Se valida la actualizacion
            .expect((Selector('#gridColores td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridColores');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Colores - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Colors mierp - Test Hgi360', async t => {
    await ejecutarPruebaColores(t, testAdminConfig);
});

fixture `CRUD_Colores - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Colors mierp - Hgi360 Admin', async t => {
    await ejecutarPruebaColores(t, hgiAdminConfig);
});
