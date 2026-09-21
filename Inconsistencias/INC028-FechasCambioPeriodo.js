import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { miHappgiAdminConfig } from '../../ParametrosPruebas/MiHappgiAdmin8893.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
};

const esMiHappgi = (config) => String(config?.pagina || '').toLowerCase().includes('mi.happgi');

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await t
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500);
    await t.click(Selector('#TxtCambioPeriodo_Anyo .dx-lookup-field'));
    const anno1Posicion = Number((await Selector('.dx-list-item-content').nth(0).innerText).trim());
    const anno2Posicion = Number((await Selector('.dx-list-item-content').nth(1).innerText).trim());
    await t.expect(anno1Posicion).gt(anno2Posicion, 'Los años NO están en orden descendente');
    await t.click(Selector('#TxtCambioPeriodo_Periodo .dx-lookup-field'));
    const periodo1Posicion = Number((await Selector('.dx-list-item-content').nth(0).innerText).trim());
    const periodo2Posicion = Number((await Selector('.dx-list-item-content').nth(1).innerText).trim());
    await t.expect(periodo1Posicion).gt(periodo2Posicion, 'Los periodos NO están en orden descendente');
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba fechas Admin testerp`
    .page(testAdminConfig.pagina);

test('Prueba fechas Admin testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba fechas admin Hgi360`
    .page(hgi360AdminConfig.pagina);

test('Prueba fechas Admin Hgi360', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba fechas Admin testhappgi`
    .page(testHappgiAdminConfig.pagina);

test('Prueba fechas Admin testerp', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba fechas  Admin testerp`
    .page(miHappgiAdminConfig.pagina);

test('Prueba fechas Admin testerp', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});
