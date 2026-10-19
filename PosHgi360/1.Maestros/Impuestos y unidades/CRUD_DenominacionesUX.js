import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Denominaciones', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridDenominaciones', CODIGO);
        await t
            .click('#gridDenominaciones .dx-icon.dx-icon-add')
            .typeText('#txtDenominaciones_StrIdDenominacion .dx-texteditor-input', CODIGO)
            .typeText('#txtDenominaciones_StrDescripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtDenominaciones_IntValor .dx-texteditor-input', VALOR)
            .click(Selector('#BtnGuardarDenominaciones span').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridDenominaciones td').withText(CODIGO).exists).ok()
            .click(Selector('#gridDenominaciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtDenominaciones_StrDescripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDenominaciones_StrDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarDenominaciones span').withText('Guardar'))
            .wait(2000)
            .expect(Selector('#gridDenominaciones td').withText(DESCRIPCION_EDIT).exists).ok();
        await eliminarRegistroDesdeGrid(t, '#gridDenominaciones');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Denominaciones testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Denominaciones CRUD mierp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Denominaciones testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Denominaciones CRUD mierp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
