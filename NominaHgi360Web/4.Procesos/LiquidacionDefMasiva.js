import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirProcesos360
} from '../../Funciones/HelpersHgi360Web.js';
import { abrirYCerrarLista360, escribirFechaNomina360, validarAviso360 } from '../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Procesos > Liquidación Definitiva Masiva (test.hgi360.com, AutNomina), basada en NominaHgi360Legacy.
// En legacy Calcular, Grabar, Anular y Cargar en Nómina mostraban "aún no está implementado"; en Web ya
// están implementados y con empleados cargados liquidarían (retirarían) empleados reales, por eso solo se
// pulsa Grabar sin datos y se valida su mensaje. Sucursal, CCosto, SubCCosto y Empleado son dropdownbox.
const FECHA_LIQUIDACION = '2026-06-25';
const SIN_FECHA_RETIRO = /fecha de retiro no debe estar en blanco/i;

const radio = texto => Selector('#RgLiqDefMas_TipoLiquidacion .dx-radiobutton').withText(texto);

fixture `Prueba Liquidacion Definitiva Masiva Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Liquidacion Definitiva Masiva - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirProcesos360(t, 'Liquidación Definitiva Masiva');
    await t.expect(Selector('#TxtLiqDefMas_Sucursal').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Procesos > Liquidación Definitiva Masiva');

    await t.click(Selector('#BtnLiqDefMas_Grabar').filterVisible());
    await validarAviso360(t, SIN_FECHA_RETIRO, 'Grabar sin datos no pidió la fecha de retiro');

    for (const lista of ['#TxtLiqDefMas_Sucursal', '#TxtLiqDefMas_CCosto', '#TxtLiqDefMas_SubCCosto', '#TxtLiqDefMas_Empleado']) {
        await abrirYCerrarLista360(t, lista);
    }
    for (const fecha of ['#TxtLiqDefMas_FechaRetiro', '#TxtLiqDefMas_FechaAcumulados', '#TxtLiqDefMas_FechaUltimoAno']) {
        await escribirFechaNomina360(t, fecha, FECHA_LIQUIDACION);
    }
    await t
        .click(radio('Promedio'))
        .click(radio('Básico'))
        .click('#ChkLiqDefMas_Prima .dx-checkbox-icon')
        .click('#ChkLiqDefMas_Indemnizacion .dx-checkbox-icon')
        .click('#ChkLiqDefMas_CesantiasAnt .dx-checkbox-icon')
        .click('#ChkLiqDefMas_IntCesantiasAnt .dx-checkbox-icon');

    await t
        .click(Selector('#BtnLiqDefMas_CargarEmpleados').filterVisible())
        .expect(Selector('tr.dx-data-row').filterVisible().with({ timeout: 30000 }).exists)
        .ok('La grilla no trae información de empleados');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
