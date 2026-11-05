import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    buscarEnGrid360,
    filaGrid360,
    nuevoRegistroGrid360
} from '../../../../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroConfig360 } from '../../../../../Funciones/MenuMaestros360.js';
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - PLAN DE CUENTAS (test.hgi360.com, AutContable).
// Igual que en ContableHgi360Legacy: intenta crear la cuenta 0, que ya existe en el plan, y valida que la
// aplicación lo rechace. No se crea ni se borra ninguna cuenta. Ids tomados en el navegador el 03-nov-2026.
const GRID = 'gridPlanContable';
const CODIGO = '0';
const DESCRIPCION = 'miplandecuenta';

const toastCreado = Selector('.erp-toast[data-type="success"]').filterVisible().withText(/almacenad|guardad|cread/i);
const rechazo = Selector('.erp-toast, .swal2-popup, div, span, p')
    .filterVisible()
    .withText(/ya existe|existe un registro/i);

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestroConfig360(t, config, 'Plan de Cuentas');
    await buscarEnGrid360(t, GRID, CODIGO);
    await t.expect(filaGrid360(GRID, CODIGO).with({ timeout: 15000 }).exists)
        .ok(`La cuenta ${CODIGO} no existe en el plan de cuentas: no se puede probar el duplicado`);

    await nuevoRegistroGrid360(t, GRID);
    await llenarCampos(t, [
        { id: 'TxtPlanContable_Codigo', valor: CODIGO },
        { id: 'TxtPlanContable_Descripcion', valor: DESCRIPCION }
    ]);
    await t.click(Selector('#BtnGuardarPlanContable_btn').filterVisible());
    await t
        .expect(await toastCreado.with({ timeout: 3000 }).exists).notOk(`La aplicación dejó crear la cuenta duplicada ${CODIGO}`)
        .expect(rechazo.with({ timeout: 15000 }).exists)
        .ok(`No se mostró el mensaje de registro existente para la cuenta ${CODIGO}`);
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `OtrasAplicaciones - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - OTRAS APLICACIONES - Test Hgi360', async t => {
    await ejecutarPrueba(t, testContableConfig);
});
