import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos } from '../../../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    escribirFecha360
} from '../../../../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroConfig360 } from '../../../../../Funciones/MenuMaestros360.js';
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - CONFIGURACIÓN (test.hgi360.com, AutContable), basada en ContableHgi360Legacy:
// intenta crear otra vez el periodo 1 del calendario (ya existe) y valida el rechazo; no crea registros.
// Ids del formulario tomados en el navegador el 03-nov-2026 con AutContable.
// No incluido: Transacciones (no está en el menú Maestros del módulo Contable).
const GRID = 'gridCalendario';
const ANYO = String(new Date().getFullYear());
const PERIODO = '1';
const FECHA_INICIAL = `${ANYO}-01-01`;
const FECHA_FINAL = `${ANYO}-01-31`;

// El rechazo se muestra como aviso dentro del formulario, no como toast
const rechazo = Selector('.erp-toast, .swal2-popup, div, span, p').filterVisible().withText(/ya existe|existe un registro/i);
const creado = Selector('.erp-toast').filterVisible().withText(/almacenad|guardad|cread/i);

fixture `Prueba Duplicados Contable - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - CONFIGURACIÓN - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    await abrirMaestroConfig360(t, testContableConfig, 'Calendario');
    await buscarEnGrid360(t, GRID, FECHA_INICIAL);
    await t.expect(filaGrid360(GRID, FECHA_INICIAL).with({ timeout: 15000 }).exists)
        .ok(`No existe el periodo ${PERIODO} de ${ANYO} en el calendario contable; no se puede probar el duplicado`);

    await nuevoRegistroGrid360(t, GRID);
    await llenarCampos(t, [
        { id: 'txtCalendario_Periodo', valor: PERIODO },
        { id: 'txtCalendario_Anyo', valor: ANYO }
    ]);
    await escribirFecha360(t, '#txtCalendario_FechaInicial', FECHA_INICIAL);
    await escribirFecha360(t, '#txtCalendario_FechaFinal', FECHA_FINAL);
    await t.click(Selector('#BtnGuardarCalendario_btn').filterVisible());
    await t
        .expect(rechazo.exists).ok(`Calendario: no se mostró el mensaje de registro existente para el periodo ${PERIODO} de ${ANYO}`, { timeout: 15000 })
        .expect(creado.exists).notOk(`Calendario: la aplicación dejó crear el periodo duplicado ${PERIODO} de ${ANYO}`);
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
