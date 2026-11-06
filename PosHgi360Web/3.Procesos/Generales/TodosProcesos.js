import {
    cerrarSesion360,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Web.js';
import { ejecutarProceso360 } from '../../../Funciones/HelpersProcesos360.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Procesos del módulo POS (test.hgi360.com, AutPos). En el menú Procesos del POS están:
// Inventario, Inventario con saldo inicial y Cartera (no hay Pedidos).
// Cada proceso se ejecuta con su botón: Cartera #ProcesosCarteraContainer_BtnEjecutar e
// Inventario / Inventario con saldo inicial #ProcesosGeneralesContainer_BtnEjecutar.
const PROCESOS = ['Cartera', 'Inventario con saldo inicial', 'Inventario'];

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    for (const proceso of PROCESOS) {
        await ejecutarProceso360(t, proceso);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Procesos testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba ejecucion todos los procesos testerp', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
