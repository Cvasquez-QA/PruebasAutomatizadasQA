import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirProcesos360,
    elegirEnLookup360
} from '../../Funciones/HelpersHgi360Web.js';
import {
    abrirYCerrarLista360,
    escribirFechaNomina360,
    leerFechaNomina360,
    leerNumeroNomina360,
    sumarDiasNomina360,
    validarAviso360
} from '../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Procesos > Vacaciones Masivas (test.hgi360.com, AutNomina), basada en NominaHgi360Legacy: valida el
// cálculo de días y fechas y carga los empleados del centro de costo. En legacy Grabar y Anular mostraban
// "disponible próximamente"; en Web ya están implementados y el grid trae empleados desde que se abre la
// pantalla, así que pulsarlos grabaría o anularía vacaciones reales: no se pulsan.
const FECHA_ACUMULADO_HASTA = '2026-06-23';
const FECHA_INICIO = '2026-06-20';
const MESES = '1';
const DIAS_VACACIONES = 5;
const CCOSTO = '07 - Q.A';
const radio = texto => Selector('#RgVacMas_TipoLiquidacion .dx-radiobutton').withText(texto);

fixture `Prueba Vacaciones Masivas Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Vacaciones Masivas - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirProcesos360(t, 'Vacaciones Masivas');
    await t.expect(Selector('#TxtVacMas_Sucursal').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Procesos > Vacaciones Masivas');

    for (const lista of ['#TxtVacMas_Sucursal', '#TxtVacMas_CCosto', '#TxtVacMas_SubCCosto', '#TxtVacMas_Empleado']) {
        await abrirYCerrarLista360(t, lista);
    }
    await escribirFechaNomina360(t, '#TxtVacMas_FechaAcumuladoHasta', FECHA_ACUMULADO_HASTA);
    await llenarCampos(t, [{ id: 'NumVacMas_Meses', valor: MESES }]);
    await t.click(radio('Básico')).click(radio('Promedio'));
    await escribirFechaNomina360(t, '#TxtVacMas_FechaInicio', FECHA_INICIO);
    await llenarCampos(t, [{ id: 'NumVacMas_DiasVac', valor: String(DIAS_VACACIONES) }]);
    await t.wait(1500);

    const diasConPrima = DIAS_VACACIONES + 1;
    await t
        .expect(await leerNumeroNomina360('#NumVacMas_DiasDis')).eql(DIAS_VACACIONES, 'Días disfrutados no coincide con los días de vacaciones')
        .expect(await leerNumeroNomina360('#NumVacMas_DiasCom')).eql(0, 'Días compensados debería ser 0')
        .expect(await leerNumeroNomina360('#NumVacMas_DiasPVac')).eql(diasConPrima, 'Días pagados de vacaciones no es el esperado')
        .expect(await leerNumeroNomina360('#NumVacMas_DiasPDis')).eql(diasConPrima, 'Días pagados disfrutados no es el esperado')
        .expect(await leerNumeroNomina360('#NumVacMas_DiasPCom')).eql(0, 'Días pagados compensados debería ser 0');

    const fechaFinal = sumarDiasNomina360(FECHA_INICIO, DIAS_VACACIONES);
    await t
        .expect(await leerFechaNomina360('#TxtVacMas_FechaFinal')).eql(fechaFinal, `La fecha final no es ${DIAS_VACACIONES} días después del inicio`)
        .expect(await leerFechaNomina360('#TxtVacMas_FechaRegreso')).eql(sumarDiasNomina360(fechaFinal, 1), 'La fecha de regreso no es un día después de la fecha final');

    await elegirEnLookup360(t, '#TxtVacMas_CCosto', CCOSTO);
    await t.click(Selector('#BtnVacMas_CargarEmpleados').filterVisible());
    await validarAviso360(t, /proceso realizado/i, 'No se mostró el mensaje de proceso realizado al cargar empleados');
    await t.expect(Selector('#gridVacacionesMasivas tr.dx-data-row').exists).ok('La grilla no trae información de empleados');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
