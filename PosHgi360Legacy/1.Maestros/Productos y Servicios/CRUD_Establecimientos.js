import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'pruebaCodigoEstablecimiento';
const DESCRIPCION = 'descEstablecimiento';
const DESCRIPCION_EDIT = 'nuevaDescEstablecimiento';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Establecimientos', 'productos');
        await eliminarRegistroSiExiste(t, '#gridEstablecimientos', CODIGO);
        await t
            //se adiciona
            .click('#gridEstablecimientos .dx-icon.dx-icon-add')
            .typeText('#txtStrIdEstablecimiento', CODIGO)
            .typeText('#txtEstablecimientos_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarEstablecimientos span').withText('Guardar'))
            //se edita
            .click(Selector('#gridEstablecimientos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtEstablecimientos_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtEstablecimientos_Descripcion', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarEstablecimientos div').withText('Guardar'))
            //Se valida la actualizacion
            .wait(2000)
            .expect((Selector('#gridEstablecimientos td').withText(DESCRIPCION_EDIT)).exists).ok('no se encontro el registro actualizado')
            //Se elimina
            ;
        await eliminarRegistroDesdeGrid(t, '#gridEstablecimientos');
            //Se cierra sesión
    await cerrarPestana360(t);
        await cerrarSesion360(t);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Establecimientos testErp POS - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Establecimientos', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Establecimientos testErp POS - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Establecimientos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
