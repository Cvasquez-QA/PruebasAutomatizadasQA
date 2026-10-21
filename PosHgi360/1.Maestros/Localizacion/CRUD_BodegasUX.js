import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    seleccionarOpcion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Bodegas', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridBodegas', CODIGO);
        await t
            .click('#gridBodegas .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la bodega
            .typeText('#txtIdBodegafocus', CODIGO)
            .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtBodega_Direccion .dx-texteditor-input', DIRECCION)
            .typeText('#txtBodega_Telefono .dx-texteditor-input', TELEFONO)
            .click('#txtBodega_Responsable .dx-texteditor-input')
            .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE)
            .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
            //El sistema permite guardar una Bodega sin precio
            .click(Selector('#txtBodega_Estado .dx-radiobutton-icon').nth(2))
            .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
        //Se valida la creación 
            .wait(4000)
            .expect(Selector('#gridBodegas td').withText(CODIGO).exists).ok()
        //Se edita la bodega
            .click(Selector('#gridBodegas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtBodega_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtBodega_Responsable .dx-texteditor-input')     
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE_EDIT)
            .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, LISTA_PRECIOS);
    await t
            .click('#txtBodega_Estado .dx-radiobutton-icon')
            .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
        //Se elimina la bodega
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridBodegas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Bodegas testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Bodegas miErp CRUD ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Bodegas testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Bodegas miErp CRUD ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
