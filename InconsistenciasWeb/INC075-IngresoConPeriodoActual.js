import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/** En Cambiar Periodo la lista de años debe venir en orden descendente (el año actual primero). */
async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await Web.abrirCambioPeriodo360(t);
    const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    await t
        .click('#TxtCambioPeriodo_Anyo .dx-lookup-field')
        .expect(opciones.with({ timeout: 10000 }).count).gte(2, 'La lista de años tiene menos de dos opciones');
    const anno1 = Number((await opciones.nth(0).innerText).trim().split(/\s|-/)[0]);
    const anno2 = Number((await opciones.nth(1).innerText).trim().split(/\s|-/)[0]);
    await t
        .pressKey('esc')
        .expect(anno1).gt(anno2, `Los años NO están en orden descendente (${anno1}, ${anno2})`)
        .pressKey('esc');
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await t
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#TxtCambioPeriodo_Anyo .dx-lookup-field'));
    const anno1Posicion = Number((await Selector('.dx-list-item-content').nth(0).innerText).trim());
    const anno2Posicion = Number((await Selector('.dx-list-item-content').nth(1).innerText).trim());
    await t
        .expect(anno1Posicion).gt(anno2Posicion, 'Los años NO están en orden descendente')
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC075 Ingreso con Periodo Actual Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC075 Ingreso con Periodo Actual Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba INC075 Ingreso con Periodo Actual Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('INC075 Ingreso con Periodo Actual Happgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});
