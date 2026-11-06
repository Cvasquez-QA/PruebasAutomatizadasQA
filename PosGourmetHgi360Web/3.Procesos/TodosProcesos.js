import {
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Web.js';
import { ejecutarProceso360 } from '../../Funciones/HelpersProcesos360.js';
import { testGourmetConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// En el menú Procesos de POS Gourmet solo están Inventario e Inventario con saldo inicial (revisado el 05-nov-2026).
// Se ejecutan con #ProcesosGeneralesContainer_BtnEjecutar (ver Funciones/HelpersProcesos360.js).
const PROCESOS = ['Inventario', 'Inventario con saldo inicial'];

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    for (const proceso of PROCESOS) {
        await ejecutarProceso360(t, proceso);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Procesos - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba ejecucion todos los procesos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testGourmetConfig, ingresarAplicacion);
});
