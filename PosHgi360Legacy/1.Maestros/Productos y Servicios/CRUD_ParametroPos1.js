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

const CODIGO = 'pruebaCodigoParametro1';
const DESCRIPCION = 'descParametro1';
const DESCRIPCION_EDIT = 'nuevaDescParametro1';

async function ejecutarPruebaParametro1(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'ParametroPos1', 'productos');
    await eliminarRegistroSiExiste(t, '#gridPOSParametro1', CODIGO);
    await t
        .wait(2000)
        .click('#gridPOSParametro1 .dx-icon.dx-icon-add')
        .typeText('#POSParametro1_StrIdParametro', CODIGO)
        .typeText('#txtPOSParametro1_StrDescripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#BtnGuardarPOSParametro1 div').withText('Guardar'))
        .wait(2000)
        .click(Selector('#gridPOSParametro1 [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtPOSParametro1_StrDescripcion')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtPOSParametro1_StrDescripcion', DESCRIPCION_EDIT)
        .click(Selector('#BtnGuardarPOSParametro1 div').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#gridPOSParametro1 td').withText(DESCRIPCION_EDIT).exists).ok('no se encontro el registro actualizado');
    await eliminarRegistroDesdeGrid(t, '#gridPOSParametro1');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `CRUD_ParametroPos1 - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Parametro1 POS - Test Hgi360', async t => {
    await ejecutarPruebaParametro1(t, testPosConfig);
});

fixture `CRUD_ParametroPos1 - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Parametro1 POS - Hgi360 Pos', async t => {
    await ejecutarPruebaParametro1(t, hgiPosConfig);
});
