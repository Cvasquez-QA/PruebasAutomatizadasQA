import { ClientFunction, Selector } from 'testcafe';
import { testCRMConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirGestion360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    escribirFecha360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';

/**
 * INC57 - Las fechas de inicio y fin de un contrato quedan guardadas como se escribieron
 * (test.hgi360.com, CRM > Gestión > Contratos, tercero 1000099598).
 * Crea un contrato con código de licencia único (25-03-2026 a 30-03-2026), lo busca de nuevo y lo elimina.
 */

// Código único por ejecución: el código de licencia es único en toda la tabla, no solo por tercero.
const CODIGO = `9${String(Date.now()).slice(-6)}`;
const FECHA_INICIO = '2026-03-25';
const FECHA_FIN = '2026-03-30';
const grid = Selector('[data-testid="gridReferenciasTercero"], #gridReferenciasTercero').filterVisible().nth(0);
const filaContrato = grid.find('tr.dx-data-row').withText(CODIGO);
const btnGuardar = Selector('#BtnGuardarReferenciasTercero_btn, #BtnGuardarReferenciasTercero').filterVisible().nth(0);
const confirmar = Selector('button.swal2-confirm').filterVisible();

/** Ids de los lookups visibles del formulario del contrato que siguen vacíos. */
const lookupsVacios = ClientFunction(() => Array.from(document.querySelectorAll('[id^="txtReferenciasTercero_"]'))
    .filter(function (nodo) {
        const campo = nodo.querySelector('.dx-lookup-field');
        return campo && nodo.getClientRects().length && !campo.innerText.trim();
    })
    .map(function (nodo) { return nodo.id; }));

async function abrirContratosDelTercero(t) {
    await abrirGestion360(t, 'Contratos');
    await elegirEnLookup360(t, '#ReferenciasTercero_Tercero', '1000099598', '1000099598');
    const actualizar = Selector('#BtnActualizarReferenciasTercero_btn, #BtnActualizarReferenciasTercero').filterVisible();
    if (await actualizar.with({ timeout: 3000 }).exists) {
        await t.click(actualizar.nth(0));
    }
    await t.expect(grid.with({ timeout: 20000 }).exists).ok('No cargó la grid de contratos');
    await t.wait(3000);
}

/** Texto de las filas de la grid de contratos (para el mensaje de error). */
const textoFilas = async () => {
    const filas = grid.find('tr.dx-data-row');
    const total = Math.min(await filas.count, 5);
    const textos = [];
    for (let i = 0; i < total; i++) {
        textos.push((await filas.nth(i).innerText).replace(/\s+/g, ' ').trim());
    }
    return textos.join(' | ') || 'sin filas';
};

/** Contratos que dejaron corridas anteriores de esta prueba (mismas fechas 25-03-2026 a 30-03-2026). */
async function eliminarContratosPrevios(t) {
    const previos = grid.find('tr.dx-data-row').withText(/2026-03-25|25\/03\/2026/).withText(/2026-03-30|30\/03\/2026/);
    for (let i = 0; i < 5 && await previos.with({ timeout: 3000 }).exists; i++) {
        await t
            .click(previos.nth(0).find('[aria-label="Eliminar"]'))
            .click(confirmar.with({ timeout: 10000 }))
            .wait(3000);
    }
}

async function eliminarContratoSiExiste(t) {
    if (await filaContrato.with({ timeout: 3000 }).exists) {
        await t
            .click(filaContrato.nth(0).find('[aria-label="Eliminar"]'))
            .click(confirmar.with({ timeout: 10000 }))
            .expect(filaContrato.exists).notOk(`No se eliminó el contrato ${CODIGO}`, { timeout: 15000 });
    }
}

async function crearContrato(t) {
    const nuevo = Selector('[id^="BtnNuevoReferenciasTercero"]').filterVisible();
    await t.click(await nuevo.exists ? nuevo.nth(0) : grid.find('.dx-icon-add').nth(0));
    await t
        .expect(Selector('#txtReferenciasTercero_StrCodLic').with({ timeout: 15000 }).visible).ok('No abrió el formulario del contrato')
        .typeText('#txtReferenciasTercero_StrCodLic .dx-texteditor-input', CODIGO, { replace: true })
        .typeText('#txtReferenciasTercero_IntDocumento .dx-texteditor-input', CODIGO, { replace: true });
    // Referencia, producto, vendedor, vendedor externo y lista de precios: la primera opción de cada lista
    for (const id of await lookupsVacios()) {
        await t.click(Selector(`#${id} .dx-lookup-field`));
        const opcion = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
        if (await opcion.with({ timeout: 5000 }).exists) {
            await t.click(opcion.nth(0));
        } else {
            await t.pressKey('esc');
        }
    }
    await escribirFecha360(t, '#txtReferenciasTercero_DatFechaI', FECHA_INICIO);
    await escribirFecha360(t, '#txtReferenciasTercero_DatFechaF', FECHA_FIN);
    await t.click(btnGuardar);
    const error = Selector('.erp-toast[data-type="error"], .erp-form-error__text, .swal2-popup').filterVisible();
    if (await error.with({ timeout: 4000 }).exists) {
        await t.expect(false).ok(`No se guardó el contrato: ${(await error.innerText).replace(/\s+/g, ' ').trim()} (contratos del tercero en la grid: ${await textoFilas()})`);
    }
    await t.expect(btnGuardar.exists).notOk('No se cerró el formulario del contrato al guardar', { timeout: 15000 });
}

const aTextoGrid = fecha => {
    const [a, m, d] = fecha.split('-');
    return new RegExp(`${a}-${m}-${d}|${d}/${m}/${a}`);
};

fixture `Prueba INC057 CRM testerp`
    .page(testCRMConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC057 Fecha contrato CRM testerp', async t => {
    await ingresarAplicacion(t, testCRMConfig);
    await abrirContratosDelTercero(t);
    await eliminarContratosPrevios(t);

    try {
        await crearContrato(t);
        await cerrarPestana360(t);
        await abrirContratosDelTercero(t);
        if (!await filaContrato.with({ timeout: 15000 }).exists) {
            await t.expect(false).ok(`No aparece el contrato ${CODIGO}. Filas: ${await textoFilas()}`);
        }
        const texto = await filaContrato.nth(0).innerText;
        await t
            .expect(aTextoGrid(FECHA_INICIO).test(texto)).ok(`El contrato no muestra la fecha de inicio ${FECHA_INICIO}: ${texto}`)
            .expect(aTextoGrid(FECHA_FIN).test(texto)).ok(`El contrato no muestra la fecha de fin ${FECHA_FIN}: ${texto}`);
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        if (await btnGuardar.exists) {
            await t.pressKey('esc');
        }
        await eliminarContratoSiExiste(t).catch(() => undefined);
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
