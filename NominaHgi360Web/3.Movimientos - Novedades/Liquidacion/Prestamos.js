import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360, cerrarPestana360 } from '../../../Funciones/HelpersHgi360Web.js';
import { abrirPrestamos360, editarYEliminarPrestamo360 } from '../../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Prestamos - préstamo financiado (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// calcula y adiciona el préstamo financiado, lo edita y lo borra.
const ID_EMPLEADO = '1000099598';
const CONCEPTO = '001';
const OBSERVACION = 'obs1';
const EDITADO = { valor: '5000', cuota: '1', tasa: '20', observacion: 'prueba1' };

fixture `Prueba Prestamo Financiado Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Prestamo Financiado CRUD - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirPrestamos360(t, ID_EMPLEADO, CONCEPTO, [OBSERVACION, EDITADO.observacion]);

    await t
        .click(Selector('#SwitchNomMPrestamos_Tipo').filterVisible())
        .expect(Selector('#txtValorFinanciacionNomMPrestamos').filterVisible().with({ timeout: 10000 }).exists)
        .ok('No se activó el préstamo financiado');
    await llenarCampos(t, [
        { id: 'txtValorFinanciacionNomMPrestamos', valor: '2000' },
        { id: 'txtMesesNomMPrestamos', valor: '2' },
        { id: 'txtInteresFinanciacionNomMPrestamos', valor: '10' },
        { id: 'txtValorMesNomMPrestamos', valor: '2' },
        { id: 'txtObservacionFinNomMPrestamos', valor: OBSERVACION }
    ]);
    await t
        .click(Selector('#btnCalcularNomMPrestamos').filterVisible())
        .wait(2000)
        .click(Selector('#btnAdicionarFinNomMPrestamos').filterVisible())
        .wait(3000);
    await editarYEliminarPrestamo360(t, OBSERVACION, EDITADO);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
