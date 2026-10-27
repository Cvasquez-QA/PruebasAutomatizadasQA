import { ClientFunction, Selector } from 'testcafe';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import {
    abrirHerramientas360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/** INC105 - Herramientas > Parámetros > Nómina > General muestra todos los parámetros de nómina. No se guarda nada. */

const CAMPOS = ['StrArp', 'StrNovedadProducto', 'StrProductoSeguridadSocial', 'StrProdutoPrestacionesSociales',
    'IntInTerValo', 'IntPeriodosNom', 'IntDecimalesNom', 'IntNaturalezaJuridica', 'StrCondicionEspecial',
    'IntFormulasLiqDef', 'IntFormatoDocumentoNom', 'IntFormatoPrima', 'IntFormatoCesantias', 'IntFormatoCesantiasAnt',
    'IntFormatoLiquidacionDef', 'IntFormatoCertificadoLab', 'IntFormatoSaldoContable', 'StrFormatoCantidadN',
    'StrFormatoValorN', 'IntCuentaDia31Vac', 'IntPagaDia31Vac', 'IntFestivosVacComp', 'IntVacAnticipadas',
    'IntFestivoVacaciones', 'IntVacOtroPeriodo', 'IntVacPromBasico', 'IntVacacionesNomina', 'IntDedVacacionesIBC',
    'IntCargaVac', 'IntPrimaAuxTte', 'IntCesantiasAuxTte', 'IntNovedadesPeriodo', 'IntLiqPorFecha',
    'IntRecargoNovedad', 'IntVlrFondoSolidaridad', 'IntDestajo', 'IntIdentificacionAlt', 'IntLey1429', 'IntLey1604',
    'DatFechaExoneracion', 'IntTipoAportante', 'IntAportesSLN', 'IntAjustaDias', 'IntIbcVacacionesMes',
    'IntVacacionesIBCParafiscales', 'IntRegimenEspPlanU', 'IntDeduccionRteFte'].map(c => `TxtPrm_Nomina_${c}`);

const camposNoVisibles = ClientFunction(ids => ids.filter(function (id) {
    const nodo = document.getElementById(id);
    return !nodo || !nodo.getClientRects().length;
}));

async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .click(Selector('#tabs_parametros_Nomina').with({ timeout: 20000 }))
        .wait(1500);
    const general = Selector('#tabs_parametrosNom_General').filterVisible();
    if (await general.exists) {
        await t.click(general).wait(1000);
    }
    await t.click(Selector('#BtnEditar_btn, #BtnEditar').filterVisible().nth(0)).wait(2000);
    const faltantes = await camposNoVisibles(CAMPOS);
    const cancelar = Selector('#BtnCancelar_btn, #BtnCancelar').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPestana360(t);
    await t.expect(faltantes.join(', ')).eql('', `No son visibles los parámetros de nómina: ${faltantes.join(', ')}`);
    await cerrarSesion360(t);
}

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirHerramientas(t, 'Parámetros');
    await t
        .click('#tabs_parametros_Nomina')
        .click('#tabs_parametrosNom_General')
        .click(Selector('#BtnEditar span').withText('Editar'));
    for (const id of CAMPOS) {
        await t.expect(Selector(`#${id}`).visible).ok(`no es visible el campo ${id}`);
    }
    await HelpersHappgi.cerrarPestana(t);
    await HelpersHappgi.cerrarSesion(t);
}

fixture `INC105 Parametros Nomina - Test Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC105 Parametros Nomina - Test Happgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});

fixture `INC105 Parametros Nomina - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC105 Parametros Nomina - Test hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});
