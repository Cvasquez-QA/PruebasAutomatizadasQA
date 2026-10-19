import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    abrirProcesos360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    const botonMensaje = Selector('#ModalValidaciones button').withText('Aceptar');
    const confirmarSwal = Selector('.swal2-confirm.btn.btn-success');

    await abrirProcesos360(t, 'Cartera');
    await t.click(confirmarSwal).wait(1500);
    await t.wait(4000);

    await abrirProcesos360(t, 'Pedidos');
    await t.click(confirmarSwal).wait(1500);
    await t.wait(4000);

    await abrirProcesos360(t, 'Inventario');

    if (await botonMensaje.visible) {
        await t.click(botonMensaje).wait(1500);
    }
    if (await botonMensaje.visible) {
        await t.click(botonMensaje).wait(1500);
    }

    await t.click(confirmarSwal).wait(1500);

    await abrirProcesos360(t, 'Inventario con Saldo Inicial');
    await t.wait(10000);

    if (await botonMensaje.visible) {
        await t.click(botonMensaje).wait(1500);
    }
    if (await botonMensaje.exists) {
        await t.click(botonMensaje).wait(1500);
    }

    await t
        .wait(5000)
        .click(botonMensaje)
        .click(confirmarSwal)
        .wait(1500);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Procesos testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba ejecucion todos los procesos testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Procesos testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba ejecucion todos los procesos testerp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
