import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { abrirProcesos360, cerrarPestana360, cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig, testAdminConfig, testHappgiAdminConfig, hgiPosConfig, testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

const dialogo360 = Selector('.swal2-popup').filterVisible();
const confirmar360 = Selector('button.swal2-confirm').filterVisible();
const toastError360 = Selector('.erp-toast[data-type="error"]').filterVisible();

/**
 * Abre el proceso y acepta los avisos que muestre (validaciones y confirmación).
 * Falla si el proceso no muestra ningún mensaje o si termina con un error.
 */
async function ejecutarProceso360(t, nombre, esperaMs = 30000) {
    await abrirProcesos360(t, nombre);
    // Pantalla del proceso: "Listo para ejecutar" + botón «Ejecutar proceso» (revisado el 26-oct-2026)
    const btnEjecutar = Selector('button, .dx-button').filterVisible().withText('Ejecutar proceso');
    if (await btnEjecutar.with({ timeout: 15000 }).exists) {
        await t.click(btnEjecutar.nth(0));
    }
    // El resultado sale en un aviso dentro de la pantalla ("Proceso completado — ..." o "Proceso finalizado con
    // novedades — ..." con la tabla de novedades) y el botón pasa a «Ejecutar de nuevo»
    const completado = Selector('div, span, p').filterVisible().withText(/^\s*Proceso (completado|finalizado)/);
    const fallido = Selector('div, span, p').filterVisible().withText(/^\s*Proceso (con error|fallido|no completado)/i);
    const inicio = Date.now();
    let avisos = 0;
    while (Date.now() - inicio < esperaMs) {
        if (await toastError360.exists || await fallido.exists) {
            const error = await toastError360.exists ? toastError360 : fallido;
            await t.expect(false).ok(`El proceso ${nombre} terminó con error: ${(await error.nth(0).innerText).replace(/\s+/g, ' ').trim()}`);
        }
        if (await dialogo360.exists && avisos < 5) {
            await t.click(confirmar360).wait(2000);
            avisos++;
            continue;
        }
        if (await completado.exists) {
            break;
        }
        await t.wait(1000);
    }
    await t.expect(completado.exists).ok(`El proceso ${nombre} no mostró el resultado ("Proceso completado" / "Proceso finalizado")`);
    await cerrarPestana360(t);
}

async function ejecutarPruebaAdmin360(t, config) {
    await ingresarAplicacion360(t, config);
    await ejecutarProceso360(t, 'Cartera');
    await ejecutarProceso360(t, 'Pedidos');
    await ejecutarProceso360(t, 'Inventario');
    await ejecutarProceso360(t, 'Inventario con saldo inicial');
    await cerrarSesion360(t);
}

async function ejecutarPruebaPos360(t, config) {
    await ingresarAplicacion360(t, config);
    await ejecutarProceso360(t, 'Inventario');
    await ejecutarProceso360(t, 'Inventario con saldo inicial');
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

const mensajeValidacion = Selector('#lblValidacion');
const btnAceptarValidacion = Selector('#ModalValidaciones button').withText('Aceptar');

async function aceptarValidacionesSiExisten(t) {
    if (await mensajeValidacion.visible) {
        await t.click(btnAceptarValidacion).wait(1500);
    }
    if (await mensajeValidacion.visible) {
        await t.click(btnAceptarValidacion).wait(1500);
    }
}

async function ejecutarInventarioHappgi(t, nombre, esperaMs) {
    await t.switchToMainWindow();
    await HelpersHappgi.abrirProcesos(t, nombre);
    await t.wait(esperaMs);
    await aceptarValidacionesSiExisten(t);
    await HelpersHgi360.confirmarProceso(t);
}

async function ejecutarPruebaAdminHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);

    await t.switchToMainWindow();
    await HelpersHappgi.abrirProcesos(t, 'Cartera');
    await t.wait(6000);
    await HelpersHgi360.confirmarProceso(t);

    await t.wait(4000);
    await ejecutarInventarioHappgi(t, 'Inventario', 4000);
    await ejecutarInventarioHappgi(t, 'Inventario con saldo inicial', 4000);

    await t.switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

async function ejecutarPruebaPosHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await ejecutarInventarioHappgi(t, 'Inventario', 4000);
    await ejecutarInventarioHappgi(t, 'Inventario con saldo inicial', 4000);
    await t.switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba Procesos - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos - Test Hgi360 Admin', async t => {
    await ejecutarPruebaAdmin360(t, testAdminConfig);
});

fixture `Prueba Procesos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos - Hgi360 Admin', async t => {
    await ejecutarPruebaAdmin360(t, hgiAdminConfig);
});

fixture `Prueba Procesos testHappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos testHappgi', async t => {
    await ejecutarPruebaAdminHappgi(t, testHappgiAdminConfig);
});

fixture `Prueba Procesos - Test Hgi360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos - Test Hgi360 Pos', async t => {
    await ejecutarPruebaPos360(t, testPosWebConfig);
});

fixture `Prueba Procesos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos - Hgi360 Pos', async t => {
    await ejecutarPruebaPos360(t, hgiPosConfig);
});

fixture `Prueba Procesos testHappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos testHappgi', async t => {
    await ejecutarPruebaPosHappgi(t, testHappgiPosConfig);
});
