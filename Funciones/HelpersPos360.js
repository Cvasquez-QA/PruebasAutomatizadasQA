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
 *    entradas, por eso las validaciones se hacen sobre la diferencia del total. La línea de captura está
 *    deshabilitada hasta pulsar Guardar (#PuntoDeVenta_BtnGuardarDocumento) en el encabezado.
 *  - Línea: #txtPuntoDeVenta_Detalle_Producto_1 + Enter (carga el precio, cantidad en 0 y foco
 *    a Descripción), #txtPuntoDeVenta_Detalle_Cantidad_1 y botón #txtPuntoDeVenta_Detalle_Boton_1
 *    (sin "_cursor", a diferencia de Documentos; ver campoLineaPV).
 *  - Pago: #PuntoDeVenta_BtnPago > modal #PuntoDeVenta_ModalPagoDocumento (total en _PagoTotal).
 *    Forma de pago: botón #txtPuntoDeVentaPagoPos_Detalle_FPago_cursor_1_tarjeta abre
 *    "Seleccionar forma de pago" (doble clic en la fila Efectivo); valor
 *    #txtPuntoDeVentaPagoPos_Detalle_Valor_cursor_1 + Enter.
 *    Finalizar (#..._BtnAceptar) abre el PDF de la factura en la misma pestaña; por eso se usa
 *    #PuntoDeVenta_ModalPagoDocumento_BtnNoImprimir. #..._BtnCancelar cierra el modal sin pagar.
 *    Pagos registrados: grid #PuntoDeVenta_ModalPagoDocumento_gridMovimientos (acciones Editar / Eliminar);
 *    popup de formas de pago #PuntoDeVenta_modal_F4_FormaPago; Recibido _RecibidoPos y Cambio _CambioPos.
 *  - #PuntoDeVenta_BtnEliminarDocumento (Eliminar + confirmar) borra el temporal: "Documento eliminado con éxito".
 *    Si tiene pagos sale "No se puede eliminar el documento porque tiene pagos": hay que borrar antes los pagos.
 *  - #PuntoDeVenta_BtnSalir cierra la pestaña del POS y vuelve a mostrar el encabezado
 *    (no hace falta cerrarPestana360 después).
 *  - Movimientos de Caja: caja #txtMovimientosCaja_StrIdCaja (lookup), #BtnActualizarCajaMov,
 *    #BtnAbrirCajaMov, #BtnRetiroParcialMov, #BtnCerrarCajaMov y grid #gridMovimientosCaja
 *    (Desde, Hasta, Caja, Fecha de apertura, ..., Base, Ventas, Retiros, Saldo, Estado).
 */

export const CAJA_PV = '10Au - Caja Automatizacion';
export const CODIGO_CAJA_PV = '10Au';
export const TX_PV_FILTRO = '0101';
export const TX_PV = '0101 - PRUEBA FACTURA PV';
export const PRODUCTO_PV = '010203';

const confirmar = Selector('button.swal2-confirm').filterVisible();
const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-item-content');
/**
 * Campo de la línea de captura. En Documentos el input es #txtDocumento_Detalle_<Campo>_cursor_1, pero en el
 * Punto de Venta el input no lleva "_cursor" (#txtPuntoDeVenta_Detalle_<Campo>_1). Se aceptan las dos formas
 * (el id puede estar en el input o en su contenedor).
 */
const campoLineaPV = (campo, prefijo = 'txtPuntoDeVenta_Detalle') => Selector(
    `input#${prefijo}_${campo}_cursor_1, #${prefijo}_${campo}_cursor_1 input.dx-texteditor-input, ` +
    `input#${prefijo}_${campo}_1, #${prefijo}_${campo}_1 input.dx-texteditor-input`
).filterVisible().nth(0);
const productoPV = campoLineaPV('Producto');
const cantidadPV = campoLineaPV('Cantidad');
const valorPagoPV = campoLineaPV('Valor', 'txtPuntoDeVentaPagoPos_Detalle');
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

/**
 * Elige una caja en el lookup abierto. La lista solo muestra las primeras cajas (la 10Au no sale sin filtrar),
 * por eso primero se escribe el código en el buscador del lookup.
 */
async function elegirCaja(t, caja) {
    const codigo = String(caja).split(' - ')[0].trim();
    const buscador = Selector('.dx-overlay-content').filterVisible().find('input.dx-texteditor-input');
    if (await buscador.with({ timeout: 5000 }).exists) {
        await t.typeText(buscador.nth(0), codigo, { replace: true }).wait(2500);
    }
    const opcion = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item')
        .withText(new RegExp(`^\\s*${codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+-`));
    await t
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No apareció la caja "${caja}" en la lista`)
        .click(opcion.nth(0));
}

/** Abre Movimientos > Punto de Venta con la caja indicada. */
export async function abrirPuntoDeVenta360(t, caja = CAJA_PV) {
    await abrirMovimientos360(t, 'Punto de Venta');
    await t
        .expect(Selector('#modalPuntoDeVenta_Caja .dx-lookup-field').with({ timeout: 20000 }).visible)
        .ok('No apareció la selección de caja del Punto de Venta')
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field');
    await elegirCaja(t, caja);
    await t.click('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar');

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
    const contenedorProducto = Selector('#txtPuntoDeVenta_Detalle_Producto_1');
    await t.expect(contenedorProducto.with({ timeout: 15000 }).exists).ok('No se ve la línea de captura del Punto de Venta');

    // La línea queda deshabilitada hasta guardar el encabezado del documento (revisado el 21-oct-2026)
    if (await contenedorProducto.hasClass('dx-state-disabled')) {
        await t.click(Selector('#PuntoDeVenta_BtnGuardarDocumento').filterVisible());
        await t.expect(contenedorProducto.hasClass('dx-state-disabled')).notOk(
            'La línea del Punto de Venta sigue deshabilitada después de guardar el encabezado', { timeout: 15000 });
    }

    const totalAntes = await leerTotalPV();
    await t
        .typeText(productoPV, String(producto), { replace: true })
        .pressKey('enter')
        // La app carga el producto (~1 s), deja la cantidad en 0 y pasa el foco a la descripción
        .expect(productoPV.focused).notOk(`No terminó de cargar el producto ${producto}`, { timeout: 10000 })
        .wait(800)
        .typeText(cantidadPV, String(cantidad), { replace: true })
        .click(Selector('#txtPuntoDeVenta_Detalle_Boton_1').filterVisible());
    // El aviso "Documento guardado con éxito" dura poco: se valida con el total
    return esperarTotalPV(t, total => total > totalAntes, `No se grabó la línea del producto ${producto} (el total no aumentó)`);
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
        .typeText(valorPagoPV, String(Math.round(totalPago)), { replace: true })
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

const gridPagos = Selector('#PuntoDeVenta_ModalPagoDocumento_gridMovimientos');
const filasPago = gridPagos.find('tr.dx-data-row');

/** Abre el modal de pago (si no está abierto). */
export async function abrirPagoPV(t) {
    if (!await modalPago.exists) {
        await t.click(Selector('#PuntoDeVenta_BtnPago').filterVisible().with({ timeout: 10000 }));
    }
    await t.expect(modalPago.with({ timeout: 15000 }).exists).ok('No abrió el modal de pago');
}

/** Valores del modal de pago: { total, recibido, cambio }. */
export async function leerPagoPV() {
    return {
        total: await leerNumero('#PuntoDeVenta_ModalPagoDocumento_PagoTotal'),
        recibido: await leerNumero('#PuntoDeVenta_ModalPagoDocumento_RecibidoPos'),
        cambio: await leerNumero('#PuntoDeVenta_ModalPagoDocumento_CambioPos')
    };
}

/** Cierra el modal de pago con Cancelar (no paga ni envía a la DIAN) y acepta el aviso si aparece. */
export async function cancelarPagoPV(t) {
    await t
        .click(Selector('#PuntoDeVenta_ModalPagoDocumento_BtnCancelar').filterVisible())
        .expect(modalPago.exists).notOk('No se cerró el modal de pago con Cancelar', { timeout: 10000 });
    // Si el pago quedó incompleto sale "El documento no ha sido cancelado en su totalidad" (Confirmar)
    if (await confirmar.with({ timeout: 4000 }).exists) {
        await t.click(confirmar);
    }
}

/**
 * Diligencia la grid de forma de pago: Forma de pago 1 - Efectivo y Valor = total a pagar (+ Enter).
 * Devuelve { total, recibido, cambio } después de agregar el pago.
 */
export async function registrarPagoEfectivoPV(t) {
    await abrirPagoPV(t);
    const { total } = await leerPagoPV();
    await t.expect(total).gt(0, 'El total a pagar está en 0');

    const filaEfectivo = Selector('#PuntoDeVenta_modal_F4_FormaPago tr.dx-data-row').filterVisible().withText(/^\s*1\s+Efectivo\s*$/);
    const filasAntes = await filasPago.count;
    await t
        .click('#txtPuntoDeVentaPagoPos_Detalle_FPago_cursor_1_tarjeta')
        .expect(filaEfectivo.with({ timeout: 10000 }).exists).ok('No apareció la forma de pago 1 Efectivo')
        .doubleClick(filaEfectivo.find('td').nth(1))
        .expect(Selector('#txtPuntoDeVentaPagoPos_Detalle_FPago_cursor_1_tarjeta').withText('Efectivo').exists)
        .ok('No quedó seleccionada la forma de pago Efectivo', { timeout: 10000 })
        .typeText(valorPagoPV, String(Math.round(total)), { replace: true })
        .pressKey('enter')
        .expect(filasPago.count).gt(filasAntes, 'No se agregó la línea de pago', { timeout: 10000 })
        .wait(1000);
    return leerPagoPV();
}

/** Borra todas las líneas de pago del modal (botón Eliminar de cada fila). */
export async function eliminarPagosPV(t) {
    await abrirPagoPV(t);
    for (let intentos = 0; await filasPago.count > 0 && intentos < 10; intentos++) {
        const antes = await filasPago.count;
        await t.click(filasPago.nth(0).find('[aria-label="Eliminar"]'));
        if (await confirmar.with({ timeout: 2000 }).exists) {
            await t.click(confirmar);
        }
        await t.expect(filasPago.count).lt(antes, 'No se eliminó la línea de pago', { timeout: 10000 });
    }
    await t.expect(filasPago.count).eql(0, 'Quedaron líneas de pago en el documento');
}

/** Intenta eliminar el temporal con pagos y valida el aviso "No se puede eliminar el documento porque tiene pagos". */
export async function validarNoEliminaConPagosPV(t) {
    const aviso = Selector('.swal2-popup').filterVisible().withText(/no se puede eliminar.*tiene pagos/i);
    await t
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento').filterVisible().with({ timeout: 10000 }))
        .click(confirmar.with({ timeout: 10000 }))
        .expect(aviso.with({ timeout: 15000 }).exists)
        .ok('No apareció el aviso "No se puede eliminar el documento porque tiene pagos"')
        .click(confirmar);
    await t.expect(await leerTotalPV()).gt(0, 'El documento se eliminó aunque tenía pagos');
}

/** Elimina el documento temporal del Punto de Venta y valida que el total quede en 0. */
export async function eliminarTemporalPV(t) {
    await t
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento').filterVisible().with({ timeout: 10000 }))
        .click(confirmar.with({ timeout: 10000 }))
        .expect(Selector('.erp-toast').filterVisible().withText(/eliminado/i).with({ timeout: 15000 }).exists)
        .ok('No apareció "Documento eliminado con éxito"');
    await esperarTotalPV(t, total => total === 0, 'El total no quedó en 0 después de eliminar el temporal');
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
// Revisado en el navegador el 21-oct-2026 (caja 10, AutPos):
//  - Caja #txtMovimientosCaja_StrIdCaja (lookup), fechas/usuarios de apertura y cierre
//    #txtMovimientosCaja_DatFechaA/_DatFechaC/_StrIdUsuarioA/_StrIdUsuarioC.
//  - Botones #BtnAbrirCajaMov, #BtnRetiroParcialMov, #BtnCerrarCajaMov, #BtnActualizarCajaMov
//    (Abrir habilitado solo con la caja cerrada; Retiro y Cierre solo con la caja abierta).
//  - "Detalle de caja" (.movimientos-de-caja-estado): Base Inicial (.EstadoMovimientosCaja_Base),
//    Efectivo en Caja (.EstadoMovimientosCaja_EfectivoCaja), cuadros por medio de pago
//    (button.movimientos-de-caja-medio) y pestañas Ventas / Devoluciones / Recaudos / Egresos.
//  - Grid de sesiones #gridMovimientosCaja: Caja, Fecha de apertura, Usuario de apertura, Fecha de cierre,
//    Usuario de cierre, Base, Ventas, Retiros, Saldo, Estado. Filtra por fecha (Desde/Hasta, mes actual).
//  - Abrir / Retiro parcial / Cierre abren un popup con grid de formas de pago (#gridDetalleApertura,
//    #gridDetalleRetiroParcial, #gridDetalleCierre) con una fila nueva: Forma de Pago (lista), Denominación,
//    Cantidad, Valor Unitario. Botones #BtnConfirmarAbrirCajaMov / #BtnConfirmarRetiroCajaMov /
//    #BtnConfirmarCerrarCajaMov. Avisos: "Caja abierta exitosamente", "Retiro parcial exitoso",
//    "Caja cerrada exitosamente". Al confirmar, la app abre el documento en una pestaña nueva.

const estadoCaja = Selector('.movimientos-de-caja-estado');

/** Abre Movimientos > Movimientos de Caja y elige la caja. */
export async function abrirMovimientosDeCaja360(t, caja = CAJA_PV) {
    await abrirMovimientos360(t, 'Movimientos de Caja');
    await t
        .expect(Selector('#txtMovimientosCaja_StrIdCaja .dx-lookup-field').with({ timeout: 20000 }).visible)
        .ok('No abrió Movimientos de Caja')
        .click('#txtMovimientosCaja_StrIdCaja .dx-lookup-field');
    await elegirCaja(t, caja);
    await t
        .expect(estadoCaja.with({ timeout: 15000 }).exists).ok('No cargó el Detalle de caja')
        .wait(2000);
}

export async function actualizarMovimientosDeCaja360(t) {
    await t.click(Selector('#BtnActualizarCajaMov').filterVisible()).wait(4000);
}

const leerEstadoCajaCliente = ClientFunction(() => {
    const est = document.querySelector('.movimientos-de-caja-estado');
    if (!est) {
        return null;
    }
    const campo = clase => {
        const e = est.querySelector(`.${clase} input`);
        return e ? e.value : '';
    };
    const medios = {};
    est.querySelectorAll('button.movimientos-de-caja-medio').forEach(b => {
        const partes = b.innerText.trim().split(/\n+/);
        medios[partes[0].trim()] = partes[partes.length - 1].trim();
    });
    return { base: campo('EstadoMovimientosCaja_Base'), efectivoCaja: campo('EstadoMovimientosCaja_EfectivoCaja'), medios };
});

const leerVentasCajaCliente = ClientFunction(() => {
    const grid = [...document.querySelectorAll('.movimientos-de-caja-estado .dx-datagrid')].find(g => g.getClientRects().length > 0);
    if (!grid) {
        return [];
    }
    return [...grid.querySelectorAll('tr.dx-data-row')].map(f => [...f.cells].map(c => c.innerText.trim()));
});

/**
 * Estado de la caja abierta: { base, efectivoCaja, efectivo, ventas: [{ transaccion, documento, tercero, valor }] }.
 * Las ventas se leen de la pestaña Ventas del Detalle de caja.
 */
export async function leerEstadoCaja360(t) {
    const pestanaVentas = estadoCaja.find('[role="tab"]').withExactText('Ventas');
    if (await pestanaVentas.exists) {
        await t.click(pestanaVentas).wait(1500);
    }
    const crudo = await leerEstadoCajaCliente();
    await t.expect(crudo).ok('No se encontró el Detalle de caja');
    const ventas = (await leerVentasCajaCliente()).map(c => ({
        transaccion: c[0], documento: c[1], tercero: c[2], valor: numeroDesdeTexto(c[3])
    }));
    return {
        base: numeroDesdeTexto(crudo.base),
        efectivoCaja: numeroDesdeTexto(crudo.efectivoCaja),
        efectivo: numeroDesdeTexto(crudo.medios.Efectivo),
        ventas
    };
}

const leerSesionesCajaCliente = ClientFunction(() => {
    const grid = document.querySelector('#gridMovimientosCaja');
    if (!grid) {
        return [];
    }
    const encabezados = [...grid.querySelectorAll('.dx-header-row td')].map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase());
    return [...grid.querySelectorAll('tr.dx-data-row')].map(f => {
        const datos = {};
        encabezados.forEach((n, i) => { datos[n] = f.cells[i] ? f.cells[i].innerText.trim() : ''; });
        return datos;
    });
});

/** Filas del grid de sesiones de caja (claves: caja, fecha de apertura, usuario de apertura, fecha de cierre, ...). */
export async function leerSesionesCaja360() {
    return leerSesionesCajaCliente();
}

const cajaAbierta = async () => {
    const boton = Selector('#BtnCerrarCajaMov');
    return await boton.exists && !await boton.hasClass('dx-state-disabled');
};
export const cajaEstaAbierta360 = cajaAbierta;

/** Después de abrir / retirar / cerrar la app abre el documento en otra pestaña: se vuelve a la principal. */
async function volverAVentanaPrincipal(t) {
    await t.wait(3000);
    try {
        await t.switchToParentWindow();
    } catch (e) {
        // No se abrió otra ventana: se sigue en la misma
    }
}

/** Llena la fila nueva de un grid de formas de pago (apertura, retiro o cierre). */
async function llenarFormaPagoCaja(t, gridId, { forma = 'Efectivo', cantidad = 1, valor }) {
    const fila = Selector(`#${gridId} tr.dx-row-inserted`).filterVisible();
    const celda = n => fila.find(`td[aria-colindex="${n}"]`);
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No apareció la fila de forma de pago en ${gridId}`)
        .click(celda(1).find('.dx-dropdowneditor-button'))
        .click(Selector('.dx-overlay-content .dx-list-item').filterVisible().withExactText(forma))
        .click(celda(3))
        .typeText(celda(3).find('input.dx-texteditor-input'), String(cantidad), { replace: true })
        .pressKey('tab')
        .typeText(celda(4).find('input.dx-texteditor-input'), String(valor), { replace: true })
        .pressKey('tab')
        .wait(800);
}

async function confirmarAvisoCaja(t, texto) {
    await t
        .expect(Selector('.swal2-popup').filterVisible().withText(texto).with({ timeout: 20000 }).exists)
        .ok(`No apareció el aviso "${texto}"`)
        .click(confirmar);
    await volverAVentanaPrincipal(t);
}

/** Cierra la caja contando el total en caja en efectivo (1 x total). Devuelve el total contado. */
export async function cerrarCaja360(t) {
    await t.click(Selector('#BtnCerrarCajaMov').filterVisible());
    const popup = Selector('.dx-popup-wrapper .dx-overlay-content').filterVisible().withText('Cierre de Caja');
    await t.expect(popup.with({ timeout: 15000 }).exists).ok('No abrió el Cierre de Caja');
    const total = numeroDesdeTexto(((await popup.innerText).match(/Total en caja\s*\$?\s*([\d.,-]+)/i) || [])[1]);
    await llenarFormaPagoCaja(t, 'gridDetalleCierre', { forma: 'Efectivo', cantidad: 1, valor: Math.round(total) });
    await t.click(Selector('#BtnConfirmarCerrarCajaMov').filterVisible());
    await confirmarAvisoCaja(t, 'Caja cerrada exitosamente');
    return total;
}

/** Abre la caja con una base en efectivo (cantidad x valor). */
export async function abrirCaja360(t, { cantidad = 1, valor = 10000 } = {}) {
    await t
        .expect(Selector('#BtnAbrirCajaMov').hasClass('dx-state-disabled')).notOk('La caja ya está abierta', { timeout: 10000 })
        .click(Selector('#BtnAbrirCajaMov').filterVisible());
    await llenarFormaPagoCaja(t, 'gridDetalleApertura', { forma: 'Efectivo', cantidad, valor });
    await t.click(Selector('#BtnConfirmarAbrirCajaMov').filterVisible());
    await confirmarAvisoCaja(t, 'Caja abierta exitosamente');
}

/** Retiro parcial en efectivo (cantidad x valor). */
export async function retiroParcialCaja360(t, { cantidad = 1, valor }) {
    await t.click(Selector('#BtnRetiroParcialMov').filterVisible());
    await llenarFormaPagoCaja(t, 'gridDetalleRetiroParcial', { forma: 'Efectivo', cantidad, valor });
    await t.click(Selector('#BtnConfirmarRetiroCajaMov').filterVisible());
    await confirmarAvisoCaja(t, 'Retiro parcial exitoso');
}

/** Deja la caja abierta: si está cerrada la abre con la base indicada. */
export async function asegurarCajaAbierta360(t, base = { cantidad: 1, valor: 10000 }) {
    if (!await cajaAbierta()) {
        await abrirCaja360(t, base);
        await actualizarMovimientosDeCaja360(t);
    }
}

export { cerrarPestana360 };
