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
    await abrirMaestros360(t, 'Unidades', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridUnidades', CODIGO);
        await t
            .click('#gridUnidades .dx-icon.dx-icon-add')
            .typeText('#txtStrIdUnidad', CODIGO)
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN);
    await t
            .click(Selector('#BtnGuardarUnidad span').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridUnidades td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridUnidades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtUnidad_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_CODIGO_DIAN_EDIT);
    await t
            .click(Selector('#BtnGuardarUnidad div').withText('Guardar'))
        //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridUnidades');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Unidades testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Unidades CRUD miErp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Unidades testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Unidades CRUD miErp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
