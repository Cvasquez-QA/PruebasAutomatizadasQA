import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
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
    await cerrarSesion(t);
}

fixture `Prueba INC075 Ingreso con Periodo Actual HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC075 Ingreso con Periodo Actual HGI360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC075 Ingreso con Periodo Actual Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC075 Ingreso con Periodo Actual Happgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});
