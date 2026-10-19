import { test, expect } from '@playwright/test';
import {
    ingresarAplicacion,
    abrirMaestros360,
    aceptarValidacionesSiExisten,
    confirmarProceso,
    cerrarSesion360,
    cerrarPestana360,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaSiExiste360,
    escribirFecha360,
    esVisible,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// test.hgi360.com (React):
//  - grid [data-testid="gridCalendario"] (columnas Año | Periodo | Fecha inicial | Fecha fin | Festivos)
//  - el antiguo #txtIdCalendario ahora es #txtCalendario_Periodo (el Año viene con el año actual)
//  - las fechas se escriben en formato yyyy-MM-dd
//  - Festivos: al agregar fila se abre el popup "Día festivo" con la fecha (*_DatFecha) y su botón Guardar.
const GRID = 'gridCalendario';
const PERIODO = '81';
const FECHA_INICIAL = '2026-02-03';
const FECHA_FINAL = '2026-02-03';

const campoPeriodo = page => page.locator('#txtCalendario_Periodo .dx-texteditor-input, #txtIdCalendario').filter({ visible: true });
const btnGuardar = page => page.locator('#BtnGuardarCalendario_btn, #BtnGuardarCalendario').filter({ visible: true }).nth(0);
const avisoGuardado = page => page.locator('.swal2-container.swal2-center.swal2-backdrop-show div').filter({ hasText: 'Registro guardado' });
const popupFestivo = page => page.locator('.dx-overlay-content').filter({ visible: true }).filter({ hasText: 'Día festivo' });
// El id "dx_..._DatFecha" lo tiene el propio input del DateBox (así nombra el Form de DevExtreme sus editores)
const fechaFestivo = page => popupFestivo(page).locator('input[id$="_DatFecha"], .dx-datebox input.dx-texteditor-input').filter({ visible: true }).nth(0);
const btnGuardarFestivo = page => popupFestivo(page).locator('.dx-button').filter({ hasText: 'Guardar' }).filter({ visible: true }).nth(0);

async function guardar(page) {
    await btnGuardar(page).click();
    // El aviso "Registro guardado" lo responde la prueba (Sí + festivo). El resto de confirmaciones se aceptan aquí.
    if (await esVisible(avisoGuardado(page), 8000)) {
        return;
    }
    await confirmarProceso(page);
    await aceptarValidacionesSiExisten(page);
}

async function ejecutarPrueba(page, config, ingresar) {
    await ingresar(page, config);
    await abrirMaestros360(page, 'Calendario');
    await eliminarFilaSiExiste360(page, GRID, PERIODO);

    // Crear
    await nuevoRegistroGrid360(page, GRID);
    await campoPeriodo(page).first().waitFor({ state: 'visible', timeout: 10000 });
    await escribir(campoPeriodo(page), PERIODO);
    await escribirFecha360(page, '#txtCalendario_FechaInicial', FECHA_INICIAL);
    await escribirFecha360(page, '#txtCalendario_FechaFinal', FECHA_FINAL);
    await guardar(page);
    if (await esVisible(avisoGuardado(page))) {
        // Sí: page.locator('button').filter({ hasText: 'Sí' }) / .swal2-confirm.erp-swal-btn-primary
        // No: page.locator('button').filter({ hasText: 'No' }) / .swal2-cancel.erp-swal-btn-cancel
        // Sí -> sección Festivos -> "Agregar una fila" abre el popup "Día festivo".
        // El festivo debe estar dentro del periodo, por eso se usa la fecha inicial.
        await page.locator('.swal2-confirm.erp-swal-btn-primary').filter({ hasText: 'Sí' }).filter({ visible: true }).first().click();
        await page.locator('#gridFestivos .dx-icon.dx-icon-edit-button-addrow').first().click();
        await expect(popupFestivo(page).first(), 'No se abrió el popup "Día festivo"').toBeAttached({ timeout: 10000 });
        await escribir(fechaFestivo(page), FECHA_INICIAL);
        await page.keyboard.press('Tab');
        await btnGuardarFestivo(page).click();
        await page.waitForTimeout(2000);
        await page.locator('#BtnCancelarCalendario_btn span').filter({ hasText: 'Cerrar' }).first().click();
    }
    await buscarEnGrid360(page, GRID, PERIODO);
    await expect(filaGrid360(page, GRID, PERIODO).first(), `No se encontró el periodo ${PERIODO} creado en el calendario`)
        .toBeAttached({ timeout: 15000 });

    // Editar (festivos)
    await accionFilaGrid360(page, GRID, PERIODO, 'Editar');
    await page.locator('#BtnCancelarCalendario_btn span').filter({ hasText: 'Cerrar' }).first().click();

    // Eliminar
    await eliminarFilaSiExiste360(page, GRID, PERIODO);
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Calendario - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Calendario Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig, ingresarAplicacion);
    });
});
