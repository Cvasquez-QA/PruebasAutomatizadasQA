import { Selector } from 'testcafe';
import {
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    editarTransaccion360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta
} from '../Funciones/HelpersHgi360Web.js';
import {
    eliminarDocumentoActual360,
    esperarLineasDocumento,
    escribirProductoDocumento,
    guardarDocumento360,
    nuevoDocumento360,
    numeroDesdeTexto,
    subirLineaDocumento
} from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC113 - TX 01QA: el Impuesto 2 digitado en la línea solo se conserva cuando la TX es cuenta por pagar.
 * Se restaura el check de cuenta por pagar original. Los documentos se eliminan.
 */

const TX = ['01QA', /^\s*01QA -/i];
const IMPUESTO2 = 5000;
const CHECK_CXP = '#TxtTransaccion_Cartera_CuentaPagar';
const inputImpuesto2 = Selector('#txtDocumento_Detalle_VrImpuesto2_cursor_1');
const inputCantidad = Selector('#txtDocumento_Detalle_Cantidad_cursor_1');

async function configurarCuentaPagar(t, activar) {
    await editarTransaccion360(t, TX[0], 'Cartera');
    const anterior = await Selector(CHECK_CXP).getAttribute('aria-checked') === 'true';
    if (activar) {
        await marcarCheckboxSiNoEsta(t, CHECK_CXP);
    } else {
        await desmarcarCheckboxSiEsta(t, CHECK_CXP);
    }
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);
    return anterior;
}

/** Crea el documento con la línea 01 x 1 e Impuesto 2 = 5000; devuelve el Impuesto 2 que quedó en la línea. */
async function impuesto2Grabado(t, exigirCampo) {
    await nuevoDocumento360(t, TX[0], TX[1]);
    await guardarDocumento360(t);
    try {
        await escribirProductoDocumento(t, '01');
        await t.typeText(inputCantidad, '1', { replace: true });
        // Versión actual: sin cuenta por pagar el Impuesto 2 de la línea no es editable (no se puede digitar)
        if (!exigirCampo && !await inputImpuesto2.with({ timeout: 5000 }).exists) {
            return null;
        }
        await t
            .expect(inputImpuesto2.with({ timeout: 5000 }).exists).ok('La línea no muestra el campo Impuesto 2')
            .typeText(inputImpuesto2, String(IMPUESTO2), { replace: true })
            .click('#txtDocumento_Detalle_Boton_1 .dx-icon-save')
            .wait(1500);
        await esperarLineasDocumento(t, 1, 'No se grabó la línea del producto 01');
        await subirLineaDocumento(t, 0);
        return numeroDesdeTexto(await inputImpuesto2.value);
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const original = await configurarCuentaPagar(t, false);
    let sinCxP;
    let conCxP;
    try {
        sinCxP = await impuesto2Grabado(t, false);
        await configurarCuentaPagar(t, true);
        conCxP = await impuesto2Grabado(t, true);
    } finally {
        await configurarCuentaPagar(t, original);
    }
    await t
        .expect(sinCxP).notEql(IMPUESTO2, `Sin cuenta por pagar el Impuesto 2 no debería conservarse en ${IMPUESTO2}`)
        .expect(conCxP).eql(IMPUESTO2, `Con cuenta por pagar se esperaba conservar el Impuesto 2 = ${IMPUESTO2}, quedó ${conCxP}`);
    await cerrarSesion360(t);
}

fixture `INC113 Impuesto 2 detalle - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC113 Impuesto 2 detalle - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC113 Impuesto 2 detalle - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC113 Impuesto 2 detalle - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
