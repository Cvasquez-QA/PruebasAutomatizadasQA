import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMovimiento,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const CONCEPTO_PERIODO = 'Hora extra nocturna';
const CONCEPTO_GENERAL = 'Salario Básico';
const FECHA_INICIAL = '2026-01-01';
const CONTRATO = '1';
const DOCUMENTO = '123456';
const CANTIDAD = '1';
const VALOR = '5000';
const SISTEMA = '1';
const OPCION_GENERAL = 'GENERAL';
const HORAS_W = '5';
const ACU = '1';
const OBSERVACION = 'PRUEBA NOVEDAD';
const ID_EMPLEADO = '1000099598';

const filtroEmpleadoGrid = Selector('#gridNovedadesConceptos .dx-texteditor-input');


async function limpiarYEscribir(t, selector, valor) {
    await t
        .click(selector)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(selector, valor);
}

async function seleccionarLookup(t, hostSelector, texto) {
    await t.click(`${hostSelector} .dx-lookup-field`);
    await filtrarPor(t, texto);
    await seleccionarOpcion(t, texto);
}

async function llenarFormularioNovedad(t, config) {
    await t.click('#gridNovedadesConceptos .dx-icon.dx-icon-add')
    .wait(2000)
    await t.click('#TxtNovedadesConceptos_Empleado .dx-lookup-field');
    await filtrarPor(t, ID_EMPLEADO);
    await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, ID_EMPLEADO);
    
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_FechaInicial .dx-texteditor-input', FECHA_INICIAL);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Contrato .dx-texteditor-input', CONTRATO);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Documento .dx-texteditor-input', DOCUMENTO);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Cantidad .dx-texteditor-input', CANTIDAD);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Valor .dx-texteditor-input', VALOR);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Sistema .dx-texteditor-input', SISTEMA);

    await seleccionarLookup(t, '#txtNovedades_Conceptos_Sucursal', OPCION_GENERAL);
    await seleccionarLookup(t, '#txtNovedades_Conceptos_CCosto', OPCION_GENERAL);
    await seleccionarLookup(t, '#txtNovedades_Conceptos_SubCCosto', OPCION_GENERAL);

    await limpiarYEscribir(t, '#txtNovedades_Conceptos_HorasW .dx-texteditor-input', HORAS_W);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Acu .dx-texteditor-input', ACU);
    await limpiarYEscribir(t, '#txtNovedades_Conceptos_Observaciones .dx-texteditor-input', OBSERVACION);

    await t
        .click(Selector('#BtnGuardarNovedadConcepto span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'))
        .click('#gridNovedadesConceptos .dx-icon.dx-icon-refresh');
}

async function eliminarNovedadSeleccionada(t, config) {
    await t
        .click(filtroEmpleadoGrid)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroEmpleadoGrid, ID_EMPLEADO)
        .wait(1000)
        .click(Selector('#gridNovedadesConceptos .dx-checkbox-icon').nth(1))
        .click(Selector('#btnEliminarSeleccionadosNovedadesConceptos span').withText('Eliminar seleccionados'))
        .click(Selector('span').withText('Sí'));
}

async function probarNovedadesConceptoXPeriodo(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'NOVEDADES POR CONCEPTO');

    await seleccionarLookup(t, '#TxtNovedadesC_Conceptos', CONCEPTO_PERIODO);
    await llenarFormularioNovedad(t, config);
    await eliminarNovedadSeleccionada(t, config);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

async function probarNovedadesConceptoGeneral(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'NOVEDADES POR CONCEPTO');

    await t.click(Selector('#RBNovedadesConceptosTipo div').withText('General'));
    await seleccionarLookup(t, '#TxtNovedadesC_Conceptos', CONCEPTO_GENERAL);
    await llenarFormularioNovedad(t, config);
    await eliminarNovedadSeleccionada(t, config);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Movimientos Novedades Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Novedades Concepto x Periodo', async t => {
    await probarNovedadesConceptoXPeriodo(t, miNominaConfig, ingresarAplicacion);
});

test('Mi Hgi360 - Prueba Novedades x Concepto General', async t => {
    await probarNovedadesConceptoGeneral(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Movimientos Novedades Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Novedades Concepto x Periodo', async t => {
    await probarNovedadesConceptoXPeriodo(t, testNominaConfig, ingresarAplicacion);
});

test('Test Hgi360 - Prueba Novedades x Concepto General', async t => {
    await probarNovedadesConceptoGeneral(t, testNominaConfig, ingresarAplicacion);
});
