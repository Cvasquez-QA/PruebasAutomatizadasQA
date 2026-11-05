import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360, cerrarPestana360 } from '../../../Funciones/HelpersHgi360Web.js';
import { abrirPrestamos360, editarYEliminarPrestamo360 } from '../../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Prestamos - préstamo normal (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// crea el préstamo, lo edita y lo borra.
const ID_EMPLEADO = '1000099598';
const CONCEPTO = '001';
const OBSERVACION = 'pruebaPrestamoNormal';
const EDITADO = { valor: '5000', cuota: '1', tasa: '20', observacion: 'prueba1' };

fixture `Prueba Prestamo Normal Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Prestamo Normal CRUD - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirPrestamos360(t, ID_EMPLEADO, CONCEPTO, [OBSERVACION, EDITADO.observacion]);

    await llenarCampos(t, [
        { id: 'txtValorNomMPrestamos', valor: '1000' },
        { id: 'txtCuotaNomMPrestamos', valor: '1' },
        { id: 'txtTasaNomMPrestamos', valor: '10' },
        { id: 'txtObservacionNomMPrestamos', valor: OBSERVACION }
    ]);
    await t.click(Selector('#btnAceptarNomMPrestamos').filterVisible()).wait(3000);
    await editarYEliminarPrestamo360(t, OBSERVACION, EDITADO);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
