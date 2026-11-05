import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirProcesos360,
    elegirEnLookup360
} from '../../Funciones/HelpersHgi360Web.js';
import {
    abrirYCerrarLista360,
    elegirEnLista360,
    elegirRegistro360,
    escribirFechaNomina360,
    existeConEspera360
} from '../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Procesos > Cesantías (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy: liquida las
// cesantías del empleado de prueba, las carga en nómina y valida las opciones de impresión.
const FECHA_CORTE = '2026-06-15';
const TASA = '10';
const ANIO = '2026';
const CCOSTO = '07 - Q.A';
const ID_EMPLEADO = '1000099598';

const swal = Selector('.swal2-popup').filterVisible();
const toastError = Selector('.erp-toast[data-type="error"]').filterVisible();

const textoSwal = async () => (await swal.exists) ? (await swal.innerText).replace(/\s+/g, ' ') : '';

/** Pulsa el botón y atiende los avisos: si primero pregunta, confirma y espera el resultado. */
async function ejecutarAccion(t, id, accion) {
    await t.click(Selector(`#${id}`).filterVisible());
    let espera = 15000;
    while (await existeConEspera360(t, swal, espera)) {
        const texto = await textoSwal();
        await t.expect(swal.hasClass('swal2-icon-error')).notOk(`${accion}: ${texto}`);
        const confirmar = swal.find('button.swal2-confirm').filterVisible();
        if (!await confirmar.exists) {
            await t.wait(1000);
            continue;
        }
        const pregunta = await swal.hasClass('swal2-icon-question') || await swal.hasClass('swal2-icon-warning');
        await t.click(confirmar);
        // Al confirmar, el aviso se cierra o lo reemplaza el del resultado
        const inicio = Date.now();
        while (await textoSwal() === texto && Date.now() - inicio < 20000) {
            await t.wait(500);
        }
        await t.expect(await textoSwal() !== texto).ok(`${accion}: el aviso "${texto}" no se cerró`);
        if (!pregunta) {
            break;
        }
        espera = 120000;
    }
    await t.expect(toastError.exists).notOk(`${accion}: la aplicación mostró un error`);
}

fixture `Prueba Proceso Cesantias Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Proceso Cesantias - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirProcesos360(t, 'Cesantías');
    await t.expect(Selector('#TxtCes_FechaCorte').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Procesos > Cesantías');

    await escribirFechaNomina360(t, '#TxtCes_FechaCorte', FECHA_CORTE);
    await llenarCampos(t, [{ id: 'NumCes_Tasa', valor: TASA }]);
    await elegirEnLista360(t, '#CboCes_Ano', ANIO, ANIO);
    await abrirYCerrarLista360(t, '#TxtCes_Sucursal');
    await elegirEnLookup360(t, '#TxtCes_CCosto', CCOSTO);
    await abrirYCerrarLista360(t, '#TxtCes_SubCCosto');
    await elegirRegistro360(t, '#TxtCes_Empleado', ID_EMPLEADO);

    await ejecutarAccion(t, 'BtnCes_Liquidar', 'Liquidar cesantías');
    await ejecutarAccion(t, 'BtnCes_CargarNomina', 'Cargar cesantías en nómina');

    await t.click(Selector('#BtnCes_Imprimir').find('.dx-icon-spindown, .dx-dropdowneditor-icon, .dx-buttongroup-item').filterVisible().nth(-1));
    const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    await t
        .expect(opciones.withText('PDF').with({ timeout: 10000 }).exists).ok('No se visualiza la opción PDF')
        .expect(opciones.withText('Mail').exists).ok('No se visualiza la opción Mail')
        .pressKey('esc');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
