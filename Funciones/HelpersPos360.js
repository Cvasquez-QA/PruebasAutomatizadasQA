import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    filtrarPor
} from './HelpersHgi360Web.js';
import { numeroDesdeTexto } from './HelpersDocumentos360.js';

/**
 * Punto de Venta y Movimientos de Caja en test.hgi360.com (React), módulo POS.
 *
 * Revisado en el navegador con AutPos, caja 10 (19-oct-2026):
 *  - Movimientos > Punto de Venta abre el modal de caja: #modalPuntoDeVenta_Caja (lookup) e
 *    #PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar. Si la caja quedó abierta en otra sesión sale
 *    "La caja se encuentra en operación por... ¿Deseas cerrar la operación?" (button.swal2-confirm).
 *  - La pantalla se abre a pantalla completa (sin encabezado). Transacción #PuntoDeVenta_Transaccion,
 *    total #PuntoDeVenta_Total. Hay un documento temporal (número negativo) que se reutiliza entre
 *    entradas, por eso las validaciones se hacen sobre la diferencia del total.
 *  - Línea: #txtPuntoDeVenta_Detalle_Producto_cursor_1 + Enter (carga el precio, cantidad en 0 y foco
 *    a Descripción), #txtPuntoDeVenta_Detalle_Cantidad_cursor_1 y botón #txtPuntoDeVenta_Detalle_Boton_1.
 *  - Pago: #PuntoDeVenta_BtnPago > modal #PuntoDeVenta_ModalPagoDocumento (total en _PagoTotal).
 *    Forma de pago: botón #txtPuntoDeVentaPagoPos_Detalle_FPago_cursor_1_tarjeta abre
 *    "Seleccionar forma de pago" (doble clic en la fila Efectivo); valor
 *    #txtPuntoDeVentaPagoPos_Detalle_Valor_cursor_1 + Enter.
 *    Finalizar (#..._BtnAceptar) abre el PDF de la factura en la misma pestaña; por eso se usa
 *    #PuntoDeVenta_ModalPagoDocumento_BtnNoImprimir.
 *  - #PuntoDeVenta_BtnSalir cierra la pestaña del POS y vuelve a mostrar el encabezado
 *    (no hace falta cerrarPestana360 después).
 *  - Movimientos de Caja: caja #txtMovimientosCaja_StrIdCaja (lookup), #BtnActualizarCajaMov,
 *    #BtnAbrirCajaMov, #BtnRetiroParcialMov, #BtnCerrarCajaMov y grid [data-testid="gridMovimientosCaja"]
 *    (Desde, Hasta, Caja, Fecha de apertura, ..., Base, Ventas, Retiros, Saldo, Estado).
 */

export const CAJA_PV = '10 - Caja Automatizacion';
export const CODIGO_CAJA_PV = '10';
export const TX_PV_FILTRO = '0101';
export const TX_PV = '0101 - PRUEBA FACTURA PV';
export const PRODUCTO_PV = '010203';

const confirmar = Selector('button.swal2-confirm').filterVisible();
const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-item-content');
const productoPV = Selector('#txtPuntoDeVenta_Detalle_Producto_cursor_1');
const totalPV = Selector('#PuntoDeVenta_Total');
const modalPago = Selector('#PuntoDeVenta_ModalPagoDocumento').filterVisible();
const toastExito = Selector('.erp-toast[data-type="success"]').filterVisible();

/** Valor numérico de un control (input de dx o texto). */
async function leerNumero(selector) {
    const sel = Selector(selector);
    const input = sel.find('.dx-texteditor-input');
    if (await input.exists) {
        return numeroDesdeTexto(await input.value);
    }
    const valor = await sel.value;
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        return numeroDesdeTexto(valor);
    }
    return numeroDesdeTexto(await sel.innerText);
}

/** Total actual del documento del Punto de Venta. */
export const leerTotalPV = () => leerNumero('#PuntoDeVenta_Total');

/** Abre Movimientos > Punto de Venta con la caja indicada. */
export async function abrirPuntoDeVenta360(t, caja = CAJA_PV) {
    await abrirMovimientos360(t, 'Punto de Venta');
    await t
        .expect(Selector('#modalPuntoDeVenta_Caja .dx-lookup-field').with({ timeout: 20000 }).visible)
        .ok('No apareció la selección de caja del Punto de Venta')
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(opciones.withText(caja))
        .click('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar');

    // La caja puede estar en operación por otra sesión: se cierra esa operación y se sigue
    if (await confirmar.with({ timeout: 6000 }).exists) {
        await t.click(confirmar);
    }
    await t
        .expect(Selector('#PuntoDeVenta_Transaccion').with({ timeout: 30000 }).visible)
        .ok('No abrió la pantalla del Punto de Venta')
        .wait(2000);
}

/** Elige la transacción del Punto de Venta. */
export async function elegirTransaccionPV(t, filtro = TX_PV_FILTRO, texto = TX_PV) {
    await t.click('#PuntoDeVenta_Transaccion .dx-lookup-field');
    if (await Selector('.dx-overlay-content').filterVisible().find('.dx-texteditor-input').exists) {
        await filtrarPor(t, filtro);
    }
    await t
        .click(opciones.withText(texto))
        .wait(2000)
        .expect(Selector('#PuntoDeVenta_Transaccion').withText(texto.split(' - ')[0]).exists)
        .ok(`No quedó la transacción ${texto}`, { timeout: 10000 });
}

/** Espera hasta que el total cumpla la condición. */
export async function esperarTotalPV(t, cumple, mensaje, espera = 15000) {
    const inicio = Date.now();
    let total = await leerTotalPV();
    while (!cumple(total) && Date.now() - inicio < espera) {
        await t.wait(500);
        total = await leerTotalPV();
    }
    await t.expect(cumple(total)).ok(`${mensaje} (total actual: ${total})`);
    return total;
}

/** Vende un producto: lo escribe, pone la cantidad y graba la línea. Devuelve el total nuevo. */
export async function agregarProductoPV(t, producto = PRODUCTO_PV, cantidad = '1') {
    const totalAntes = await leerTotalPV();
    await t
        .expect(productoPV.with({ timeout: 15000 }).exists).ok('No se ve la línea de captura del Punto de Venta')
        .typeText(productoPV, String(producto), { replace: true })
        .pressKey('enter')
        // La app carga el producto (~1 s), deja la cantidad en 0 y pasa el foco a la descripción
        .expect(productoPV.focused).notOk(`No terminó de cargar el producto ${producto}`, { timeout: 10000 })
        .wait(800)
        .typeText('#txtPuntoDeVenta_Detalle_Cantidad_cursor_1', String(cantidad), { replace: true })
        .click('#txtPuntoDeVenta_Detalle_Boton_1')
        .expect(toastExito.withText('guardado').with({ timeout: 15000 }).exists)
        .ok(`No se grabó la línea del producto ${producto}`);
    return esperarTotalPV(t, total => total > totalAntes, 'El total del Punto de Venta no aumentó al grabar la línea');
}

/** Paga en efectivo el total y finaliza sin imprimir. Devuelve el valor pagado. */
export async function pagarEfectivoPV(t) {
    await t
        .click(Selector('#PuntoDeVenta_BtnPago').filterVisible().with({ timeout: 10000 }))
        .expect(modalPago.with({ timeout: 15000 }).exists).ok('No abrió el modal de pago');

    const totalPago = await leerNumero('#PuntoDeVenta_ModalPagoDocumento_PagoTotal');
    await t.expect(totalPago).gt(0, 'El total a pagar está en 0');

    const filaEfectivo = Selector('tr.dx-data-row').filterVisible().withText('Efectivo');
    await t
        .click('#txtPuntoDeVentaPagoPos_Detalle_FPago_cursor_1_tarjeta')
        .expect(filaEfectivo.with({ timeout: 10000 }).exists).ok('No apareció la forma de pago Efectivo')
        .doubleClick(filaEfectivo.nth(0))
        .wait(800)
        .typeText('#txtPuntoDeVentaPagoPos_Detalle_Valor_cursor_1', String(Math.round(totalPago)), { replace: true })
        .pressKey('enter')
        .wait(2000)
        .click('#PuntoDeVenta_ModalPagoDocumento_BtnNoImprimir')
        .expect(modalPago.exists).notOk('El documento no se finalizó', { timeout: 60000 })
        .wait(2000);
    if (await confirmar.with({ timeout: 3000 }).exists) {
        await t.click(confirmar);
    }
    return totalPago;
}

/** Sale del Punto de Venta (cierra su pestaña). */
export async function salirPuntoDeVenta360(t) {
    await t.click(Selector('#PuntoDeVenta_BtnSalir').filterVisible().with({ timeout: 10000 }));
    if (await confirmar.with({ timeout: 3000 }).exists) {
        await t.click(confirmar);
    }
    await t
        .expect(Selector('#PuntoDeVenta_BtnSalir').filterVisible().exists).notOk('No salió del Punto de Venta', { timeout: 15000 })
        .wait(1500);
}

/** Abre el Punto de Venta, vende un producto, lo paga en efectivo y sale. Devuelve el valor del documento. */
export async function venderEnPuntoDeVenta360(t, { caja = CAJA_PV, filtroTx = TX_PV_FILTRO, transaccion = TX_PV, producto = PRODUCTO_PV, cantidad = '1' } = {}) {
    await abrirPuntoDeVenta360(t, caja);
    await elegirTransaccionPV(t, filtroTx, transaccion);
    await agregarProductoPV(t, producto, cantidad);
    const valor = await pagarEfectivoPV(t);
    await salirPuntoDeVenta360(t);
    return valor;
}

// ---------------------------------------------------------------- Movimientos de Caja

const leerFilaCajaCliente = ClientFunction(() => {
    const grid = document.querySelector('[data-testid="gridMovimientosCaja"]');
    if (!grid) {
        return null;
    }
    const encabezados = [...grid.querySelectorAll('.dx-header-row td')]
        .map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase());
    const filas = [...grid.querySelectorAll('tr.dx-data-row')];
    if (!filas.length) {
        return null;
    }
    const iEstado = encabezados.indexOf('estado');
    const abierta = filas.find(f => /abiert/i.test(f.cells[iEstado] ? f.cells[iEstado].innerText : ''));
    const fila = abierta || filas[0];
    const datos = {};
    encabezados.forEach((nombre, i) => {
        if (nombre) {
            datos[nombre] = (fila.cells[i] ? fila.cells[i].innerText : '').trim();
        }
    });
    return datos;
});

/** Abre Movimientos > Movimientos de Caja, elige la caja y actualiza el grid. */
export async function abrirMovimientosDeCaja360(t, caja = CAJA_PV) {
    await abrirMovimientos360(t, 'Movimientos de Caja');
    await t
        .expect(Selector('#txtMovimientosCaja_StrIdCaja .dx-lookup-field').with({ timeout: 20000 }).visible)
        .ok('No abrió Movimientos de Caja')
        .click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field')
        .click(opciones.withText(caja))
        .wait(1500);
    await actualizarMovimientosDeCaja360(t);
}

export async function actualizarMovimientosDeCaja360(t) {
    await t
        .click(Selector('#BtnActualizarCajaMov').filterVisible())
        .wait(4000);
}

/**
 * Lee la fila de la caja (la abierta, o la primera): { base, ventas, retiros, saldo, estado, texto }.
 * Reintenta mientras el grid carga.
 */
export async function leerMovimientoCaja360(t) {
    let fila = null;
    for (const inicio = Date.now(); !fila && Date.now() - inicio < 20000;) {
        fila = await leerFilaCajaCliente();
        if (!fila) {
            await t.wait(1000);
        }
    }
    await t.expect(fila).ok('El grid de Movimientos de Caja no tiene filas para la caja');
    return {
        base: numeroDesdeTexto(fila.base),
        ventas: numeroDesdeTexto(fila.ventas),
        retiros: numeroDesdeTexto(fila.retiros),
        saldo: numeroDesdeTexto(fila.saldo),
        estado: fila.estado,
        texto: fila
    };
}

export { cerrarPestana360 };
