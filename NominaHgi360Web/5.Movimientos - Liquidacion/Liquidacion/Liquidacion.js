import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirMovimientos360
} from '../../../Funciones/HelpersHgi360Web.js';
import { elegirEnLista360 } from '../../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Liquidacion (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// consulta la liquidación del empleado de prueba y valida que el grid traiga conceptos.
// Empleado que liquida 4.Procesos/LiquidacionDePeriodo.js (el idEmpleado de la configuración no existe en 8902)
const ID_EMPLEADO = '1000099598';
fixture `Prueba Movimiento Liquidacion Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Movimiento Liquidacion - Test Hgi360', async t => {
    const empleado = ID_EMPLEADO;
    await ingresarAplicacion(t, testNominaConfig);
    await abrirMovimientos360(t, 'Liquidacion');
    await t.expect(Selector('#TxtLiquidacionNom_Empleado').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Movimientos > Liquidacion');

    await elegirEnLista360(t, '#TxtLiquidacionNom_Empleado', empleado, empleado);
    await t.expect(Selector('#gridLiquidacionEmpleado tr.dx-data-row').with({ timeout: 20000 }).exists)
        .ok(`El empleado ${empleado} no tiene liquidación o la aplicación no la cargó`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
