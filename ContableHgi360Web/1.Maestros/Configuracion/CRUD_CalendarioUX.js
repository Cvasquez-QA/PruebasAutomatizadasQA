import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    aceptarValidacionesSiExisten,
    confirmarProceso,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaSiExiste360,
    escribirFecha360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// mi.hgi360.com (React):
//  - grid [data-testid="gridCalendario"] (columnas Año | Periodo | Fecha inicial | Fecha fin | Festivos)
//  - el antiguo #txtIdCalendario ahora es #txtCalendario_Periodo (el Año viene con el año actual)
//  - las fechas se escriben en formato yyyy-MM-dd
const GRID = 'gridCalendario';
const PERIODO = '81';
const FECHA_INICIAL = '2026-02-03';
const FECHA_FINAL = '2026-02-03';

const campoPeriodo = Selector('#txtCalendario_Periodo .dx-texteditor-input, #txtIdCalendario').filterVisible();
const btnGuardar = Selector('#BtnGuardarCalendario_btn, #BtnGuardarCalendario').filterVisible().nth(0);
const avisoGuardado = Selector('.swal2-container.swal2-center.swal2-backdrop-show div').withText('Registro guardado');
const diaCalendario = Selector('.dx-overlay-content').filterVisible().find('.dx-calendar-cell').withExactText('4');

async function guardar(t) {
    await t.click(btnGuardar);
    // El aviso "Registro guardado" lo responde la prueba (Sí + festivo). El resto de confirmaciones se aceptan aquí.
    if (await avisoGuardado.with({ timeout: 8000 }).visible) {
        return;
    }
    await confirmarProceso(t);
    await aceptarValidacionesSiExisten(t);
}

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
    await abrirMaestros360(t, 'Calendario');
    await eliminarFilaSiExiste360(t, GRID, PERIODO);

    // Crear
    await nuevoRegistroGrid360(t, GRID);
    await t.typeText(campoPeriodo.with({ timeout: 10000 }), PERIODO, { replace: true });
    await escribirFecha360(t, '#txtCalendario_FechaInicial', FECHA_INICIAL);
    await escribirFecha360(t, '#txtCalendario_FechaFinal', FECHA_FINAL);
    await guardar(t);
    if (await avisoGuardado.visible) {
        // Sí: Selector('button').withText('Sí') / .swal2-confirm.erp-swal-btn-primary
        // No: Selector('button').withText('No') / .swal2-cancel.erp-swal-btn-cancel
        await t
            .click(Selector('button').withText('Sí'))
            .click('#gridFestivos .dx-icon.dx-icon-edit-button-addrow')
            .click(Selector('.dx-dropdowneditor-icon').nth(5))
            .click(diaCalendario)
            .click(Selector('.erp-form-btn-save'))
            .click(Selector('#BtnCancelarCalendario_btn span').withText('Cerrar'));
    }
    await buscarEnGrid360(t, GRID, PERIODO);
    await t
        .expect(filaGrid360(GRID, PERIODO).with({ timeout: 15000 }).exists)
        .ok(`No se encontró el periodo ${PERIODO} creado en el calendario`);

    // Editar (festivos)
    await accionFilaGrid360(t, GRID, PERIODO, 'Editar');
    await t.click(Selector('#BtnCancelarCalendario_btn span').withText('Cerrar'));

    // Eliminar
    await eliminarFilaSiExiste360(t, GRID, PERIODO);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Calendario - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Calendario Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});
/*
fixture `Prueba Calendario - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Calendario Hgi360 CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
*/
