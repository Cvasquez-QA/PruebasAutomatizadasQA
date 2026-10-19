import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Zonas', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridZonas', CODIGO);
        await t
            .click(Selector('#gridZonas .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación
            .typeText('#txtZona_Codigofocus', CODIGO)
            .typeText('#txtZona_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarZona div').withText('Guardar'))
        //Se valida su creación
            .wait(4000)
            .expect(Selector('#gridZonas td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridZonas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtZona_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')        
            .typeText('#txtZona_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#BtnActualizarZona .dx-icon.dx-icon-save')
        //Se elimina
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridZonas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Zonas testrp admin - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Zonas miErp CRUD ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Zonas testrp admin - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Zonas miErp CRUD ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
