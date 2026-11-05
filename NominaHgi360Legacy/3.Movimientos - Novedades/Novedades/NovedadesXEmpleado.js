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
const CONCEPTO_EMPLEADO = 'Hora extra nocturna';
const CONCEPTO_GENERAL = 'Salario Básico';

const filtroEmpleadoGrid = Selector('#gridNovedades .dx-texteditor-input').nth(2);


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
    await t.click('#gridNovedades .dx-icon.dx-icon-add')
    .wait(2000)
    await seleccionarLookup(t, '#TxtNovedades_Concepto', CONCEPTO_EMPLEADO);
    await limpiarYEscribir(t, '#txtNovedades_FechaInicial .dx-texteditor-input', FECHA_INICIAL);
    await limpiarYEscribir(t, '#txtNovedades_Contrato .dx-texteditor-input', CONTRATO);
    await limpiarYEscribir(t, '#txtNovedades_Documento .dx-texteditor-input', DOCUMENTO);
    await limpiarYEscribir(t, '#txtNovedades_Cantidad .dx-texteditor-input', CANTIDAD);
    await limpiarYEscribir(t, '#txtNovedades_Valor .dx-texteditor-input', VALOR);
    await limpiarYEscribir(t, '#txtNovedades_Sistema .dx-texteditor-input', SISTEMA);

    await seleccionarLookup(t, '#txtNovedades_Sucursal', OPCION_GENERAL);
    await seleccionarLookup(t, '#txtNovedades_CCosto', OPCION_GENERAL);
    await seleccionarLookup(t, '#txtNovedades_SubCCosto', OPCION_GENERAL);

    await limpiarYEscribir(t, '#txtNovedades_HorasW .dx-texteditor-input', HORAS_W);
    await limpiarYEscribir(t, '#txtNovedades_Acu .dx-texteditor-input', ACU);
    await limpiarYEscribir(t, '#txtNovedades_Observaciones .dx-texteditor-input', OBSERVACION);

    await t
        .click(Selector('#BtnGuardarNovedad span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'))
        .click('#gridNovedades .dx-icon.dx-icon-refresh');
}

async function eliminarNovedadSeleccionada(t, config) {
    await t
        .click(filtroEmpleadoGrid)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroEmpleadoGrid, DOCUMENTO)
        .wait(1000)
        .click(Selector('#gridNovedades .dx-checkbox-icon').nth(1))
        .click(Selector('#btnEliminarSeleccionadosNovedades span').withText('Eliminar seleccionados'))
        .click(Selector('span').withText('Sí'));
}

async function probarNovedadesEmpleadoXPeriodo(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'NOVEDADES POR EMPLEADO');
    
    await seleccionarLookup(t, '#TxtNovedades_Empleados', ID_EMPLEADO);
    await llenarFormularioNovedad(t, config);
    await eliminarNovedadSeleccionada(t, config);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

async function probarNovedadesEmpleadoGeneral(t, config, ingresar) {

    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'NOVEDADES POR EMPLEADO');
    await t.click(Selector('#RBNovedadesTipo div').withText('General').nth(2));
    await seleccionarLookup(t, '#TxtNovedades_Empleados', ID_EMPLEADO);
    await llenarFormularioNovedad(t, config);
    await eliminarNovedadSeleccionada(t, config);

    await t.switchToMainWindow();
    await cerrarSesion360(t);

}

fixture `Prueba Movimientos Novedades Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Novedades Empleado x Periodo', async t => {
    await probarNovedadesEmpleadoXPeriodo(t, miNominaConfig, ingresarAplicacion);
});

test('MiHgi360 - Prueba Novedades Empleado General', async t => {
    await probarNovedadesEmpleadoGeneral(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Movimientos Novedades Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Novedades Empleado x Periodo', async t => {
    await probarNovedadesEmpleadoXPeriodo(t, testNominaConfig, ingresarAplicacion);
});

test('Test Hgi360 - Prueba Novedades Empleado General', async t => {
    await probarNovedadesEmpleadoGeneral(t, testNominaConfig, ingresarAplicacion);
});
