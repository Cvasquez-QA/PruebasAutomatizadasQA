import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMovimientos360,
    filtrarPor,
    seleccionarOpcion
} from './HelpersHgi360Web.js';

/**
 * Movimientos > Documentos en test.hgi360.com (React).
 *
 * Selectores revisados en el navegador con AutPos (19-oct-2026):
 *  - Transacción  #Documento_Transaccion (lookup con buscador)   Documento  #txtDocumento
 *  - Botones      #BtnNuevoDocumento_btn  #BtnGuardarDocumento_btn  #BtnEliminarDocumento_btn  #BtnDian
 *  - Tercero      #Documento_Tercero (lookup)                    Dependencia #Documento_Dependencia
 *  - Línea de captura (siempre la 1): #txtDocumento_Detalle_<Campo>_cursor_1 y botón #txtDocumento_Detalle_Boton_1
 *    Al confirmar el producto con Enter la app lo carga (~1 s) y mueve el foco (Remesa, Descripción o
 *    Cantidad según la transacción): se espera a que el foco salga del producto.
 *  - Líneas grabadas: grid [data-testid="gridDocumentosConsulta"]; columnas por nombre
 *    (Producto, Cantidad, Valor unitario, Valor total, IVA, Total...). Acciones de fila .erp-grid-action-glyph
 *    (por fila: editar, eliminar).
 *  - Totales  #txtDocumento_SubTotal  _Iva  _ImpCon  _Total  _Valor  _Neto (.dx-texteditor-input)
 *  - Descargar pedido: #Documento_Descargar_Pedido > "Cargar un solo Pedido" > grid
 *    [data-testid="gridPedidos_documentos"] (checkbox por fila) > #btnCargarPedidos_documentos_btn
 *  - Confirmaciones: button.swal2-confirm   Aviso de guardado: .erp-toast "Documento guardado con éxito"
 */

export const confirmarDialogo = Selector('button.swal2-confirm').filterVisible();
const avisoError = Selector('.erp-toast[data-type="error"], .erp-toast[data-type="warning"]').filterVisible();
const numeroDocumento = Selector('#txtDocumento .dx-texteditor-input');
const productoCaptura = Selector('#txtDocumento_Detalle_Producto_cursor_1');
// Igual que en AdministrativoHgi360Web/Documentos.js (validado): en la pantalla solo el detalle tiene estas acciones
const accionesDetalle = Selector('.erp-grid-action-glyph').filterVisible();

// El total se recalcula entre 2 y 5 s después de grabar o eliminar una línea.
const ESPERA_TOTAL = 15000;

/** '5.000,000' -> 5000 ; '-1.234,50' -> -1234.5 */
export const numeroDesdeTexto = texto => {
    const coincidencias = String(texto ?? '').match(/-?[\d.]+(,\d+)?/g);
    if (!coincidencias) {
        return 0;
    }
    const limpio = coincidencias[coincidencias.length - 1].replace(/\./g, '').replace(',', '.');
    return Number(limpio) || 0;
};

const leerTotalesCliente = ClientFunction(() => {
    const valor = id => {
        const input = document.querySelector(`#txtDocumento_${id} .dx-texteditor-input`);
        return input ? input.value : '';
    };
    return {
        subtotal: valor('SubTotal'),
        iva: valor('Iva'),
        impcon: valor('ImpCon'),
        total: valor('Total'),
        valor: valor('Valor'),
        neto: valor('Neto'),
        rtefte: valor('RteFte'),
        retiva: valor('RetIva'),
        retica: valor('RetIca')
    };
});

/** Totales del documento como números. */
export async function leerTotalesDocumento() {
    const crudos = await leerTotalesCliente();
    const totales = {};
    for (const clave of Object.keys(crudos)) {
        totales[clave] = numeroDesdeTexto(crudos[clave]);
    }
    return totales;
}

const leerDetalleCliente = ClientFunction(() => {
    const grid = document.querySelector('[data-testid="gridDocumentosConsulta"]');
    if (!grid) {
        return [];
    }
    const encabezados = [...grid.querySelectorAll('.dx-header-row td')]
        .map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase());
    return [...grid.querySelectorAll('tr.dx-data-row')].map(fila => {
        const datos = {};
        encabezados.forEach((nombre, i) => {
            if (nombre) {
                datos[nombre] = (fila.cells[i] ? fila.cells[i].innerText : '').trim();
            }
        });
        return datos;
    });
});

/**
 * Líneas grabadas del documento. Cada línea trae el texto de cada columna (claves en minúscula,
 * p. ej. 'producto', 'cantidad', 'valor total', 'iva', 'total') y los valores numéricos en `num`.
 */
export async function leerDetalleDocumento() {
    const filas = await leerDetalleCliente();
    return filas.map(fila => {
        const num = {};
        for (const clave of Object.keys(fila)) {
            num[clave] = numeroDesdeTexto(fila[clave]);
        }
        return { ...fila, num };
    });
}

/** Espera hasta que el total del documento cumpla la condición (o falla con el mensaje). */
export async function esperarTotalDocumento(t, cumple, mensaje) {
    const inicio = Date.now();
    let { total } = await leerTotalesDocumento();
    while (!cumple(total) && Date.now() - inicio < ESPERA_TOTAL) {
        await t.wait(500);
        ({ total } = await leerTotalesDocumento());
    }
    await t.expect(cumple(total)).ok(`${mensaje} (total actual: ${total})`);
    return total;
}

/** Espera hasta que el grid de detalle tenga `cantidad` líneas. */
export async function esperarLineasDocumento(t, cantidad, mensaje) {
    const inicio = Date.now();
    let lineas = await leerDetalleDocumento();
    while (lineas.length !== cantidad && Date.now() - inicio < ESPERA_TOTAL) {
        await t.wait(500);
        lineas = await leerDetalleDocumento();
    }
    await t.expect(lineas.length).eql(cantidad, mensaje || `El documento debería tener ${cantidad} líneas`);
    return lineas;
}

/** Elige la transacción en el lookup del encabezado. */
export async function elegirTransaccionDocumento(t, filtro, texto) {
    await t
        .expect(Selector('#Documento_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se ve el campo Transacción')
        .click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, filtro);
    await seleccionarOpcion(t, texto);
    await t.wait(1500);
}

/** Abre Movimientos > Documentos (si no está abierto), pulsa Nuevo y elige la transacción. */
export async function nuevoDocumento360(t, filtro, texto, { abrir = true } = {}) {
    if (abrir) {
        await abrirMovimientos360(t, 'Documentos');
        await t.expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 });
    }
    await t.click(Selector('#BtnNuevoDocumento_btn').filterVisible().with({ timeout: 15000 })).wait(1500);
    await elegirTransaccionDocumento(t, filtro, texto);
}

/** Elige el tercero del encabezado por su código (el nombre puede traer espacios dobles). */
export async function elegirTerceroDocumento(t, codigo) {
    await t.click('#Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, codigo);
    await seleccionarOpcion(t, new RegExp(`^\\s*${codigo} -`));
    await t
        .expect(Selector('#Documento_Tercero').withText(codigo).exists)
        .ok(`No quedó seleccionado el tercero ${codigo}`, { timeout: 5000 });
}

/** Escribe la dependencia del encabezado (campo numérico con lupa). */
export async function escribirDependenciaDocumento(t, dependencia) {
    await t.typeText('#Documento_Dependencia .dx-texteditor-input', String(dependencia), { replace: true }).pressKey('tab');
}

/** Guarda el encabezado; si el primer clic no guarda, reintenta una vez. Devuelve el número del documento. */
export async function guardarDocumento360(t) {
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
    if (!await numeroDocumento.value) {
        await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
    }
    const numero = await numeroDocumento.value;
    await t.expect(numero).ok('El documento no quedó guardado (sin número)');
    return numero;
}

async function escribirCampoCaptura(t, campo, valor) {
    const selector = Selector(`#txtDocumento_Detalle_${campo}_cursor_1`);
    await t
        .click(selector)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(selector, String(valor));
}

/** Escribe el producto en la línea de captura y espera a que la app lo cargue. */
export async function escribirProductoDocumento(t, producto) {
    await t
        .typeText(productoCaptura, String(producto), { replace: true })
        .pressKey('enter')
        .expect(productoCaptura.focused).notOk(`No terminó de cargar el producto ${producto}`, { timeout: 10000 })
        .wait(800);
}

/**
 * Agrega una línea: producto y, si se indican, cantidad y valor unitario; luego la graba.
 * Devuelve la cantidad de líneas que quedaron en el documento.
 */
export async function agregarLineaDocumento(t, producto, { cantidad = null, valor = null } = {}) {
    const antes = (await leerDetalleDocumento()).length;
    await escribirProductoDocumento(t, producto);
    if (cantidad !== null) {
        await escribirCampoCaptura(t, 'Cantidad', cantidad);
    }
    if (valor !== null) {
        await escribirCampoCaptura(t, 'ValorUnitario', valor);
    }
    await t.click('#txtDocumento_Detalle_Boton_1 .dx-icon-save').wait(1000);
    await t.expect(avisoError.exists).notOk(`La línea del producto ${producto} no se grabó`, { timeout: 1500 });
    const lineas = await esperarLineasDocumento(t, antes + 1, `No se grabó la línea del producto ${producto}`);
    return lineas.length;
}

/** Sube la línea `indice` (0 = primera) a la captura, cambia la cantidad y la graba. */
export async function editarCantidadLineaDocumento(t, indice, cantidad) {
    const lineas = await leerDetalleDocumento();
    await t.expect(lineas.length).gt(indice, `No existe la línea ${indice + 1} para editarla`);
    const producto = lineas[indice].producto;
    await t
        .click(accionesDetalle.nth(indice * 2))
        .expect(productoCaptura.value).eql(producto, 'La línea no cargó para editarla', { timeout: 10000 })
        .wait(500);
    await escribirCampoCaptura(t, 'Cantidad', cantidad);
    await t.click('#txtDocumento_Detalle_Boton_1 .dx-icon-save').wait(1500);
}

/** Elimina la línea `indice` (0 = primera). */
export async function eliminarLineaDocumento(t, indice) {
    const antes = (await leerDetalleDocumento()).length;
    await t
        .click(accionesDetalle.nth(indice * 2 + 1))
        .click(confirmarDialogo.with({ timeout: 10000 }));
    await esperarLineasDocumento(t, antes - 1, 'No se eliminó la línea');
}

/** Carga un documento existente de la transacción elegida escribiendo su número. */
export async function cargarDocumento360(t, numero) {
    await t
        .click(numeroDocumento)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(numeroDocumento, String(numero))
        .pressKey('enter')
        .wait(3000)
        .expect(numeroDocumento.value).eql(String(numero), `No cargó el documento ${numero}`, { timeout: 10000 });
}

/** Elimina el documento que está abierto. */
export async function eliminarDocumentoActual360(t) {
    await t
        .click(Selector('#BtnEliminarDocumento_btn').filterVisible())
        .click(confirmarDialogo.with({ timeout: 10000 }))
        .wait(3000)
        .expect(numeroDocumento.value).notOk('El documento no se eliminó', { timeout: 10000 });
}

/** Elimina un documento por transacción y número, si existe (para limpiar datos de prueba). */
export async function eliminarDocumentoSiExiste360(t, filtro, texto, numero) {
    if (!numero) {
        return;
    }
    await elegirTransaccionDocumento(t, filtro, texto);
    await t
        .click(numeroDocumento)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(numeroDocumento, String(numero))
        .pressKey('enter')
        .wait(3000);
    if (await numeroDocumento.value === String(numero)) {
        await eliminarDocumentoActual360(t);
    }
}

/** Descarga un pedido en el documento abierto (Descargar pedido > Cargar un solo Pedido). */
export async function cargarPedidoEnDocumento360(t, numeroPedido) {
    const campoPedido = Selector('#Documento_Pedido .dx-texteditor-input');
    if (await campoPedido.hasAttribute('disabled') === false) {
        await t.typeText(campoPedido, String(numeroPedido), { replace: true }).pressKey('enter');
    }
    const filaPedido = Selector('[data-testid="gridPedidos_documentos"] tr.dx-data-row')
        .filterVisible()
        .withText(String(numeroPedido));
    await t
        .click('#Documento_Descargar_Pedido')
        .click(Selector('.dx-overlay-content .dx-list-item').filterVisible().withText('Cargar un solo Pedido'))
        .expect(filaPedido.with({ timeout: 15000 }).exists).ok(`No aparece el pedido ${numeroPedido} para descargar`)
        .click(filaPedido.find('.dx-checkbox, .dx-select-checkbox').nth(0))
        .click('#btnCargarPedidos_documentos_btn')
        .wait(2000);
    if (await confirmarDialogo.with({ timeout: 3000 }).exists) {
        await t.click(confirmarDialogo);
    }
}

/** Envía el documento abierto a la DIAN (botón DIAN > Enviar). Devuelve el mensaje de error, si hubo. */
export async function enviarDocumentoDian360(t) {
    await t
        .click('#BtnDian')
        .click(Selector('.dx-overlay-content .dx-list-item').filterVisible().withText('Enviar'))
        .wait(6000);
    const aviso = Selector('.swal2-popup').filterVisible();
    let mensaje = '';
    if (await aviso.exists) {
        mensaje = await aviso.innerText;
        if (await confirmarDialogo.exists) {
            await t.click(confirmarDialogo);
        }
    }
    if (await avisoError.exists) {
        mensaje = `${mensaje} ${await avisoError.innerText}`.trim();
    }
    return mensaje;
}
