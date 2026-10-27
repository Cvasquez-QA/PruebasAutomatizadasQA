import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    eliminarDocumentoActual360,
    elegirTerceroDocumento,
    esperarLineasDocumento,
    escribirProductoDocumento,
    guardarDocumento360,
    nuevoDocumento360,
    numeroDesdeTexto
} from '../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC12 - Al cambiar el producto en la línea de captura antes de grabarla, la línea debe quedar con la
 * descripción y el valor unitario del producto nuevo (test.hgi360.com, POS > Movimientos > Documentos).
 * Pedido 07QA: línea 1 con 010203; línea 2 se escribe 03 y se cambia a 010203. Las dos líneas deben ser iguales.
 * El pedido se elimina al final.
 */

const PRODUCTO = '010203';
const cantidadCaptura = Selector('#txtDocumento_Detalle_Cantidad_cursor_1').filterVisible();
const valorCaptura = Selector('#txtDocumento_Detalle_ValorUnitario_cursor_1').filterVisible();

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC12-ValorDetalleDocumentos', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await nuevoDocumento360(t, '07QA', '07QA');
    await elegirTerceroDocumento(t, '811021438');
    await guardarDocumento360(t);

    try {
        // El pedido 07QA no admite el mismo producto en dos líneas ("Ya existe un registro con el código
        // ingresado"): el valor de referencia se toma de la captura con 010203 antes de cambiar de producto.
        await escribirProductoDocumento(t, PRODUCTO);
        const valorReferencia = numeroDesdeTexto(await valorCaptura.value);
        await escribirProductoDocumento(t, '03');
        await t.typeText(cantidadCaptura, '1', { replace: true });
        await escribirProductoDocumento(t, PRODUCTO);
        // Al cambiar el producto la línea vuelve a dejar la cantidad en 0 (sin cantidad sale "Cantidad Inexistente")
        await t
            .wait(1500)
            .click(cantidadCaptura)
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(cantidadCaptura, '1')
            .pressKey('tab')
            .wait(1000);
        const cantidad = await cantidadCaptura.value;
        await t.click('#txtDocumento_Detalle_Boton_1 .dx-icon-save');
        const error = Selector('.erp-toast[data-type="error"], .erp-toast[data-type="warning"]').filterVisible();
        if (await error.with({ timeout: 3000 }).exists) {
            await t.expect(false).ok(`No se grabó la línea (cantidad en captura: ${cantidad}): ${(await error.innerText).replace(/\s+/g, ' ').trim()}`);
        }
        const lineas = await esperarLineasDocumento(t, 1, 'No se grabó la línea');
        await t
            .expect(lineas[0].producto).eql(PRODUCTO, 'La línea no quedó con el producto cambiado')
            .expect(lineas[0].num['valor unitario']).eql(valorReferencia,
                `La línea no quedó con el valor unitario del producto ${PRODUCTO} (${valorReferencia})`);
    } finally {
        await eliminarDocumentoActual360(t);
    }

    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 3000 }).exists) {
        await t.click(confirmar);
    }
    await cerrarSesion360(t);
});
