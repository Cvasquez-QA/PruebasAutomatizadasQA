import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { abrirMaestros360, cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { hgiPosConfig, testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/** Hgi360 (ERP web): al editar un tercero se muestra su información general (Tipo de identificación). */
async function ejecutarPrueba360(t, config) {
    const grid = Selector('[data-testid="gridTerceros"]').filterVisible();
    await ingresarAplicacion360(t, config);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .expect(grid.find('[aria-label="Editar"]').with({ timeout: 30000 }).exists).ok('No cargó el maestro Terceros')
        .click(grid.find('[aria-label="Editar"]').nth(0))
        .expect(Selector('#txtTercero_Tipo_Id .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se muestra la info general del tercero');
    const cancelar = Selector('[id^="BtnCancelarTercero"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarSesion360(t);
}

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMaestros(t, 'Terceros');
    await t
        .wait(2000)
        .click(Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000)
        .expect(Selector('#txtTercero_Tipo_Id .dx-lookup-field').visible).ok('No se muestra la info general del tercero')
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba Terceros ERP Hgi360 POS`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Terceros Hgi360 POS', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});

fixture `Prueba Terceros ERP POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Terceros POS - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba Terceros ERP testHappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba Terceros testHappgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig);
});
