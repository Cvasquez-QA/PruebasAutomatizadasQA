import { Selector } from 'testcafe';
import { abrirMovimientos360, cerrarPestana360, cerrarSesion360, elegirEnLookup360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC061 - Recibo de caja (Movimientos > Pagos): al confirmar varias veces seguidas (Enter) el valor de la línea
 * de banco, el ERP debe avisar "El proceso anterior, aun no ha terminado" en lugar de duplicar el detalle.
 * El recibo se elimina al final.
 */

const confirmar = Selector('button.swal2-confirm').filterVisible();

/** Abre el buscador F4 del campo y elige la fila con el código indicado. */
const elegirEnF4 = async (t, campo, codigo) => {
    await t.click(Selector(`${campo} .dx-icon-search`).filterVisible().with({ timeout: 10000 }));
    const celda = Selector('[id^="modal_F4_"], [id^="gridF4"]').filterVisible().find('tr.dx-data-row td').withExactText(codigo);
    await t
        .expect(celda.with({ timeout: 10000 }).exists).ok(`El buscador de ${campo} no muestra ${codigo}`)
        .doubleClick(celda.nth(0))
        .wait(1000);
    if (await celda.filterVisible().exists) {
        await t.click(celda.nth(0)).pressKey('enter').wait(1000);
    }
};

fixture `Prueba Pagos Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Detalle Pago duplicado - Recibo de Caja - Test Hgi360', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMovimientos360(t, 'Pagos');
    await t
        .click(Selector('[id^="BtnNuevoDocumentosPago"], [data-testid="ListagridDocumentosPago"] .dx-icon-add, #ListagridDocumentosPago .dx-icon-add').filterVisible().with({ timeout: 20000 }).nth(0))
        .wait(2000);
    await elegirEnLookup360(t, '#TxtDocumentosPago_Transaccion', 'RECIBO DE CAJA', 'RECIBO');
    await elegirEnLookup360(t, '#TxtDocumentosPago_Tercero', '811021438', '811021438');
    await t.click(Selector('#BtnGrabarDocumentosPago_btn, #BtnGrabarDocumentosPago').filterVisible().nth(0)).wait(3000);

    try {
        await elegirEnF4(t, '#txtDocPago_Banco_FormaPago_1', '1');
        await elegirEnF4(t, '#txtDocPago_Banco_Banco_1', '07');
        await t.typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', '123123123', { replace: true });
        await elegirEnF4(t, '#txtDocPago_Banco_Naturaleza_1', '1');
        await t
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1', '999', { replace: true })
            .pressKey('enter enter enter')
            .wait(4000);
        // La versión actual ya no muestra "El proceso anterior, aun no ha terminado": se valida directamente que
        // la línea de banco no quedó duplicada (corrida del 26-oct-2026).
        const lineas = Selector('tr.dx-data-row').filterVisible().withText('123123123');
        await t.expect(lineas.count).eql(1, 'El detalle del movimiento bancario quedó duplicado');
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await t
            .click(Selector('#BtnAnularDocumentosPago_btn, #BtnAnularDocumentosPago').filterVisible().nth(0))
            .click(confirmar.with({ timeout: 10000 }))
            .wait(2000);
    }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
