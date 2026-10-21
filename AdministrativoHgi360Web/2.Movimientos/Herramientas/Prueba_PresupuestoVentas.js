import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    campoPopup360,
    cerrarPestana360,
    cerrarPopup360,
    cerrarSesion360,
    escribirCampoPopup360,
    guardarPopup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    popupEdicion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Movimientos > Herramientas > Presupuesto Ventas - pestaña Configuración (test.hgi360.com, empresa 8902)
 *  1. Agrega una fila desde el popup del grid (selectores en "Todos") con cantidad 7 y un valor propio
 *     que no coincide con datos reales.
 *  2. La edita: cambia la cantidad a 9 y verifica que quedó guardada.
 *  3. La elimina. Si algo falla a mitad de camino, la limpieza borra la fila creada.
 * No usa Importar/Exportar ni toca filas que no creó.
 *
 * Basada en el flujo de Playwright erp-qa-e2e: src/specs/movimientos/presupuesto-ventas.flow.spec.ts
 */

const OPCION_MENU = 'Presupuesto Ventas';
const RESUMEN_ERRORES = '#summary_AdPresupuestoVentas';
const CANTIDAD_INICIAL = 7;
const CANTIDAD_EDITADA = 9;

const tabConfiguracion = Selector('#tab_AdPresupuestoVentas_Configuracion').filterVisible();
const gridPresupuesto = Selector('#gridAdPresupuestoVentas').filterVisible();
const btnNuevo = gridPresupuesto.find('.dx-toolbar [aria-label="Nuevo"]');
const btnConfirmarDialogo = Selector('button.swal2-confirm').filterVisible();

/** Valor con separadores de miles opcionales: el grid lo muestra como 9.712.345,00. */
const regexValor = valor => {
    const digitos = String(valor).split('');
    const partes = digitos.map((d, i) => {
        const restantes = digitos.length - i - 1;
        return restantes > 0 && restantes % 3 === 0 ? `${d}[.,\\s]?` : d;
    });
    return new RegExp(partes.join(''));
};

/** Fila del presupuesto que muestra el valor de la prueba. */
const filaPresupuesto = valor => gridPresupuesto.find('tr.dx-data-row').withText(regexValor(valor));

async function abrirPresupuestoVentas(t) {
    await abrirMovimientos360(t, OPCION_MENU);
    await t
        .expect(tabConfiguracion.with({ timeout: 60000 }).exists).ok('No se abrió la pestaña Configuración de Presupuesto Ventas')
        .expect(btnNuevo.with({ timeout: 60000 }).exists).ok('No apareció el botón Nuevo del grid de presupuesto');
}

async function accionFila(t, valor, accion) {
    const boton = filaPresupuesto(valor).find(`[aria-label="${accion}"]`);
    await t
        .expect(boton.with({ timeout: 15000 }).exists).ok(`No apareció "${accion}" en la fila con valor ${valor}`)
        .click(boton.nth(0))
        .wait(500);
}

async function abrirNuevaFila(t) {
    await t
        .click(btnNuevo)
        .expect(popupEdicion360.with({ timeout: 20000 }).exists).ok('No se abrió el popup de Configuración')
        // El popup aplica estilos y teclado al mostrarse: se espera a que se asiente antes de escribir
        .wait(500);
}

async function editarFila(t, valor) {
    await accionFila(t, valor, 'Editar');
    await t.expect(popupEdicion360.with({ timeout: 20000 }).exists).ok(`No se abrió la edición de la fila con valor ${valor}`);
}

async function eliminarFila(t, valor) {
    await accionFila(t, valor, 'Eliminar');
    await t
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .expect(filaPresupuesto(valor).exists).notOk(`La fila con valor ${valor} sigue en el grid después de eliminarla`, { timeout: 20000 });
}

/** Limpieza: cierra el popup si quedó abierto y borra la fila de la prueba si existe. */
async function eliminarFilaSiExiste(t, valor) {
    if (await popupEdicion360.exists) {
        await t.pressKey('esc').wait(1000);
    }
    if (await filaPresupuesto(valor).with({ timeout: 6000 }).exists) {
        await eliminarFila(t, valor);
    }
}

async function ejecutarPruebaPresupuestoVentas(t, config) {
    // Valor poco probable en datos reales: identifica la fila de la prueba
    const valor = Number(`97${Date.now().toString().slice(-5)}`);

    await ingresarAplicacion(t, config);
    await abrirPresupuestoVentas(t);
    await t.expect(filaPresupuesto(valor).exists).notOk(`Ya existe una fila con valor ${valor} antes de la prueba`);

    try {
        // Agregar
        await abrirNuevaFila(t);
        await escribirCampoPopup360(t, 'IntCantidad', CANTIDAD_INICIAL);
        await escribirCampoPopup360(t, 'IntValor', valor);
        await guardarPopup360(t, RESUMEN_ERRORES);
        await t.expect(filaPresupuesto(valor).count).eql(1, `No apareció la fila con valor ${valor} en el grid`, { timeout: 20000 });

        // Editar: cambia la cantidad
        await editarFila(t, valor);
        await escribirCampoPopup360(t, 'IntCantidad', CANTIDAD_EDITADA);
        await guardarPopup360(t, RESUMEN_ERRORES);
        await editarFila(t, valor);
        await t.expect(campoPopup360('IntCantidad').value).match(
            new RegExp(`^${CANTIDAD_EDITADA}([.,]0+)?$`),
            `La cantidad no quedó en ${CANTIDAD_EDITADA} después de editar`
        );
        await cerrarPopup360(t);

        // Eliminar
        await eliminarFila(t, valor);
    } finally {
        // Un error en la limpieza no debe tapar el fallo original de la prueba
        await eliminarFilaSiExiste(t, valor).catch(() => undefined);
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Presupuesto Ventas - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    })
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Presupuesto Ventas - agregar, editar y eliminar fila - Test Hgi360', async t => {
    await ejecutarPruebaPresupuestoVentas(t, testAdminConfig);
});
