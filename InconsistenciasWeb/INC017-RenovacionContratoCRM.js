import { Selector } from 'testcafe';
import { testCRMConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirGestion360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';

/**
 * INC17 - Quitar la renovación de un contrato y guardarlo no debe mostrar un mensaje emergente
 * (test.hgi360.com, CRM > Gestión > Contratos, tercero 333344 YESICA).
 * Al final el contrato vuelve a quedar con la renovación que tenía.
 */

const grid = Selector('[data-testid="gridReferenciasTercero"], #gridReferenciasTercero').filterVisible().nth(0);
const renovacion = Selector('#txtReferenciasTercero_IntRenovacion');
const btnGuardar = Selector('#BtnGuardarReferenciasTercero_btn, #BtnGuardarReferenciasTercero').filterVisible().nth(0);
const aviso = Selector('.swal2-popup').filterVisible();
const toastError = Selector('.erp-toast[data-type="error"]').filterVisible();

async function renovacionMarcada() {
    const propio = await renovacion.getAttribute('aria-checked');
    const valor = propio !== null ? propio : await renovacion.find('[aria-checked]').getAttribute('aria-checked');
    return valor === 'true';
}

async function editarContrato(t) {
    await t
        .expect(grid.find('tr.dx-data-row').with({ timeout: 20000 }).exists).ok('El tercero 333344 no tiene contratos')
        .click(grid.find('tr.dx-data-row').nth(0).find('[aria-label="Editar"]'))
        .expect(renovacion.with({ timeout: 15000 }).visible).ok('No abrió la edición del contrato (sin campo Renovación)');
}

/** Cambia la renovación, guarda y devuelve el texto del aviso o error que haya salido (o ''). */
async function cambiarRenovacionYGuardar(t) {
    await t.click(renovacion).click(btnGuardar);
    for (const inicio = Date.now(); Date.now() - inicio < 5000;) {
        if (await aviso.exists) {
            return (await aviso.innerText).replace(/\s+/g, ' ').trim();
        }
        if (await toastError.exists) {
            return (await toastError.innerText).replace(/\s+/g, ' ').trim();
        }
        await t.wait(300);
    }
    await t.expect(btnGuardar.exists).notOk('No se cerró la edición del contrato al guardar', { timeout: 10000 });
    return '';
}

async function cerrarAviso(t) {
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar).wait(800);
    }
}

fixture `Prueba Contrato miERP`
    .page(testCRMConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Renovacion Contrato CRUD ', async t => {
    await ingresarAplicacion(t, testCRMConfig);
    await abrirGestion360(t, 'Contratos');
    await elegirEnLookup360(t, '#ReferenciasTercero_Tercero', '333344', 'YESICA');
    await t.wait(2000);
    await editarContrato(t);
    const original = await renovacionMarcada();

    let mensaje = '';
    try {
        if (!original) {
            await t.expect(await cambiarRenovacionYGuardar(t)).eql('', 'No se pudo marcar la renovación del contrato');
            await editarContrato(t);
        }
        mensaje = await cambiarRenovacionYGuardar(t);
    } finally {
        await cerrarAviso(t);
        if (await btnGuardar.exists) {
            await t.pressKey('esc');
        }
        if (original) {
            await editarContrato(t).catch(() => undefined);
            if (!await renovacionMarcada()) {
                await cambiarRenovacionYGuardar(t).catch(() => undefined);
                await cerrarAviso(t);
            }
        }
    }
    await t.expect(mensaje).eql('', `Al quitar la renovación del contrato salió un mensaje emergente: "${mensaje}"`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
