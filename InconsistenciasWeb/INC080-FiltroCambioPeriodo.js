import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, testNominaConfig, testHappgiAdminConfig, testHappgiNominaConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/** En Cambiar Periodo, al filtrar los años por "202" no deben quedar años 201x. */
async function ejecutarPrueba360(t, config) {
    const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    const buscador = Selector('.dx-overlay-content').filterVisible().find('input.dx-texteditor-input');
    await Web.ingresarAplicacion(t, config);
    await Web.abrirCambioPeriodo360(t);
    await t
        .click('#TxtCambioPeriodo_Anyo .dx-lookup-field')
        .expect(opciones.with({ timeout: 10000 }).exists).ok('La lista de años está vacía')
        .expect(buscador.exists).ok('La lista de años no tiene buscador')
        .typeText(buscador.nth(0), '202', { replace: true })
        .wait(2000);
    const total = await opciones.count;
    const textos = [];
    for (let i = 0; i < total; i++) {
        textos.push((await opciones.nth(i).innerText).trim());
    }
    await t
        .pressKey('esc')
        .expect(textos.length).gt(0, 'El filtro "202" no dejó ningún año')
        .expect(textos.filter(texto => !texto.includes('202')).join(', ')).eql('', `No se filtra bien, aparecen años que no entran en el filtro: ${textos.join(', ')}`)
        .pressKey('esc');
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await t
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#TxtCambioPeriodo_Anyo .dx-lookup-field'));
    await HelpersHappgi.filtrarPor(t, '202');
    await t
        .expect(Selector('.dx-list-item-content').withText('201').exists).notOk('No se filtra bien, aparecen años que no entran en el filtro')
        .click(Selector('.dx-item-content.dx-list-item-content'))
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `INC080 Filtro Cambio Periodo Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `INC080 Filtro Cambio Periodo Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Nomina - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testNominaConfig);
});

fixture `INC080 Filtro Cambio Periodo Happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Happgi Admin', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});

fixture `INC080 Filtro Cambio Periodo Happgi Nomina`
    .page(testHappgiNominaConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('INC080 Filtro Cambio Periodo Happgi Nomina', async t => {
    await ejecutarPruebaHappgi(t, testHappgiNominaConfig);
});
