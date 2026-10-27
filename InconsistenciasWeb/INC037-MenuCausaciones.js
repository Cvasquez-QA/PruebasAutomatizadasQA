import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testHappgiAdminConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

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

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/** Busca "Causaciones" en el árbol de Permisos x perfil (perfil 01): con el buscador o expandiendo los nodos. */
async function permisoCausacionesExiste360(t) {
    await Web.abrirHerramientas360(t, 'Permisos x perfil');
    await Web.elegirEnLookup360(t, '#PermisosPerfil_Perfil', '01');
    const arbol = Selector('.dx-treelist').filterVisible();
    await t.expect(arbol.with({ timeout: 20000 }).exists).ok('No cargó el árbol de permisos del perfil');
    const buscar = arbol.find('.dx-treelist-search-panel .dx-texteditor-input, .dx-datagrid-search-panel .dx-texteditor-input');
    if (await buscar.exists) {
        await t.typeText(buscar, 'Causaciones', { replace: true }).wait(2500);
    } else {
        // Expandir todo el árbol cuelga el navegador (corrida del 26-oct-2026): solo los primeros niveles
        for (let i = 0; i < 15; i++) {
            const cerrado = arbol.find('.dx-treelist-collapsed').filterVisible();
            if (!await cerrado.exists) {
                break;
            }
            await t.click(cerrado.nth(0)).wait(400);
        }
    }
    const existe = await arbol.find('td').filterVisible().withExactText('Causaciones').exists;
    await Web.cerrarPestana360(t);
    return existe;
}

async function ejecutarPruebaAdmin360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await t.click(Selector('#ErpSidebarModulos span').withText('Movimientos'));
    await t.expect(Selector('#ErpMenuCardGrid .erp-menu-child-text').withText(/^\s*Causaciones\s*$/i).with({ timeout: 15000 }).exists)
        .ok('No está el menú de Causaciones');
    await Web.abrirMovimientos360(t, 'Causaciones');
    await t.expect(Selector('[data-testid="ListagridDocumentosCausaciones"], #ListagridDocumentosCausaciones').with({ timeout: 20000 }).exists)
        .ok('No se muestra la grid de Causaciones');
    await Web.cerrarPestana360(t);
    await t.expect(await permisoCausacionesExiste360(t)).ok('No está el permiso de Causaciones');
    await Web.cerrarSesion360(t);
}

async function ejecutarPruebaPos360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await t.click(Selector('#ErpSidebarModulos span').withText('Movimientos'));
    await t
        .expect(Selector('#ErpMenuCardGrid .erp-menu-child-text').with({ timeout: 15000 }).exists).ok('No cargó el menú de Movimientos')
        .expect(Selector('#ErpMenuCardGrid .erp-menu-child-text').withText(/^\s*Causaciones\s*$/i).exists)
        .notOk('Está el menú de Causaciones en POS');
    await t.expect(await permisoCausacionesExiste360(t)).notOk('Está el permiso de Causaciones en POS');
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

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

    await t.click(Selector('a').withText('Movimientos'));
    const menuCausaciones = Selector('a').withText('Causaciones');
    if (visible) {
        await t.expect(menuCausaciones.visible).ok('No está el menú de Causaciones');
    } else {
        await t.expect(menuCausaciones.visible).notOk('Está el menú de Causaciones');
    }
}

async function validarPermisoCausaciones(t, config, { visible }) {
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirHerramientas(t, 'Permisos x perfil');
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
        await abrirMovimiento(t, 'Causaciones');
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

fixture `Prueba INC037 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC037 menu causaciones movimientos - permisos Admin - Test Hgi360', async t => {
    await ejecutarPruebaAdmin360(t, testAdminConfig);
});

fixture `Prueba INC037 testHappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC037 menu causaciones movimientos - permisos testhappgi admin', async t => {
    await ejecutarPruebaAdmin(t, testHappgiAdminConfig, { causacionesVisible: false });
});

fixture `Prueba INC037 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC037 menu causaciones movimientos - permisos POS - Test Hgi360', async t => {
    await ejecutarPruebaPos360(t, testPosWebConfig);
});

fixture `Prueba INC037 testHappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC037 menu causaciones movimientos - permisos testhappgi', async t => {
    await ejecutarPruebaPos(t, testHappgiPosConfig);
});
