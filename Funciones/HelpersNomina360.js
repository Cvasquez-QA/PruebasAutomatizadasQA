import { Selector } from 'testcafe';
import {
    filtrarPorInput,
    popupEdicion360,
    abrirMovimientos360,
    elegirEnLookup360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaGrid360,
    eliminarFilaSiExiste360,
    guardarPopup360
} from './HelpersHgi360Web.js';

/* ----------------------------------------------------------------------------
 * Helpers de las pruebas de Nómina en Hgi360 Web (React, sin iframes).
 * --------------------------------------------------------------------------*/

const listaVisible = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
// Dentro de un formulario modal el primer input visible del overlay es del formulario, no el buscador de la lista
const buscadorLista = Selector('.dx-overlay-content input.dx-texteditor-input[placeholder="Buscar"]').filterVisible();

const escaparRegex = texto => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Abre la lista (lookup) del contenedor, filtra con el buscador visible si se indica y elige la opción que contiene el texto. */
export async function elegirEnLista360(t, contenedor, opcion, filtro = null) {
    await t.click(Selector(`${contenedor} .dx-lookup-field`).filterVisible());
    if (filtro !== null) {
        await t
            .expect(buscadorLista.with({ timeout: 10000 }).exists).ok(`No se abrió el buscador de ${contenedor}`)
            .typeText(buscadorLista.nth(-1), String(filtro), { replace: true })
            .wait(2000);
    }
    const patron = opcion instanceof RegExp ? opcion : new RegExp(escaparRegex(opcion));
    const candidata = listaVisible.withText(patron);
    await t
        .expect(candidata.with({ timeout: 10000 }).exists).ok(`No apareció la opción "${opcion}" en ${contenedor}`)
        .click(candidata.nth(0))
        .expect(Selector(`${contenedor} .dx-lookup-field`).withText(patron).exists)
        .ok(`No quedó "${opcion}" en ${contenedor}`, { timeout: 10000 });
}

/**
 * Escribe en un campo (input o textarea) del popup de edición y valida que el valor quedó.
 * Se pega el valor: escrito carácter por carácter, un NumberBox con formato corta los valores grandes.
 */
export async function escribirEnPopup360(t, campo, valor) {
    const input = popupEdicion360.find(`input.dx-texteditor-input[id$="_${campo}"], textarea[id$="_${campo}"]`);
    await t
        .expect(input.with({ timeout: 10000 }).exists).ok(`No apareció el campo ${campo} en el popup de edición`)
        .typeText(input, String(valor), { replace: true, paste: true })
        .pressKey('tab');
    if (/^\d+$/.test(String(valor))) {
        const mostrado = String(await input.value || '');
        const escrito = mostrado.replace(/,\d*$/, '').replace(/\D/g, '');
        await t.expect(escrito).eql(String(valor), `El campo ${campo} quedó con "${mostrado}"`);
    }
}

/** Toast del ERP o swal visible con el texto indicado (string o RegExp). */
export const aviso360 = texto => Selector('.erp-toast, .swal2-popup').filterVisible().withText(texto);

/** Espera el aviso (hasta espera ms); luego espera a que se cierre para que el siguiente no se confunda con este. */
export async function validarAviso360(t, texto, mensaje, espera = 30000) {
    await t.expect(aviso360(texto).exists).ok(mensaje, { timeout: espera });
    const confirmar = Selector('.swal2-popup').filterVisible().find('button.swal2-confirm');
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t.expect(aviso360(texto).exists).notOk(`El aviso "${texto}" no se cerró`, { timeout: 20000 });
}

/** Espera hasta ms a que el selector exista (consultando en ciclo) y devuelve si existe. */
export async function existeConEspera360(t, selector, ms) {
    const inicio = Date.now();
    while (!await selector.exists && Date.now() - inicio < ms) {
        await t.wait(500);
    }
    return selector.exists;
}

/**
 * Busca el registro en el grid y lo elimina si aparece (espera a que el grid filtre).
 * No usa buscarEnGrid360: algunos grids filtrados sin filas no muestran el aviso "sin datos" y esa espera falla.
 */
export async function eliminarSiExiste360(t, grid, texto) {
    const contenedor = Selector(`[data-testid="${grid}"], #${grid}`).filterVisible();
    const buscador = contenedor.find('.dx-datagrid-search-panel .dx-texteditor-input');
    await t.expect(buscador.with({ timeout: 15000 }).exists).ok(`No apareció el buscador del grid ${grid}`);
    await existeConEspera360(t, contenedor.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible(), 10000);
    await t.typeText(buscador, String(texto), { replace: true }).wait(1500);
    if (await existeConEspera360(t, filaGrid360(grid, texto), 8000)) {
        await eliminarFilaGrid360(t, grid, texto);
    }
}

/** Cierra los toasts visibles (tapan los botones de la parte inferior derecha) o espera a que se oculten. */
export async function cerrarToasts360(t) {
    const toast = Selector('.erp-toast').filterVisible();
    const inicio = Date.now();
    while (await toast.exists && Date.now() - inicio < 20000) {
        const cerrar = toast.find('button, [role="button"], [class*="close"]').filterVisible();
        if (await cerrar.exists) {
            await t.click(cerrar.nth(0));
        }
        await t.wait(500);
    }
}

/** Abre la lista del campo y la cierra sin elegir (equivale al "Cancelar" de las pruebas legacy). */
export async function abrirYCerrarLista360(t, contenedor) {
    await t
        .click(Selector(`${contenedor} .dx-lookup-field, ${contenedor} .dx-texteditor-input`).nth(0))
        .expect(Selector('.dx-overlay-content').filterVisible().with({ timeout: 10000 }).exists)
        .ok(`No se abrió la lista ${contenedor}`)
        .pressKey('esc')
        .wait(500);
}

/** Elige una opción de un SelectBox (lista desplegable sin popup de búsqueda); texto: inicio de la opción o RegExp. */
export async function elegirEnSelectBox360(t, contenedor, texto) {
    const opcion = listaVisible.withText(texto instanceof RegExp ? texto : new RegExp(`^\\s*${escaparRegex(texto)}`));
    await t
        .click(Selector(`${contenedor} .dx-dropdowneditor-icon, ${contenedor} .dx-texteditor-input`).nth(0))
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No aparece "${texto}" en ${contenedor}`)
        .click(opcion.nth(0))
        .wait(800);
}

/**
 * Elige un empleado (o cualquier registro) en un campo de selección que puede ser lookup simple o
 * selección múltiple con botón Aceptar. Filtra por el texto y elige la opción que lo contiene.
 */
export async function elegirRegistro360(t, contenedor, texto) {
    await t.click(Selector(`${contenedor} .dx-lookup-field, ${contenedor} .dx-texteditor-input, ${contenedor} .dx-tag-container`).nth(0));
    if (await buscadorLista.with({ timeout: 5000 }).exists) {
        await t.typeText(buscadorLista.nth(-1), String(texto), { replace: true }).wait(2000);
    } else if (await filtrarPorInput.with({ timeout: 1000 }).exists) {
        await t.typeText(filtrarPorInput, String(texto), { replace: true }).wait(2000);
    }
    const opcion = listaVisible.withText(String(texto));
    await t.expect(opcion.with({ timeout: 10000 }).exists).ok(`No aparece "${texto}" en ${contenedor}`);
    // En las listas de selección múltiple el clic en el texto no marca el ítem: hay que marcar la casilla
    const casilla = opcion.nth(0).find('.dx-list-select-checkbox');
    await t.click(await casilla.exists ? casilla : opcion.nth(0)).wait(800);
    const aceptar = Selector('.dx-overlay-content').filterVisible().find('.dx-button').withText(/^\s*(Aceptar|OK|Listo)\s*$/);
    if (await aceptar.exists) {
        await t.click(aceptar.nth(0)).wait(800);
    }
    const multiple = Selector(contenedor).filter('.erp-multi-select-list-dropdown');
    if (await multiple.exists) {
        await t.expect(multiple.find('input[type="hidden"]').value).contains(String(texto), `No quedó "${texto}" en ${contenedor}`);
    }
}

/** Elige una opción de una lista dentro del popup de edición de un grid (campo: sufijo del id, p. ej. IntTipoContrato). */
export async function elegirEnPopup360(t, campo, texto) {
    const editor = popupEdicion360.find(`[id$="_${campo}"]`).parent('.dx-lookup, .dx-selectbox, .dx-dropdowneditor').nth(0);
    await t
        .expect(editor.with({ timeout: 10000 }).exists).ok(`No apareció la lista ${campo} en el popup de edición`)
        .click(editor.find('.dx-lookup-field, .dx-texteditor-input').nth(0));
    if (await buscadorLista.with({ timeout: 3000 }).exists) {
        await t.typeText(buscadorLista.nth(-1), String(texto), { replace: true }).wait(1500);
    }
    const opcion = listaVisible.withText(String(texto));
    await t
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No aparece "${texto}" en ${campo}`)
        .click(opcion.nth(0))
        .wait(800);
}

/** Escribe una fecha yyyy-MM-dd en un DateBox y la confirma con Enter. */
export async function escribirFechaNomina360(t, contenedor, fecha) {
    await t
        .typeText(Selector(`${contenedor} .dx-texteditor-input`), fecha, { replace: true })
        .pressKey('enter')
        .wait(500);
}

/** Lee la fecha del DateBox como yyyy-MM-dd (acepta dd/MM/yyyy). */
export async function leerFechaNomina360(contenedor) {
    const valor = String(await Selector(`${contenedor} .dx-texteditor-input`).value || '').trim();
    const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    return dmy ? `${dmy[3]}-${dmy[2]}-${dmy[1]}` : valor;
}

/** Valor numérico de un NumberBox ("1.000.000", "10,00 %", "$ 5.000"). */
export async function leerNumeroNomina360(contenedor) {
    const texto = String(await Selector(`${contenedor} .dx-texteditor-input`).value || '');
    return parseFloat(texto.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
}

/* ----------------------------------------------------------------------------
 * Movimientos > Prestamos
 * --------------------------------------------------------------------------*/

const GRID_PRESTAMOS = 'gridNomMPrestamos';

/** Abre Prestamos con el empleado y concepto, y borra el préstamo de una ejecución anterior (por observación). */
export async function abrirPrestamos360(t, empleado, concepto, observaciones) {
    await abrirMovimientos360(t, 'Prestamos');
    await t.expect(Selector('#lkpEmpleadoNomMPrestamos').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Movimientos > Prestamos');
    await elegirEnLookup360(t, '#lkpEmpleadoNomMPrestamos', empleado, empleado);
    await elegirEnLookup360(t, '#lkpConceptoNomMPrestamos', concepto, concepto);
    for (const observacion of observaciones) {
        await eliminarFilaSiExiste360(t, GRID_PRESTAMOS, observacion);
    }
}

/** Valida el préstamo creado, lo edita (valor, cuota, tasa y observación), valida el cambio y lo borra. */
export async function editarYEliminarPrestamo360(t, observacion, editado) {
    await buscarEnGrid360(t, GRID_PRESTAMOS, observacion);
    await t.expect(filaGrid360(GRID_PRESTAMOS, observacion).with({ timeout: 15000 }).exists)
        .ok(`No se creó el préstamo "${observacion}"`);

    await accionFilaGrid360(t, GRID_PRESTAMOS, observacion, 'Editar');
    await escribirEnPopup360(t, 'IntValor', editado.valor);
    await escribirEnPopup360(t, 'IntCuota', editado.cuota);
    await escribirEnPopup360(t, 'IntTasa', editado.tasa);
    await escribirEnPopup360(t, 'StrObservaciones', editado.observacion);
    await guardarPopup360(t);

    await buscarEnGrid360(t, GRID_PRESTAMOS, editado.observacion);
    await t.expect(filaGrid360(GRID_PRESTAMOS, editado.observacion).with({ timeout: 15000 }).exists)
        .ok(`No se ve el préstamo editado "${editado.observacion}"`);
    await eliminarFilaGrid360(t, GRID_PRESTAMOS, editado.observacion);
}

/* ----------------------------------------------------------------------------
 * Movimientos > Novedades por Empleado / por Concepto
 * --------------------------------------------------------------------------*/

/** Fila del grid que contiene el texto (en cualquier columna). */
export const filaNovedad360 = (grid, texto) => Selector(`#${grid} tr.dx-data-row`).filterVisible().withText(String(texto));

/** Pulsa Guardar del formulario de novedad; falla con el mensaje del ERP si responde con error. */
export async function guardarNovedad360(t, idGuardar) {
    await t.click(Selector(`#${idGuardar}`).filterVisible());
    const aviso = Selector('.erp-toast, .swal2-popup').filterVisible();
    await t.expect(aviso.with({ timeout: 30000 }).exists).ok('No apareció respuesta al guardar la novedad');
    const texto = await aviso.nth(0).innerText;
    const error = await Selector('.erp-toast[data-type="error"], .swal2-icon-error').filterVisible().exists;
    await t.expect(error).notOk(`El ERP rechazó la novedad: ${texto}`);
    const confirmar = Selector('.swal2-popup').filterVisible().find('button.swal2-confirm');
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t.wait(1500);
}

/** Selecciona la fila que contiene el texto, pulsa "Eliminar seleccionados" y confirma. */
export async function eliminarNovedadSeleccionada360(t, grid, texto) {
    const fila = filaNovedad360(grid, texto);
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No se encontró la novedad "${texto}" en ${grid}`)
        .click(fila.nth(0).find('.dx-select-checkbox, .dx-checkbox').nth(0))
        .wait(800);
    const eliminarSeleccionados = Selector(`[id^="btnEliminarSeleccionados"], #${grid} .dx-datagrid-header-panel [aria-label*="liminar"]`)
        .filterVisible();
    await t
        .expect(eliminarSeleccionados.with({ timeout: 10000 }).exists).ok(`No apareció "Eliminar seleccionados" en ${grid}`)
        .click(eliminarSeleccionados.nth(0));
    const confirmar = Selector('.swal2-popup button.swal2-confirm, .dx-dialog .dx-button, .dx-overlay-content .dx-button')
        .filterVisible()
        .withText(/^\s*(S[ií]|Aceptar|Eliminar)\b/i);
    await t
        .expect(confirmar.with({ timeout: 10000 }).exists).ok('No apareció la confirmación de eliminar')
        .click(confirmar.nth(0))
        .expect(fila.exists).notOk(`La novedad "${texto}" sigue en ${grid} después de eliminarla`, { timeout: 20000 });
}

/** Borra la novedad de una ejecución anterior si quedó en el grid. */
export async function eliminarNovedadSiExiste360(t, grid, texto) {
    await t.expect(Selector(`#${grid} tr.dx-data-row, #${grid} .dx-datagrid-nodata`).filterVisible().with({ timeout: 20000 }).exists)
        .ok(`El grid ${grid} no terminó de cargar`);
    while (await filaNovedad360(grid, texto).with({ timeout: 3000 }).exists) {
        await eliminarNovedadSeleccionada360(t, grid, texto);
    }
}

/**
 * Llena el formulario de novedad (prefijo de los ids, p. ej. 'txtNovedades_' o 'txtNovedades_Conceptos_')
 * con los mismos datos de las pruebas legacy.
 */
export async function llenarNovedad360(t, prefijo, datos) {
    const texto = async (campo, valor) => {
        await t
            .typeText(Selector(`#${prefijo}${campo} .dx-texteditor-input`), String(valor), { replace: true })
            .pressKey('tab');
    };
    await escribirFechaNomina360(t, `#${prefijo}FechaInicial`, datos.fechaInicial);
    await texto('Contrato', datos.contrato);
    await texto('Documento', datos.documento);
    await texto('Cantidad', datos.cantidad);
    await texto('Valor', datos.valor);
    await texto('Sistema', datos.sistema);
    // Sucursal, CCosto y SubCCosto quedan con los del empleado: al elegir "0 - GENERAL" el campo queda vacío
    for (const lista of ['Sucursal', 'CCosto', 'SubCCosto']) {
        await t.expect(Selector(`#${prefijo}${lista} .dx-lookup-field`).innerText).match(/\S/, `${lista} quedó vacío en la novedad`);
    }
    await texto('HorasW', datos.horasW);
    await texto('Acu', datos.acu);
    await texto('Observaciones', datos.observacion);
}

/** Suma días a una fecha yyyy-MM-dd. */
export function sumarDiasNomina360(fecha, dias) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const d = new Date(anio, mes - 1, dia + Number(dias));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
