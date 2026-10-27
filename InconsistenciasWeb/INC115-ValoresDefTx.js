import { Selector } from 'testcafe';
import {
    cancelarMaestro360,
    cerrarSesion360,
    editarTransaccion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC115 - TX 01QA, pestaña Defecto: cada lookup se puede limpiar con "Limpiar" y queda vacío.
 * No se guarda la transacción (se cancela la edición).
 */

const TX = '01QA';
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
    '#TxtTransaccion_CboCptoDocAdicional'
];
const btnLimpiar = Selector('.dx-overlay-content, .dx-popup-wrapper').filterVisible().find('.dx-button, button').withText('Limpiar');

const textoLookup = async campo => (await Selector(`${campo} .dx-lookup-field`).innerText).replace(/\s+/g, ' ').trim();
const vacio = texto => texto === '' || /^(Seleccione|Select)/i.test(texto);

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await editarTransaccion360(t, TX, 'Defecto');
    const errores = [];
    for (const campo of CAMPOS_DEFECTO) {
        if (!await Selector(`${campo} .dx-lookup-field`).exists) {
            errores.push(`${campo}: no existe`);
            continue;
        }
        await t.click(`${campo} .dx-lookup-field`);
        if (!await btnLimpiar.with({ timeout: 5000 }).exists) {
            errores.push(`${campo}: el lookup no tiene botón Limpiar`);
            await t.pressKey('esc');
            continue;
        }
        await t.click(btnLimpiar.nth(0)).wait(500);
        const texto = await textoLookup(campo);
        if (!vacio(texto)) {
            errores.push(`${campo}: quedó "${texto}"`);
        }
    }
    await cancelarMaestro360(t, 'Transaccion');
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 2000 }).exists) {
        await t.click(confirmar);
    }
    await t.expect(errores.join(' | ')).eql('', `Valores por defecto que no se limpian: ${errores.join(' | ')}`);
    await cerrarSesion360(t);
}

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
