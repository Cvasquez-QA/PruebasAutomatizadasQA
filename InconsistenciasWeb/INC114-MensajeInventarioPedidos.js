import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    elegirTerceroDocumento,
    eliminarDocumentoActual360,
    escribirProductoDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC114 - Producto 01 con cantidad 1.000.000.000: la factura 01FE avisa "Cantidad Inexistente" y el pedido 07QA
 * avisa "La cantidad mas los pedidos supera el saldo existente". Los documentos se eliminan.
 */

const CANTIDAD_EXCESIVA = '1000000000';
const inputCantidad = Selector('#txtDocumento_Detalle_Cantidad_cursor_1');
const aviso = texto => Selector('.erp-toast, .swal2-popup, .erp-form-error__text').filterVisible().withText(texto);

async function mensajeConCantidadExcesiva(t, tx, texto) {
    await nuevoDocumento360(t, tx, new RegExp(`^\\s*${tx} -`, 'i'));
    // La dependencia la trae el tercero: con el tercero por defecto (0 - GENERAL) queda vacía y no deja guardar
    const dependencia = Selector('#Documento_Dependencia .dx-texteditor-input');
    if (await dependencia.exists && !await dependencia.value) {
        await elegirTerceroDocumento(t, '811021438');
    }
    await guardarDocumento360(t);
    let avisado;
    try {
        await escribirProductoDocumento(t, '01');
        await t
            .typeText(inputCantidad, CANTIDAD_EXCESIVA, { replace: true })
            .pressKey('enter');
        avisado = await aviso(texto).with({ timeout: 10000 }).exists;
        if (!avisado) {
            await t.click('#txtDocumento_Detalle_Boton_1 .dx-icon-save');
            avisado = await aviso(texto).with({ timeout: 10000 }).exists;
        }
        const confirmar = Selector('button.swal2-confirm').filterVisible();
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
    return avisado;
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const factura = await mensajeConCantidadExcesiva(t, '01FE', /Cantidad Inexistente/i);
    const pedido = await mensajeConCantidadExcesiva(t, '07QA', /La cantidad mas los pedidos supera el saldo/i);
    await t
        .expect(factura).ok('La factura 01FE no mostró "Cantidad Inexistente"')
        .expect(pedido).ok('El pedido 07QA no mostró "La cantidad mas los pedidos supera el saldo existente"');
    await cerrarSesion360(t);
}

fixture `INC114 Mensaje inventario pedidos - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC114 Mensaje inventario pedidos - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC114 Mensaje inventario pedidos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC114 Mensaje inventario pedidos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
