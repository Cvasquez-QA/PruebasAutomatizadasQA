import { Selector } from 'testcafe';
import {
    cerrarPestana360,
    cerrarSesion360,
    abrirProcesos360,
    confirmarProceso,
    aceptarValidacionesSiExisten,
    iframeTab,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';


async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    
        // CARTERA
        await abrirProcesos360(t, 'Cartera');
        await t.wait(15000);
        await confirmarProceso(t);
    
        // PEDIDOS
        await abrirProcesos360(t, 'Pedidos');
        await t.wait(5000);
        await confirmarProceso(t);

        // INVENTARIO
        await abrirProcesos360(t, 'Inventario');
        await t.wait(3000);
        await t.click(Selector('#ModalValidaciones button').withText('Aceptar')).wait(1500);
        await t.click(Selector('#ModalValidaciones button').withText('Aceptar')).wait(1500);
        await confirmarProceso(t);
    

        // INVENTARIO CON SALDO INICIAL
        await abrirProcesos360(t, 'Inventario con saldo inicial');
        await t.wait(15000);
        await t.click(Selector('#ModalValidaciones button').withText('Aceptar')).wait(1500);
        await t.click(Selector('#ModalValidaciones button').withText('Aceptar')).wait(1500);
        await confirmarProceso(t);
        await cerrarSesion360(t);
}

fixture `Prueba Procesos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba ejecucion todos los procesos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Procesos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba ejecucion todos los procesos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
