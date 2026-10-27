import { Selector } from 'testcafe';
import { abrirMovimientos360, cerrarPestana360, cerrarSesion360, filtrarPor, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC106 - Causación (TX de caja) con un centro de costo inactivo: al guardar el ERP debe avisar
 * "El centro de costo seleccionado está inactivo". Si la causación llegara a guardarse, se elimina.
 */

const TERCERO = '1000099598';
const confirmar = Selector('button.swal2-confirm').filterVisible();
const numeroCausacion = Selector('#txtDocumentoCausacion .dx-texteditor-input');
const opcionLista = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
const avisoCcosto = Selector('.erp-toast, .swal2-popup, .erp-form-error__text').filterVisible().withText(/centro de costo seleccionado est[aá] inactivo/i);

async function elegirPrimera(t, lookup, filtro, texto = null) {
    await t.click(`${lookup} .dx-lookup-field`);
    await filtrarPor(t, filtro);
    const opcion = texto ? opcionLista.withText(texto) : opcionLista;
    await t
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No apareció ninguna opción con "${filtro}" en ${lookup}`)
        .click(opcion.nth(0));
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Causaciones');
    await t
        .expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 })
        .click(Selector('#BtnNuevoCausacionConsulta').with({ timeout: 15000 }))
        .expect(Selector('#Causacion_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible).ok('No se abrió el formulario de causaciones');
    await elegirPrimera(t, '#Causacion_Transaccion', 'CAJA');
    await elegirPrimera(t, '#Causacion_Tercero', TERCERO, new RegExp(`^\\s*${TERCERO} -`));
    await elegirPrimera(t, '#Causacion_Ccosto', 'Inactivo', /Inactivo/i);
    await t
        .typeText('#txtDocumentoCausacion_Referencia .dx-texteditor-input', `QA${String(Date.now()).slice(-10)}`, { replace: true })
        .click('#BtnGuardarCausacion')
        .wait(3000);
    const avisado = await avisoCcosto.with({ timeout: 10000 }).exists;
    const numero = await numeroCausacion.value;
    if (numero) {
        await t
            .click('#BtnEliminarCausacion')
            .click(confirmar.with({ timeout: 10000 }))
            .wait(2000);
    }
    await t.expect(avisado).ok(`No se tiene el control del centro de costo inactivo${numero ? ` (la causación ${numero} se guardó y se eliminó)` : ''}`);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba INC106 Control CCosto en Causaciones - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC106 Control CCosto en Causaciones admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC106 Control CCosto en Causaciones - Hgi360`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC106 Control CCosto en Causaciones admin - Hgi360', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
