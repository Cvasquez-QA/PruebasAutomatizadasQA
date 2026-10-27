import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, testAdminConfig, miHappgiAdminConfig, testHappgiAdminConfig, hgiPosConfig, testPosConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirHerramientas = es360 ? h.abrirHerramientas360 : h.abrirHerramientas;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
};

const esMiHappgi = (config) => String(config?.pagina || '').toLowerCase().includes('mi.happgi');

async function cambiarModoContable(t) {
    const radio0 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon');
    const radio1 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1);
    const radio2 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(2);

    if (await radio0.hasClass('dx-radiobutton-icon-checked')) {
        await t.click(radio1);
    }
    if (await radio1.hasClass('dx-radiobutton-icon-checked')) {
        await t.click(radio2);
    }
    if (await radio1.hasClass('dx-radiobutton-icon-checked')) {
        await t.click(radio0);
    }
    await t
        .wait(6000)
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .wait(3000)
        .expect(Selector('.swal2-content div').innerText).eql('Registro almacenado correctamente.', 'No se está generando el mensaje de guardado correcto')
        .click(Selector('.swal2-confirm.btn.btn-success'));
}

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

const radiosModo360 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton');
const mensajeGuardado360 = Selector('.swal2-popup, .erp-toast').filterVisible().withText(/Registro almacenado correctamente|actualizad[oa] con [ée]xito|guardad[oa] con [ée]xito/i);

/** Abre Parámetros en edición y deja visible la pestaña que tiene el Modo contable. */
async function editarParametrosModo360(t) {
    await Web.abrirHerramientas360(t, 'Parámetros');
    await t
        .expect(Selector('[id^="tabs_parametros_"]').with({ timeout: 20000 }).exists).ok('No cargó Parámetros')
        .click(Selector('#BtnEditar_btn, #BtnEditar').filterVisible().nth(0))
        .wait(2000);
    if (!await radiosModo360.filterVisible().exists) {
        const pestanas = Selector('[id^="tabs_parametros_"]').filterVisible();
        const total = await pestanas.count;
        for (let i = 0; i < total && !await radiosModo360.filterVisible().exists; i++) {
            await t.click(pestanas.nth(i)).wait(1000);
        }
    }
    await t.expect(radiosModo360.filterVisible().exists).ok('No se encontró el parámetro Modo contable (#TxtPrm_General_IntModoGral)');
}

const indiceModoActual360 = async () => {
    const total = await radiosModo360.count;
    for (let i = 0; i < total; i++) {
        if (await radiosModo360.nth(i).hasClass('dx-radiobutton-checked')) {
            return i;
        }
    }
    return -1;
};

async function guardarModo360(t, indice) {
    await t
        .click(radiosModo360.nth(indice))
        .wait(1500)
        .click(Selector('#BtnGuardar_btn, #BtnGuardar').filterVisible().nth(0))
        .expect(mensajeGuardado360.with({ timeout: 15000 }).exists).ok('No se está generando el mensaje de guardado correcto');
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t.wait(2000);
}

/** Cambia el modo contable, valida el mensaje de guardado y lo deja como estaba. */
async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await editarParametrosModo360(t);
    const original = await indiceModoActual360();
    await t.expect(original).gte(0, 'No hay un modo contable seleccionado');
    const total = await radiosModo360.count;
    const nuevo = (original + 1) % total;
    let cambiado = false;
    try {
        await guardarModo360(t, nuevo);
        cambiado = true;
    } finally {
        if (cambiado) {
            await Web.cerrarPestana360(t);
            await editarParametrosModo360(t);
            await guardarModo360(t, original);
        }
    }
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await abrirHerramientas(t, 'Parámetros');
    await t.click(Selector('#BtnEditar span').withText('Editar')).wait(2000);
    await cambiarModoContable(t);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC047 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba INC047 Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable Hgi360', async t => {
    await ejecutarPrueba360(t, hgiAdminConfig);
});

fixture `Prueba INC047 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable testhappi admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC047 mihappgi Admin`
    .page(miHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable testhappi admin', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});

fixture `Prueba INC047 Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable Pos - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC047 Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});

fixture `Prueba INC047 testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC047 prueba Cambio de Modo Contable testhappi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
