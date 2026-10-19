import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const TX = '01QA';

const btnEditarTransaccion = Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1);
const btnLimpiar = Selector('[data-bind="dxControlsDescendantBindings: true"] span').withText('Limpiar').filterVisible();

/** Lookups de la pestaÃ±a Defecto a limpiar y validar */
const CAMPOS_DEFECTO = [
    '#TxtTransaccion_TerceroDef',
    '#TxtTransaccion_TerceroMandatarioDef',
    '#TxtTransaccion_TerceroAuxDef',
    '#TxtTransaccion_ClaseDef',
    '#TxtTransaccion_FP_Anticipos',
    '#TxtTransaccion_BodegaDef',
    '#TxtTransaccion_SucursalDef',
    '#TxtTransaccion_CCostoDef',
    '#TxtTransaccion_SubCCostoDef',
    '#TxtTransaccion_TransaccionDef',
   // '#TxtTransaccion_FPagoDef',
    '#TxtTransaccion_CboCptoDocAdicional',
   // '#TxtTransaccion_Pagos_StrTipoCarteraDef',
];

const abrirTransaccionDefecto = async t => {
    await abrirMaestros360(t, 'Transacciones');

    await t
        .typeText('#gridTransacciones .dx-texteditor-input', TX)
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText(TX).exists).ok(
            `No se encontrÃ³ la transacciÃ³n ${TX}`
        )
        .click(btnEditarTransaccion)
        .wait(1500)
        .click('#tabs_documento_Defecto')
        .wait(1000);
};

/**
 * Abre el lookup, limpia el valor y valida que el campo quede vacÃ­o
 * (no debe quedar texto visible en el lookup).
 */
const limpiarYValidarCampoDefecto = async (t, campoId) => {
    const lookup = Selector(`${campoId} .dx-lookup-field`);

    await t
        .click(lookup)
        .click(btnLimpiar)
        .expect(Selector(`${campoId} div`).withText('').visible).ok(
            `Tras Limpiar, ${campoId} no quedÃ³ en el estado esperado`
        );
};

const validarLimpiezaValoresDefecto = async t => {
    await abrirTransaccionDefecto(t);

    for (const campoId of CAMPOS_DEFECTO) {
        await limpiarYValidarCampoDefecto(t, campoId);
    }

    await cerrarPestana360(t);
};

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);
    await validarLimpiezaValoresDefecto(t);
    await cerrarSesion360(t);
};

fixture `INC115 Valores defecto TX - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC115 Valores defecto TX - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
/*
fixture `INC115 Valores defecto TX - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC115 Valores defecto TX - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
*/