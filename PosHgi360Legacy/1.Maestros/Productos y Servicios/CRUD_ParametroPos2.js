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

const CODIGO = 'pruebaCodigoParametro2';
const DESCRIPCION = 'descParametro2';
const DESCRIPCION_EDIT = 'nuevaDescParametro2';

async function ejecutarPruebaParametro2(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'ParametroPos2', 'productos');
    await eliminarRegistroSiExiste(t, '#gridPOSParametro2', CODIGO);
    await t
        .click('#gridPOSParametro2 .dx-icon.dx-icon-add')
        .typeText('#POSParametro2_StrIdParametro', CODIGO)
        .typeText('#txtPOSParametro2_StrDescripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#BtnGuardarPOSParametro2 div').withText('Guardar'))
        .wait(2000)
        .click(Selector('#gridPOSParametro2 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtPOSParametro2_StrDescripcion')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPOSParametro2_StrDescripcion', DESCRIPCION_EDIT)
        .click(Selector('#BtnGuardarPOSParametro2 div').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#gridPOSParametro2 td').withText(DESCRIPCION_EDIT).exists).ok('no se encontro el registro actualizado');
    await eliminarRegistroDesdeGrid(t, '#gridPOSParametro2');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `CRUD_ParametroPos2 - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Parametro2 POS - Test Hgi360', async t => {
    await ejecutarPruebaParametro2(t, testPosConfig);
});

fixture `CRUD_ParametroPos2 - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Parametro2 POS - Hgi360 Pos', async t => {
    await ejecutarPruebaParametro2(t, hgiPosConfig);
});
