import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirHerramientas = es360 ? h.abrirHerramientas360 : h.abrirHerramientas;
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarPestana = es360 && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function validarMenuCausaciones(t, config, { visible, esPos = false }) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');

    if (es360 && !esPos) {
        await t.click(Selector('#ErpSidebarModulos span').withText('Movimientos'));
        const menuCausaciones = Selector('#ErpMenuCardGrid span').withText(/^Causaciones$/i);
        if (visible) {
            await t.expect(menuCausaciones.visible).ok('No está el menú de Causaciones');
        } else {
            await t.expect(menuCausaciones.visible).notOk('Está el menú de Causaciones');
        }
        return;
    }

    const menuMovimiento = esPos ? 'Movimiento' : 'Movimientos';
    await t.click(Selector('a').withText(menuMovimiento));
    const menuCausaciones = Selector('a').withText('CAUSACIONES');
    if (visible) {
        await t.expect(menuCausaciones.visible).ok('No está el menú de Causaciones');
    } else {
        await t.expect(menuCausaciones.visible).notOk('Está el menú de Causaciones');
    }
}

async function validarPermisoCausaciones(t, config, { visible }) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirHerramientas(t, es360 ? 'Permisos X Perfil' : 'PERMISOS X PERFIL');
    await t
        .click('#PermisosPerfil_Perfil .dx-lookup-field')
        .click(Selector('.dx-list-item').withText('01'))
        .wait(3000)
        .click(Selector('.dx-treelist-icon-container div'))
        .wait(1500)
        .click(Selector('.dx-treelist-icon-container').nth(2).find('div').nth(1))
        .wait(1500)
        .click(Selector('.dx-treelist-icon-container').nth(3).find('div').nth(2))
        .wait(1500);
    const permisoCausaciones = Selector('.col-md-3.dx-treelist-cell-expandable').nth(7).find('div').withText('Causaciones');
    if (visible) {
        await t.expect(permisoCausaciones.visible).ok('No está el permiso de Causaciones');
    } else {
        await t.expect(permisoCausaciones.visible).notOk('Está el permiso de Causaciones');
    }
    await t.wait(1500);
}

async function ejecutarPruebaAdmin(t, config, { causacionesVisible }) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await validarMenuCausaciones(t, config, { visible: causacionesVisible });

    if (causacionesVisible) {
        if (es360) {
            await abrirMovimiento(t, 'Causaciones');
        } else {
            await t
                .click(Selector('a').withText('CAUSACIONES'))
                .wait(8000)
                .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
                .wait(1500);
        }
        await t
            .expect(Selector('#ListagridDocumentosCausaciones .dx-button-content').nth(1).visible)
            .ok('No se muestra la grid');
        await t.switchToMainWindow();
        await cerrarPestana(t);
    }

    await validarPermisoCausaciones(t, config, { visible: causacionesVisible });
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

async function ejecutarPruebaPos(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await validarMenuCausaciones(t, config, { visible: false, esPos: true });
    await t.wait(8000);
    await validarPermisoCausaciones(t, config, { visible: false });
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC037 testERP Admin`
    .page(testAdminConfig.pagina);

test('Prueba INC037 menu causaciones movimientos - permisos testerp admin', async t => {
    await ejecutarPruebaAdmin(t, testAdminConfig, { causacionesVisible: true });
});

fixture `Prueba INC037 testHappgi Admin`
    .page(testHappgiAdminConfig.pagina);

test('Prueba INC037 menu causaciones movimientos - permisos testhappgi admin', async t => {
    await ejecutarPruebaAdmin(t, testHappgiAdminConfig, { causacionesVisible: false });
});

fixture `Prueba INC037 testERP POS`
    .page(testPosConfig.pagina);

test('Prueba INC037 menu causaciones movimientos - permisos testerp', async t => {
    await ejecutarPruebaPos(t, testPosConfig);
});

fixture `Prueba INC037 testHappgi Pos`
    .page(testHappgiPosConfig.pagina);

test('Prueba INC037 menu causaciones movimientos - permisos testhappgi', async t => {
    await ejecutarPruebaPos(t, testHappgiPosConfig);
});
