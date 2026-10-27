import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    filaGrid360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360
} from '../Funciones/HelpersHgi360Web.js';
import { llenarCampos } from '../Funciones/HelpersMaestros360.js';
import { abrirMaestroConfig360 } from '../Funciones/MenuMaestros360.js';

/**
 * INC07 - Transacción duplicada (test.hgi360.com, POS > Maestros > Transacciones).
 * Intenta crear la transacción 01, que ya existe, y valida que el ERP la rechace.
 */

const GRID = 'gridTransacciones';
const CODIGO_EXISTENTE = '01';
const toastCreado = Selector('.erp-toast[data-type="success"]').filterVisible().withText(/almacenad|guardad|cread/i);
// En el ERP React el rechazo sale como error del formulario (.erp-form-error__text), no como mensaje emergente
const rechazo = Selector('.erp-form-error__text, .erp-toast[data-type="error"], .erp-toast[data-type="warning"], .swal2-popup')
    .filterVisible()
    .withText('Ya existe un registro con el código ingresado');

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC07-TxDuplicada', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirMaestroConfig360(t, testPosWebConfig, 'Transacciones', 'configuracion');

    // Sin la transacción 01 la prueba crearía un registro en vez de probar el duplicado
    await buscarEnGrid360(t, GRID, CODIGO_EXISTENTE);
    await t.expect(filaGrid360(GRID, CODIGO_EXISTENTE).with({ timeout: 15000 }).exists)
        .ok(`No existe la transacción ${CODIGO_EXISTENTE}: la prueba necesita un código existente`);

    await nuevoRegistroGrid360(t, GRID);
    await llenarCampos(t, [
        { id: 'TxtTransaccion_Codigo', valor: CODIGO_EXISTENTE },
        { id: 'TxtTransaccion_Descripcion', valor: 'pruebatxduplicada' }
    ]);
    await t.click(Selector('#BtnGuardarTransaccion').filterVisible());

    await t
        .expect(await toastCreado.with({ timeout: 3000 }).exists).notOk('El ERP dejó guardar la transacción 01 duplicada')
        .expect(rechazo.with({ timeout: 15000 }).exists)
        .ok('No salió el mensaje emergente diciendo que ya existe esa transacción');
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
