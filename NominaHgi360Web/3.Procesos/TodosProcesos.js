import {
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Web.js';
import { ejecutarProceso360 } from '../../Funciones/HelpersProcesos360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Omitida: el menú Procesos del usuario de Nómina solo tiene procesos de nómina (Liquidación de Periodo,
// Prima, Vacaciones, Cesantías...), no Cartera, Pedidos ni Inventario (revisado el 05-nov-2026).
// Los procesos de nómina se prueban en 4.Procesos.
const PROCESOS = ['Cartera', 'Pedidos', 'Inventario', 'Inventario con saldo inicial'];

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    for (const proceso of PROCESOS) {
        await ejecutarProceso360(t, proceso);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Procesos - Test Hgi360`
    .page(testNominaConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test.skip('Prueba ejecucion todos los procesos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig, ingresarAplicacion);
});
