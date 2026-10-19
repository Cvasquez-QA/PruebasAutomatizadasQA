import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirHerramientas = es360 ? h.abrirHerramientas360 : h.abrirHerramientas;
    cerrarPestana = es360 && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);

    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await abrirHerramientas(t, 'Parámetros');
    await t
    .click('#tabs_parametros_Nomina')
    .click('#tabs_parametrosNom_General')
    .click(Selector('#BtnEditar span').withText('Editar'))
    await t.expect(Selector('#TxtPrm_Nomina_StrArp .dx-lookup-field').visible).ok('no es visible el campo');    
    await t.expect(Selector('#TxtPrm_Nomina_StrNovedadProducto .dx-lookup-field').visible).ok('no es visible el campo');    
    await t.expect(Selector('#TxtPrm_Nomina_StrProductoSeguridadSocial .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_StrProdutoPrestacionesSociales .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntInTerValo div').withText('Decadal').nth(2).visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntInTerValo div').withText('Quincenal').nth(2).visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntPeriodosNom .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntDecimalesNom .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntNaturalezaJuridica .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_StrCondicionEspecial .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_StrCondicionEspecial .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormulasLiqDef span').withText('Formulas').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoDocumentoNom .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoPrima .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoCesantias .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoCesantiasAnt .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoLiquidacionDef .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoCertificadoLab .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFormatoSaldoContable .dx-lookup-field').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_StrFormatoCantidadN .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_StrFormatoValorN .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntCuentaDia31Vac span').withText('Cuenta dia 31').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntPagaDia31Vac span').withText('Paga dia 31').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFestivosVacComp span').withText('Festivos en Comp').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntVacAnticipadas span').withText('Pago Anticipado').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntFestivoVacaciones span').withText('Festivos en Vacaciones').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntVacOtroPeriodo span').withText('Pago en Otro Periodo').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntVacPromBasico span').withText('Promedio + Básico').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntVacacionesNomina span').withText('Vacaciones en Nómina').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntDedVacacionesIBC span').withText('Deduccion Seg. Social').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntCargaVac div').withText('Compensadas').nth(2).visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntCargaVac div').withText('Periodo Fiscal').nth(2).visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntPrimaAuxTte span').withText('Prima').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntCesantiasAuxTte span').withText('Cesantias').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntNovedadesPeriodo span').withText('Tiempo x Periodo').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntLiqPorFecha span').withText('Fecha').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntRecargoNovedad span').withText('Recargo').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntVlrFondoSolidaridad span').withText('Vlr Base F. Solidaridad y Rte Fte').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntDestajo span').withText('Destajo').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntIdentificacionAlt span').withText('Identificacion alterna').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntLey1429 span').withText('Ley 1429').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntLey1604 span').withText('Ley 1607').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_DatFechaExoneracion .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntTipoAportante .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntAportesSLN .dx-texteditor-input').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntAjustaDias span').withText('Ajusta Días En Planilla').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntIbcVacacionesMes span').withText('Vacaciones IBC del  Mes').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntVacacionesIBCParafiscales span').withText('Vacaciones Base Parafiscales').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntRegimenEspPlanU span').withText('Regimen Especial Parafiscales').visible).ok('no es visible el campo');
    await t.expect(Selector('#TxtPrm_Nomina_IntDeduccionRteFte span').withText('Deducción del Salario').visible).ok('no es visible el campo');
    await cerrarPestana(t);
    await cerrarSesion(t);
}
    
fixture `INC105 Parametros Nomina - Test Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC105 Parametros Nomina - Test Happgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `INC105 Parametros Nomina - Test hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC105 Parametros Nomina - Test hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});