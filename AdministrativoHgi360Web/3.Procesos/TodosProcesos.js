import {
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Web.js';
import { ejecutarProceso360 } from '../../Funciones/HelpersProcesos360.js';
import { testAdminConfig, hgiAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Cada proceso se ejecuta con su botón: Cartera #ProcesosCarteraContainer_BtnEjecutar,
// Pedidos #ProcesosPedidosContainer_BtnEjecutar e Inventario / Inventario con saldo inicial
// #ProcesosGeneralesContainer_BtnEjecutar (ver Funciones/HelpersProcesos360.js).
const PROCESOS = ['Cartera', 'Pedidos', 'Inventario', 'Inventario con saldo inicial'];

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    for (const proceso of PROCESOS) {
        await ejecutarProceso360(t, proceso);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Procesos - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Procesos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
