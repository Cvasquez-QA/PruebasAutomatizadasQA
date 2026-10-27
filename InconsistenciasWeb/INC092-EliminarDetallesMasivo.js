import { ClientFunction, Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    asegurarDependenciaDocumento360,
    elegirTerceroDocumento,
    eliminarDocumentoActual360,
    esperarLineasDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import {
    abrirPuntoDeVenta360,
    agregarProductoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    esperarTotalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';
import { testAdminConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC092 - "Eliminar detalles" borra solo las líneas marcadas (y todas con "Seleccionar todos"), en Documentos
 * (TX 0101doc, Admin) y en el Punto de Venta (POS). Los documentos se eliminan.
 * La parte de Causaciones del archivo legacy no se migró: crea una causación contable que la prueba no puede borrar.
 */

const confirmar = Selector('button.swal2-confirm').filterVisible();

const botonesVisibles = ClientFunction(patron => Array.from(document.querySelectorAll('[id]'))
    .filter(function (n) { return n.getClientRects().length && new RegExp(patron, 'i').test(n.id); })
    .map(function (n) { return n.id; })
    .join(', '));

async function eliminarSeleccion(t, prefijo) {
    const boton = Selector(`#${prefijo}_Detalle_BtnEliminarSeleccion_btn, #${prefijo}_Detalle_BtnEliminarSeleccion`).filterVisible();
    if (!await boton.with({ timeout: 5000 }).exists) {
        await t.expect(false).ok(`No está el botón "Eliminar detalles". Ids: ${await botonesVisibles('Eliminar|Seleccion')}`);
    }
    await t.click(boton.nth(0)).click(confirmar.with({ timeout: 10000 })).wait(3000);
}

async function marcarTodos(t, prefijo) {
    const todos = Selector(`#chk${prefijo}_SeleccionarTodos`).filterVisible();
    if (await todos.with({ timeout: 5000 }).exists) {
        await t.click(todos.find('.dx-checkbox-icon'));
        return;
    }
    // Versión actual del Punto de Venta: no hay check "Seleccionar todos"; se marca cada línea (la de captura está deshabilitada)
    const checks = Selector('tr.dx-data-row .dx-select-checkbox').filterVisible().filter(':not(.dx-state-disabled):not(.dx-checkbox-checked)');
    await t.expect(checks.exists).ok(`No está el check "Seleccionar todos" ni checks por línea. Ids: ${await botonesVisibles('chk|Seleccion')}`);
    for (let total = await checks.count; total > 0; total--) {
        await t.click(checks.nth(0)).wait(500);
    }
}

async function ejecutarDocumentos(t, config) {
    const filas = Selector('[data-testid="gridDocumentosConsulta"] tr.dx-data-row');
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, '0101doc', /^\s*0101doc -/i);
    // La dependencia la trae el tercero: con el tercero por defecto (0 - GENERAL) queda vacía
    await elegirTerceroDocumento(t, '811021438');
    await asegurarDependenciaDocumento360(t);
    await guardarDocumento360(t);
    try {
        await agregarLineaDocumento(t, '010203', { cantidad: 1 });
        await agregarLineaDocumento(t, '010202', { cantidad: 1 });
        // Solo la línea de 010202
        await t.click(filas.withText('010202').find('.dx-checkbox, .dx-select-checkbox').nth(0));
        await eliminarSeleccion(t, 'Documento');
        const lineas = await esperarLineasDocumento(t, 1, 'Eliminar detalles no dejó solo la línea no marcada');
        await t.expect(lineas[0].producto).eql('010203', 'Se eliminó una línea que no estaba marcada');

        for (const producto of ['01', '02', '03']) {
            await agregarLineaDocumento(t, producto, { cantidad: 1 });
        }
        await marcarTodos(t, 'Documentos');
        await eliminarSeleccion(t, 'Documento');
        await esperarLineasDocumento(t, 0, 'Con "Seleccionar todos" no se eliminaron todas las líneas');
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
}

async function ejecutarPuntoDeVenta(t, config) {
    await ingresarAplicacion(t, config);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    try {
        for (const producto of ['010203', '010202', '02']) {
            await agregarProductoPV(t, producto, '1');
        }
        await marcarTodos(t, 'PuntoDeVenta');
        await eliminarSeleccion(t, 'PuntoDeVenta');
        await esperarTotalPV(t, total => total === 0, 'Con "Seleccionar todos" no se eliminaron todas las líneas del Punto de Venta');
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await eliminarTemporalPV(t).catch(() => undefined);
        await salirPuntoDeVenta360(t);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Eliminar Detalles INC092 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC092 - Eliminar detalles seleccionados en documento administrativo', async t => {
    await ejecutarDocumentos(t, testAdminConfig);
});

fixture `Prueba Eliminar Detalles INC092 Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC092 - Eliminar detalles seleccionados en punto de venta', async t => {
    await ejecutarPuntoDeVenta(t, testPosWebConfig);
});
