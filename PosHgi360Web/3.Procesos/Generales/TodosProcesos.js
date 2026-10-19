import {
    cerrarSesion360,
    abrirProcesos360,
    aceptarValidacionesSiExisten,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Procesos del módulo POS (test.hgi360.com, AutPos). En el menú Procesos del POS están:
// Inventario, Inventario con saldo inicial y Cartera (no hay Pedidos).
// Cada proceso pide confirmación y puede mostrar validaciones: se aceptan con button.swal2-confirm.
const PROCESOS = [
    { nombre: 'Cartera', espera: 15000 },
    { nombre: 'Inventario con saldo inicial', espera: 15000 },
    { nombre: 'Inventario', espera: 5000 }
];

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    for (const proceso of PROCESOS) {
        await abrirProcesos360(t, proceso.nombre);
        await t.wait(3000);
        await aceptarValidacionesSiExisten(t);
        await t.wait(proceso.espera);
        await aceptarValidacionesSiExisten(t);
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
