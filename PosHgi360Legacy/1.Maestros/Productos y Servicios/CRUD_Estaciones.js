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

const CODIGO = 'pruebaCodigoEstacion';
const DESCRIPCION = 'descEstacion';
const DESCRIPCION_EDIT = 'nuevaDescEstacion';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Estaciones', 'productos');
        await eliminarRegistroSiExiste(t, '#gridEstaciones', CODIGO);
        await t
            .click('#gridEstacionesPos .dx-icon.dx-icon-add')
            //Se ingresan los datos para agregar el registro
            .typeText('#EstacionesPos_StrIdEstacion', '111213')
            .typeText('#txtEstacionesPos_StrDescripcion .dx-texteditor-input', 'descPruebaEstacion')
            .typeText('#txtEstacionesPos_StrSerial .dx-texteditor-input', '123123123')
            .typeText('#txtEstacionesPos_StrUbicacion .dx-texteditor-input', 'cra123')
            .click('#txtEstacionesPos_StrEstablecimiento .dx-lookup-field')
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - General').nth(8))
            .click(Selector('#BtnGuardarEstacionesPos span').withText('Guardar'))
            //.click(Selector('button').withText('Aceptar'))
            .wait(2000)
            //Se edita el registro
            .click(Selector('#gridEstacionesPos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#EstacionesPos_StrDescripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#EstacionesPos_StrDescripcion', 'nuevaDescPruebaEstacion')
            .click('#BtnGuardarEstacionesPos .dx-icon.dx-icon-save')
            //.click(Selector('button').withText('Aceptar'))
            //se valida la actualizacion
            .wait(1500)
            .expect((Selector('#gridEstacionesPos td').withText('nuevaDescPruebaEstacion')).exists).ok('no se encontro el registro actualizado')
            //se elimina el registro
            ;
        await eliminarRegistroDesdeGrid(t, '#gridEstacionesPos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Estaciones testERP POS - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Estaciones miErp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Estaciones testERP POS - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Estaciones miErp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
