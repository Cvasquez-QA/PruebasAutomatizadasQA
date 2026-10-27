import { ClientFunction, Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { testNominaConfig, testHappgiNominaConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/** INC081 - El maestro de Empleados (Nómina) muestra los campos de información personal, laboral y de nómina. */

const EMPLEADO = '1000099598';
const CAMPOS = {
    General: ['panelEmpleadoFotoPreview', 'txtEmpleado_CiudadNac', 'txtEmpleado_FechaNac', 'txtEmpleado_CiudadResidencia',
        'txtEmpleado_Telefono', 'txtEmpleado_Celular', 'txtEmpleado_EstadoCivil', 'txtEmpleado_Conyuge',
        'txtEmpleado_Escolaridad', 'txtEmpleado_NumHijos', 'txtEmpleado_TipoSangre', 'txtEmpleado_Vivienda',
        'txtEmpleado_Vehiculo', 'txtEmpleado_TipoIdAnt', 'txtEmpleado_IdentificacionAnt'],
    Laboral: ['txtEmpleado_Cargo', 'txtEmpleado_Regimen', 'txtEmpleado_Sucursal', 'txtEmpleado_CCosto',
        'txtEmpleado_SubCCosto', 'txtEmpleado_Puesto', 'txtEmpleado_UpcAdicional', 'txtEmpleado_ValorHora',
        'txtEmpleado_BeneficiarioPacto', 'txtEmpleado_CondicionEspecial', 'txtEmpleado_Marcado',
        'txtEmpleado_Pignoracion', 'txtEmpleado_ExtranjeroNoPension', 'txtEmpleado_ColombianoExterior'],
    Nomina: ['txtEmpleado_CiudadBanco', 'txtEmpleado_CodigoBanco', 'txtEmpleado_FondoPension',
        'txtEmpleado_FondoCesantias', 'txtEmpleado_EPS', 'txtEmpleado_CCF', 'txtEmpleado_TarifaArl',
        'txtEmpleado_SubActividad', 'txtEmpleado_ReteProcedimiento', 'txtEmpleado_ReteDevengado',
        'txtEmpleado_ReteApSalud', 'txtEmpleado_ReteApPension', 'txtEmpleado_ReteApVolPension',
        'txtEmpleado_ReteApAfc', 'txtEmpleado_ReteMPre', 'txtEmpleado_ReteEdViv', 'txtEmpleado_ReteConRentaEx',
        'txtEmpleado_RetePorcentaje', 'txtEmpleado_ReteAudita', 'txtEmpleado_RetePersCargo',
        'txtEmpleado_ReteDeclRenta', 'Panel_EmpleadosSalarios']
};

const camposNoVisibles = ClientFunction(ids => ids.filter(function (id) {
    const nodo = document.getElementById(id);
    return !nodo || !nodo.getClientRects().length;
}));

async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Empleados');
    await buscarEnGrid360(t, 'gridEmpleados', EMPLEADO);
    await t.wait(2000);
    await accionFilaGrid360(t, 'gridEmpleados', EMPLEADO, 'Editar');
    await t.expect(Selector('[id^="txtEmpleado_"]').filterVisible().with({ timeout: 15000 }).exists)
        .ok(`No abrió la edición del empleado ${EMPLEADO}`);

    const faltantes = [];
    for (const [pestana, ids] of Object.entries(CAMPOS)) {
        const tab = Selector(`#tabs_Empleado_${pestana}`).filterVisible();
        if (await tab.exists) {
            await t.click(tab).wait(1500);
        }
        faltantes.push(...(await camposNoVisibles(ids)).map(id => `${pestana}: ${id}`));
    }
    const cancelar = Selector('[id^="BtnCancelarEmpleado"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPestana360(t);
    await t.expect(faltantes.join(', ')).eql('', `No se encontraron los campos: ${faltantes.join(', ')}`);
    await cerrarSesion360(t);
}

fixture `INC081 Campos Maestro Empleados Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC081 Campos Maestro Empleados Nomina - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testNominaConfig);
});

/* ----------------------------- Happgi (legacy) ----------------------------- */

fixture `INC081 Campos Maestro Empleados Nomina Happgi`
    .page(testHappgiNominaConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('INC081 Campos Maestro Empleados Nomina Happgi', async t => {
    await HelpersHappgi.ingresarAplicacion(t, testHappgiNominaConfig);
    await HelpersHappgi.abrirMaestros(t, 'Empleados');
    await t
        .wait(2000)
        .typeText(Selector('.dx-texteditor-input-container .dx-texteditor-input'), EMPLEADO)
        .wait(1500)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1));
    for (const [pestana, ids] of Object.entries(CAMPOS)) {
        if (pestana !== 'General') {
            await t.click(`#tabs_Empleado_${pestana}`);
        }
        for (const id of ids) {
            await t.expect(Selector(`#${id}`).visible).ok(`no se encontró el campo ${id}`);
        }
    }
    await t.switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
});
