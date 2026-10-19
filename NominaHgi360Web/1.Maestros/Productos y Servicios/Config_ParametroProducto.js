import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirHerramientas360,
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Herramientas > Parámetros > pestaña Parámetros (test.hgi360.com).
// Deja los nombres de los parámetros de producto en Parametro11..Parametro66, que son los nombres
// de menú que usan las pruebas CRUD_ParametroProducto1..6.
const NOMBRES = ['Parametro11', 'Parametro22', 'Parametro33', 'Parametro44', 'Parametro55', 'Parametro66'];

const campoParametro = n => `#TxtParametrosGenerales_Params_StrProductoParametro${n} .dx-texteditor-input`;
const toastExito = Selector('.erp-toast[data-type="success"]').filterVisible();
const botonConfirmar = Selector('button.swal2-confirm').filterVisible();

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .click(Selector('#tabs_parametros_Params').with({ timeout: 20000 }))
        .click(Selector('#BtnEditar_btn').filterVisible().with({ timeout: 15000 }))
        .expect(Selector(campoParametro(1)).filterVisible().with({ timeout: 10000 }).exists)
        .ok('No se habilitó la edición de parámetros');

    for (let n = 1; n <= NOMBRES.length; n++) {
        await t.typeText(campoParametro(n), NOMBRES[n - 1], { replace: true }).pressKey('tab');
    }

    await t.click(Selector('#BtnGuardar_btn').filterVisible());
    // Según la versión, el guardado confirma con un toast o con un diálogo "Aceptar"
    if (await botonConfirmar.with({ timeout: 5000 }).exists) {
        await t.click(botonConfirmar);
    }
    await t.wait(1500);
    const hayToast = await toastExito.exists;

    // Validar recargando la pantalla de parámetros
    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Parámetros');
    await t.click(Selector('#tabs_parametros_Params').with({ timeout: 20000 }));
    for (let n = 1; n <= NOMBRES.length; n++) {
        await t.expect(Selector(campoParametro(n)).with({ timeout: 10000 }).value)
            .eql(NOMBRES[n - 1], `El parámetro de producto ${n} no quedó guardado${hayToast ? '' : ' (no se vio confirmación)'}`);
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba ParametroProd1 - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Config Parametros Productos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
