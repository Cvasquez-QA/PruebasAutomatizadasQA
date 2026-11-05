import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirProcesos360,
    elegirEnLookup360
} from '../../Funciones/HelpersHgi360Web.js';
import { elegirRegistro360, validarAviso360 } from '../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Procesos > Liquidación de Periodo (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// liquida el periodo actual para el empleado de prueba y valida "Proceso Finalizado".
const BANCO = 'BANCOLOMBIA';
const FORMA_PAGO = 'Transferencia';
const ID_EMPLEADO = '1000099598';

fixture `Prueba Proceso Liquidacion de Periodo Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Proceso Liquidacion de Periodo - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirProcesos360(t, 'Liquidación de Periodo');
    await t.expect(Selector('#txtMaestroLiquidarPeriodo_Banco').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Procesos > Liquidación de Periodo');

    await elegirEnLookup360(t, '#txtMaestroLiquidarPeriodo_Banco', BANCO, BANCO);
    await elegirEnLookup360(t, '#txtMaestroLiquidarPeriodo_FormaDePago', FORMA_PAGO);
    await elegirRegistro360(t, '#txtMaestroLiquidarPeriodo_Empleado', ID_EMPLEADO);

    await t.click(Selector('#BtnLiquidarPeriodo').filterVisible());
    // "Liquidando periodo..." tarda más de un minuto en test.hgi360.com
    await validarAviso360(t, /proceso finalizado/i, 'No se realizó la liquidación del periodo correctamente', 240000);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
