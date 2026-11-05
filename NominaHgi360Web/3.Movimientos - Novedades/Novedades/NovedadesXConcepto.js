import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirMovimientos360,
    elegirEnLookup360
} from '../../../Funciones/HelpersHgi360Web.js';
import {
    elegirEnLista360,
    llenarNovedad360,
    guardarNovedad360,
    filaNovedad360,
    eliminarNovedadSeleccionada360,
    eliminarNovedadSiExiste360
} from '../../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Novedades por Concepto (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// crea la novedad del concepto para el empleado ("Del Periodo" y "General") y la borra con "Eliminar seleccionados".
// En la empresa 8902 no existe "Hora extra nocturna": se usa "002 - Horas Extras Diurnas".
const ID_EMPLEADO = '1000099598';
const GRID = 'gridNovedadesConceptos';
const DATOS = {
    fechaInicial: '2026-01-01',
    contrato: '1',
    documento: '987124',
    cantidad: '1',
    valor: '5000',
    sistema: '1',
    horasW: '5',
    acu: '1',
    observacion: 'PRUEBA NOVEDAD CONCEPTO'
};

async function probarNovedadConcepto(t, tipo, concepto, filtroConcepto) {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirMovimientos360(t, 'Novedades por Concepto');
    await t.expect(Selector('#RBNovedadesConceptosTipo').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Movimientos > Novedades por Concepto');

    await t.click(Selector('#RBNovedadesConceptosTipo .dx-radiobutton').withText(tipo).filterVisible());
    await elegirEnLookup360(t, '#TxtNovedadesC_Conceptos', concepto, filtroConcepto);
    await eliminarNovedadSiExiste360(t, GRID, DATOS.documento);

    await t.click(Selector(`#${GRID} [aria-label="Nuevo"]`).filterVisible());
    await elegirEnLista360(t, '#TxtNovedadesConceptos_Empleado', ID_EMPLEADO, ID_EMPLEADO);
    await llenarNovedad360(t, 'txtNovedades_Conceptos_', DATOS);
    await guardarNovedad360(t, 'BtnGuardarNovedadConcepto');

    const cancelar = Selector('#BtnCancelarNovedadConcepto').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar);
    }
    await t.expect(filaNovedad360(GRID, DATOS.documento).with({ timeout: 20000 }).exists)
        .ok(`No aparece en el grid la novedad ${tipo} creada`);
    await eliminarNovedadSeleccionada360(t, GRID, DATOS.documento);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimientos Novedades por Concepto Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Novedades Concepto x Periodo - Test Hgi360', async t => {
    await probarNovedadConcepto(t, 'Del Periodo', '002 - Horas Extras Diurnas', 'Horas Extras');
});

test('Prueba Novedades x Concepto General - Test Hgi360', async t => {
    await probarNovedadConcepto(t, 'General', '001 - Salario Basico', 'Salario');
});
