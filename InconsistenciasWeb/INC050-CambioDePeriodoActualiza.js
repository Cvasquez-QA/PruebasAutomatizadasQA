import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { hgiPosConfig, offPosConfig, testAdminConfig, testHappgiAdminConfig, testHappgiPosConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * Con el maestro Terceros abierto se cambia de periodo: la aplicación debe recargar y cerrar la pestaña abierta.
 * Se usa el periodo anterior al actual y al final se deja el periodo original.
 */
async function ejecutarPrueba360(t, config) {
    const gridTerceros = Selector('[data-testid="gridTerceros"]').filterVisible();
    await Web.ingresarAplicacion(t, config);
    await Web.abrirMaestros360(t, 'Terceros', 'terceros');
    await t.expect(gridTerceros.with({ timeout: 30000 }).exists).ok('No abrió el maestro Terceros');

    const original = await Web.leerPeriodoEncabezado360(t);
    await Web.abrirCambioPeriodo360(t);
    const numero = parseInt(original.periodo, 10);
    const otro = numero > 1 ? numero - 1 : numero + 1;
    await Web.guardarPeriodo360(t, otro);

    try {
        await t.expect(gridTerceros.with({ timeout: 15000 }).exists).notOk('No se refrescó la página al cambiar de periodo');
    } finally {
        await Web.abrirCambioPeriodo360(t);
        await Web.guardarPeriodo360(t, original.periodo, original.anio);
    }
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi / offline (legacy) ----------------------------- */

async function ingresarAplicacionOffline(t, config) {
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .wait(2000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
}

async function ejecutarPrueba(t, config, ingresar = HelpersHappgi.ingresarAplicacion) {
    await ingresar(t, config);
    await HelpersHappgi.abrirMaestros(t, 'Terceros');
    await t
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(8000)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/).filterVisible())
        .wait(1500)
        .click(Selector('#TxtCambioPeriodo_Periodo .dx-lookup-field'))
        .wait(1500)
        .click(Selector('.dx-item.dx-list-item div'))
        .click(Selector('#BtnGuardarCambioPeriodo div').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(7000)
        .switchToMainWindow()
        .expect(Selector('dx-item-content dx-tab-content').visible)
        .notOk('No se referescó la pagina al cambiar de periodo');
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba validacion recarga pagina Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba validacion recarga pagina happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testhappgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba validacion recarga pagina Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});

fixture `Prueba validacion recarga pagina Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo Pos - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba validacion recarga pagina testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo testhappgi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});

fixture `Prueba validacion recarga pagina offline Pos`
    .page(offPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('validacion recarga pagina luego de cambiar periodo offline Pos', async t => {
    await ejecutarPrueba(t, offPosConfig, ingresarAplicacionOffline);
});
