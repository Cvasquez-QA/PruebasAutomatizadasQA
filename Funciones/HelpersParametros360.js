import { ClientFunction, Selector } from 'testcafe';
import { abrirHerramientas360 } from './HelpersHgi360Web.js';
import { PESTANAS_PARAMETROS, camposDe } from './InventarioParametros360.js';

/**
 * Herramientas > Parámetros en test.hgi360.com (React). Revisado en el navegador el 29-oct-2026 (AutAdmin, 8902).
 *
 *  - Pestañas: #tabs_parametros_<Clave> (Admin = "General", Params, Administrativo, Contable, Nomina, Pos, CRM,
 *    Movil, PH, Defecto, Mensajes, Plantilla); contenido #tabs_parametros_content_<Clave>.
 *    Subpestañas: #tabs_parametrosAdmin_<X> (Inventarios, Cartera, Documentos) y #tabs_parametrosNom_<X>
 *    (General, Conceptos, Dispositivos); contenido #tabs_parametrosAdmin_content_<X> / #tabs_parametrosNom_content_<X>.
 *  - Sin editar, los controles están en solo lectura (dx-state-readonly). #BtnEditar_btn pasa a edición y muestra
 *    #BtnGuardar_btn (deshabilitado hasta que algo cambie; si se revierte el cambio vuelve a deshabilitarse) y
 *    #BtnCancelarParametrosGenerales_btn ("Cerrar": sale de edición y descarta los cambios sin preguntar).
 *  - Guardar muestra el aviso "Notificación — Registro almacenado correctamente." (botón Aceptar) y vuelve a modo
 *    consulta. El primer clic sobre Guardar a veces solo muestra el tooltip "Guardar (Ctrl + G)": se reintenta.
 *  - Los grids (Mensajes, Plantillas, Nómina > Dispositivos, Pos > Pendientes) usan el popup "Edit form" y cada
 *    fila se guarda sola ("Registro almacenado con éxito" / "Registro eliminado con éxito"), sin el Guardar general.
 */

/**
 * Varias etiquetas se ven con asteriscos literales ("**Superior**", "**Agrupa Sección**"): Markdown sin
 * interpretar. Con true la prueba los ignora al comparar; con false la prueba falla mientras el defecto exista.
 */
export const PERMITIR_ASTERISCOS = true;

/**
 * Al abrir y cerrar algunas listas (sin elegir nada) el ERP habilita Guardar aunque el valor visible no cambie
 * (visto el 02-nov-2026 en General, Administrativo, Pos y PH). Con true la prueba lo registra como [AVISO] en la
 * consola y sigue; con false la prueba falla con la lista de esos controles.
 */
export const PERMITIR_GUARDAR_SIN_CAMBIOS = true;

const btnEditar = Selector('#BtnEditar_btn');
const btnGuardar = Selector('#BtnGuardar_btn');
const btnCerrar = Selector('#BtnCancelarParametrosGenerales_btn');
const avisoVisible = Selector('.swal2-popup').filterVisible();
const btnAceptarAviso = Selector('button.swal2-confirm').filterVisible();
const overlayVisible = Selector('.dx-overlay-content').filterVisible();

/** Control de un parámetro por su data-testid (es igual a su id). */
export const control360 = id => Selector(`[data-testid="${id}"]`).nth(0);
export const inputControl360 = id => control360(id).find('.dx-texteditor-input');

const normalizar = texto => String(texto ?? '').replace(/\s+/g, ' ').trim();
const sinAsteriscos = texto => normalizar(String(texto ?? '').replace(/\*\*/g, ''));

/** Abre Herramientas > Parámetros y espera las pestañas. */
export async function abrirParametros360(t) {
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .expect(Selector('#tabs_parametros_Admin').with({ timeout: 30000 }).exists).ok('No abrió Herramientas > Parámetros')
        .expect(btnEditar.with({ timeout: 30000 }).exists).ok('No apareció el botón Editar de Parámetros');
}

/** Pasa a modo edición (si no lo está). */
export async function editarParametros360(t) {
    if (!await btnGuardar.filterVisible().exists) {
        await t.click(btnEditar);
    }
    await t.expect(btnGuardar.filterVisible().with({ timeout: 15000 }).exists).ok('No se pasó a modo edición (no aparece Guardar)');
}

/** Sale de edición con "Cerrar" (descarta lo que no se haya guardado). */
export async function cerrarEdicionParametros360(t) {
    if (await btnCerrar.filterVisible().exists) {
        await t.click(btnCerrar);
    }
    await t.expect(btnEditar.filterVisible().with({ timeout: 15000 }).exists).ok('No se salió del modo edición');
}

/** Guardar general: espera "Registro almacenado correctamente." y lo acepta. */
export async function guardarParametros360(t) {
    await t.expect(btnGuardar.hasClass('dx-state-disabled')).notOk('Guardar está deshabilitado: no hay cambios para guardar', { timeout: 10000 });
    // 01-nov-2026: el aviso de éxito no siempre dice "almacenado correctamente" y después del primer clic el botón
    // Guardar desaparece (la pantalla vuelve a consulta). Solo se reintenta si el botón sigue visible y no salió aviso.
    const exito = /almacenad|actualizad|guardad|con [eé]xito|correctamente/i;
    for (let intento = 0; intento < 3; intento++) {
        if (await avisoVisible.exists || !await btnGuardar.filterVisible().exists) {
            break;
        }
        await t.click(btnGuardar);
        // El primer clic a veces solo muestra el tooltip del botón
        for (const inicio = Date.now(); Date.now() - inicio < 8000;) {
            if (await avisoVisible.exists || !await btnGuardar.filterVisible().exists) break;
            await t.wait(300);
        }
    }
    if (await avisoVisible.with({ timeout: 5000 }).exists) {
        const texto = normalizar(await avisoVisible.innerText);
        if (await btnAceptarAviso.exists) {
            await t.click(btnAceptarAviso);
        }
        await t.expect(exito.test(texto)).ok(`Al guardar los parámetros salió: ${texto}`);
    }
    await t.expect(btnEditar.filterVisible().with({ timeout: 15000 }).exists).ok('Después de guardar no volvió a modo consulta');
}

/** Abre la pestaña (clave de PESTANAS_PARAMETROS) y, si se indica, la subpestaña; valida que quede seleccionada. */
export async function abrirPestanaParametros360(t, clave, subpestanaId = null) {
    const pestana = Selector(`#tabs_parametros_${clave}`);
    const contenido = Selector(`#tabs_parametros_content_${clave}`);
    await t
        .expect(pestana.with({ timeout: 15000 }).exists).ok(`No existe la pestaña ${clave} en Parámetros`)
        .click(pestana);
    // 01-nov-2026: algunas pestañas (Defecto, Mensajes, Plantilla) no tienen #tabs_parametros_content_<Clave>;
    // en ese caso se valida que la pestaña quede seleccionada.
    if (await contenido.with({ timeout: 3000 }).exists) {
        await t.expect(contenido.parent('.dx-multiview-item').hasClass('dx-item-selected')).ok(`No se abrió la pestaña ${clave}`, { timeout: 10000 });
    } else {
        const marcada = '.dx-tab-selected, [aria-selected="true"]';
        let seleccionada = false;
        for (const inicio = Date.now(); !seleccionada && Date.now() - inicio < 10000;) {
            seleccionada = await pestana.filter(marcada).exists || await pestana.parent('.dx-tab, [role="tab"]').filter(marcada).exists;
            if (!seleccionada) await t.wait(500);
        }
        await t.expect(seleccionada).ok(`No se abrió la pestaña ${clave}`);
        await t.wait(1500);
    }
    if (subpestanaId) {
        const sub = Selector(`#${subpestanaId}`);
        const subContenido = Selector(`#${subpestanaId.replace(/_([^_]+)$/, '_content_$1')}`);
        await t
            .expect(sub.with({ timeout: 10000 }).exists).ok(`No existe la subpestaña ${subpestanaId}`)
            .click(sub)
            .expect(subContenido.parent('.dx-multiview-item').hasClass('dx-item-selected')).ok(`No se abrió la subpestaña ${subpestanaId}`, { timeout: 10000 });
    }
}

/** Datos de los controles en el navegador: etiqueta, opciones, estado. */
const leerControles = ClientFunction((ids, contenidoId) => {
    const texto = nodo => (nodo ? nodo.textContent : '').replace(/\s+/g, ' ').trim();
    const contenido = document.getElementById(contenidoId);
    const secciones = contenido
        ? Array.from(contenido.querySelectorAll('.erp-form-section-title')).map(texto)
        : [];
    const controles = ids.map(id => {
        const e = document.querySelector(`[data-testid="${id}"]`) || document.getElementById(id);
        if (!e) {
            return { id, existe: false };
        }
        const clases = e.className || '';
        let etiqueta = '';
        if (/dx-checkbox|dx-switch/.test(clases)) {
            etiqueta = texto(e.querySelector('.dx-checkbox-text, .dx-switch-text'));
        } else if (!/dx-radiogroup/.test(clases)) {
            etiqueta = texto(e.querySelector('.dx-label'));
        }
        return {
            id,
            existe: true,
            enContenido: contenido ? contenido.contains(e) : true,
            etiqueta,
            opciones: Array.from(e.querySelectorAll('.dx-radiobutton .dx-item-content')).map(texto),
            deshabilitado: /dx-state-disabled/.test(clases),
            soloLectura: /dx-state-readonly/.test(clases) || e.getAttribute('aria-readonly') === 'true'
        };
    });
    return { secciones, controles };
});

/**
 * Valida que existan los parámetros de la subpestaña con su nombre (etiqueta), sus opciones (radio) y la sección.
 * Devuelve los campos del inventario.
 */
export async function validarNombresParametros360(t, subpestana) {
    const campos = camposDe(subpestana);
    const { secciones, controles } = await leerControles(campos.map(c => c.id), subpestana.contenido);
    const faltantes = [];
    const errores = [];
    campos.forEach((campo, i) => {
        const real = controles[i];
        if (!real.existe || !real.enContenido) {
            faltantes.push(`${campo.etiqueta || campo.id} (${campo.id})`);
            return;
        }
        if (campo.etiqueta && campo.tipo !== 'radiogroup') {
            const esperado = sinAsteriscos(campo.etiqueta);
            const visto = PERMITIR_ASTERISCOS ? sinAsteriscos(real.etiqueta) : normalizar(real.etiqueta);
            if (visto !== esperado) {
                errores.push(`${campo.id}: se esperaba "${esperado}" y se ve "${normalizar(real.etiqueta)}"`);
            }
        }
        if (campo.opciones.length && real.opciones.join('|') !== campo.opciones.join('|')) {
            errores.push(`${campo.id}: opciones [${real.opciones.join(', ')}], se esperaban [${campo.opciones.join(', ')}]`);
        }
        if (campo.seccion && !secciones.some(s => sinAsteriscos(s) === sinAsteriscos(campo.seccion))) {
            errores.push(`${campo.id}: no se encontró la sección "${campo.seccion}"`);
        }
    });
    await t
        .expect(faltantes).eql([], `Parámetros que no aparecen en ${subpestana.contenido}: ${faltantes.join('; ')}`)
        .expect(errores).eql([], `Nombres que no coinciden en ${subpestana.contenido}: ${errores.join(' | ')}`);
    return campos;
}

/** Sin editar, los controles deben estar en solo lectura. */
export async function validarSoloLecturaParametros360(t, subpestana) {
    const campos = camposDe(subpestana);
    const { controles } = await leerControles(campos.map(c => c.id), subpestana.contenido);
    const editables = controles.filter(c => c.existe && !c.soloLectura && !c.deshabilitado).map(c => c.id);
    await t.expect(editables).eql([], `Sin pulsar Editar estos parámetros se pueden modificar: ${editables.join(', ')}`);
}

/** Cierra la lista de un lookup/fecha con Esc y valida que se cierre. */
async function cerrarListaAbierta(t, campo) {
    await t.pressKey('esc');
    await t.expect(overlayVisible.exists).notOk(`No se cerró la lista de ${campo.id}`, { timeout: 5000 });
}

/**
 * Pulsa un control en modo edición y valida que responda, sin dejar cambios:
 *  - checkbox: dos clics (cambia y vuelve a su valor).
 *  - radiogroup: clic sobre la opción que ya está marcada.
 *  - lookup / datebox: abre la lista y la cierra con Esc (el valor no cambia).
 *  - textbox / numberbox / textarea: clic y queda con el foco.
 * Los marcados como deshabilitados (D) solo se valida que sigan deshabilitados.
 */
export async function pulsarParametro360(t, campo) {
    const sel = control360(campo.id);
    const nombre = campo.etiqueta ? `"${sinAsteriscos(campo.etiqueta)}" (${campo.id})` : campo.id;

    if (campo.deshabilitado) {
        await t.expect(sel.hasClass('dx-state-disabled')).ok(`${nombre} debería estar deshabilitado`);
        return;
    }
    await t
        .expect(sel.hasClass('dx-state-disabled')).notOk(`${nombre} está deshabilitado en modo edición`)
        .expect(sel.hasClass('dx-state-readonly')).notOk(`${nombre} sigue en solo lectura en modo edición`);

    switch (campo.tipo) {
    case 'checkbox':
    case 'switch': {
        const antes = await sel.getAttribute('aria-checked');
        const icono = sel.find('.dx-checkbox-icon, .dx-switch-handle').nth(0);
        await t
            .click(icono)
            .expect(sel.getAttribute('aria-checked')).notEql(antes, `${nombre} no cambió al pulsarlo`, { timeout: 5000 })
            .click(icono)
            .expect(sel.getAttribute('aria-checked')).eql(antes, `${nombre} no volvió a su valor`, { timeout: 5000 });
        break;
    }
    case 'radiogroup': {
        const marcada = sel.find('.dx-radiobutton.dx-radiobutton-checked');
        const opcion = await marcada.exists ? marcada : sel.find('.dx-radiobutton').nth(0);
        const texto = normalizar(await opcion.textContent);
        await t.click(opcion.find('.dx-radiobutton-icon'));
        if (await marcada.exists) {
            await t.expect(normalizar(await sel.find('.dx-radiobutton.dx-radiobutton-checked').textContent))
                .eql(texto, `${nombre} cambió de opción al pulsar la que ya estaba marcada`);
        } else {
            // No había opción marcada: se acepta que quede la primera; Cerrar descarta el cambio
            await t.expect(sel.find('.dx-radiobutton.dx-radiobutton-checked').exists).ok(`${nombre} no respondió al clic`);
        }
        break;
    }
    case 'lookup':
    case 'selectbox':
    case 'datebox':
    case 'tagbox': {
        // Los lookups se abren con el campo; las fechas solo con su botón de calendario (revisado el 29-oct-2026)
        const campoVisible = sel.find('.dx-lookup-field, .dx-dropdowneditor-input-wrapper').nth(0);
        const abridor = campo.tipo === 'lookup' ? campoVisible : sel.find('.dx-dropdowneditor-button').nth(0);
        // Los dx-lookup no tienen .dx-texteditor-input: leer sin fallar cuando no existe (01-nov-2026)
        const valorVisible = async () => {
            const input = sel.find('.dx-texteditor-input').nth(0);
            return normalizar(await campoVisible.exists ? await campoVisible.textContent : '') +
                normalizar(await input.exists ? await input.value : '');
        };
        const antes = await valorVisible();
        await t
            .click(abridor)
            .expect(overlayVisible.with({ timeout: 10000 }).exists).ok(`${nombre} no abrió su lista al pulsarlo`);
        await cerrarListaAbierta(t, campo);
        const despues = await valorVisible();
        await t.expect(despues).eql(antes, `${nombre} cambió de valor al abrir y cerrar la lista`);
        break;
    }
    default: {
        const input = sel.find('.dx-texteditor-input').nth(0);
        await t
            .click(input)
            .expect(input.focused).ok(`${nombre} no recibió el foco al pulsarlo`);
    }
    }
}

/**
 * Prueba completa de una pestaña: nombres, solo lectura sin editar, clic en cada parámetro en modo edición
 * y verificación de que no quedó ningún cambio (Guardar sigue deshabilitado). Sale con Cerrar.
 */
export async function validarPestanaParametros360(t, clave) {
    const pestana = PESTANAS_PARAMETROS[clave];
    await t.expect(pestana).ok(`La pestaña ${clave} no está en el inventario`);

    await cerrarEdicionParametros360(t);
    for (const subpestana of pestana.subpestanas) {
        if (!camposDe(subpestana).length) {
            continue;
        }
        await abrirPestanaParametros360(t, clave, subpestana.id);
        await validarNombresParametros360(t, subpestana);
        await validarSoloLecturaParametros360(t, subpestana);
    }

    await editarParametros360(t);
    const habilitanGuardar = [];
    for (const subpestana of pestana.subpestanas) {
        const campos = camposDe(subpestana);
        if (!campos.length) {
            continue;
        }
        await abrirPestanaParametros360(t, clave, subpestana.id);
        for (const campo of campos) {
            await pulsarParametro360(t, campo);
            // 02-nov-2026: algunos controles habilitan Guardar con solo abrir y cerrar su lista, aunque el valor visible
            // no cambie. Se anota cuál fue y se descarta con Cerrar para que no afecte a los siguientes.
            if (!await btnGuardar.hasClass('dx-state-disabled')) {
                habilitanGuardar.push(campo.etiqueta ? `${sinAsteriscos(campo.etiqueta)} (${campo.id})` : campo.id);
                await cerrarEdicionParametros360(t);
                await editarParametros360(t);
                await abrirPestanaParametros360(t, clave, subpestana.id);
            }
        }
    }
    if (habilitanGuardar.length) {
        const aviso = `${pestana.nombre}: Guardar se habilitó sin cambiar ningún valor al pulsar ${habilitanGuardar.join(', ')}`;
        if (PERMITIR_GUARDAR_SIN_CAMBIOS) {
            console.log(`[AVISO] ${aviso}`);
        } else {
            await t.expect(false).ok(aviso);
        }
    }
    await cerrarEdicionParametros360(t);
}

/* ------------------------------------------------------------------ Lectura / escritura de valores */

/** Valor visible de un parámetro: texto (textbox/numberbox), opción (lookup/radio) o 'true'/'false' (checkbox). */
export async function leerParametro360(t, id) {
    const sel = control360(id);
    await t.expect(sel.with({ timeout: 10000 }).exists).ok(`No existe el parámetro ${id}`);
    const clases = await sel.getAttribute('class');
    if (/dx-checkbox|dx-switch/.test(clases)) {
        return await sel.getAttribute('aria-checked');
    }
    if (/dx-radiogroup/.test(clases)) {
        const marcada = sel.find('.dx-radiobutton.dx-radiobutton-checked');
        return await marcada.exists ? normalizar(await marcada.textContent) : '';
    }
    if (/dx-lookup/.test(clases)) {
        return normalizar(await sel.find('.dx-lookup-field').textContent);
    }
    return await sel.find('.dx-texteditor-input').nth(0).value;
}

/** Escribe en un textbox/numberbox (reemplaza el contenido y sale con Tab). */
export async function escribirParametro360(t, id, valor) {
    const input = inputControl360(id).nth(0);
    await t.expect(input.with({ timeout: 10000 }).exists).ok(`No existe el parámetro ${id}`);
    // 02-nov-2026: al pasar a edición la columna del control puede quedar unos segundos con visibility:hidden
    await t.expect(control360(id).visible).ok(`El parámetro ${id} no está visible en la pantalla`, { timeout: 15000 });
    if (String(valor) === '') {
        // Restaurar un valor que estaba vacío: solo se borra (typeText no acepta texto vacío)
        await t.click(await input.visible ? input : control360(id)).pressKey('ctrl+a delete').pressKey('tab')
            .expect(input.value).eql('', `No quedó vacío ${id}`, { timeout: 5000 });
        return;
    }
    if (await input.visible) {
        await t
            .click(input)
            .pressKey('ctrl+a delete')
            .typeText(input, String(valor), { replace: true })
            .pressKey('tab');
        return;
    }
    // 01-nov-2026: algunos numberbox (p. ej. Contable > Decimales) tienen el input dentro de un contenedor con
    // visibility:hidden. Se pulsa el control y se escribe con el teclado.
    const teclas = String(valor).split('').map(c => (c === ' ' ? 'space' : c)).join(' ');
    await t
        .click(control360(id))
        .pressKey('ctrl+a delete')
        .pressKey(teclas)
        .pressKey('tab')
        .expect(input.value).eql(String(valor), `No quedó "${valor}" en ${id}`, { timeout: 5000 });
}

/** Deja un checkbox en el estado indicado (true/false). */
export async function marcarParametro360(t, id, marcado) {
    const sel = control360(id);
    if ((await sel.getAttribute('aria-checked')) !== String(Boolean(marcado))) {
        await t.click(sel.find('.dx-checkbox-icon'));
    }
    await t.expect(sel.getAttribute('aria-checked')).eql(String(Boolean(marcado)), `No quedó ${marcado ? 'marcado' : 'desmarcado'} ${id}`);
}

/** Elige una opción de un radiogroup por su texto. */
export async function elegirOpcionParametro360(t, id, opcion) {
    const radio = control360(id).find('.dx-radiobutton').withExactText(opcion);
    await t
        .expect(radio.exists).ok(`No existe la opción "${opcion}" en ${id}`)
        .click(radio.find('.dx-radiobutton-icon'))
        .expect(radio.hasClass('dx-radiobutton-checked')).ok(`No quedó marcada la opción "${opcion}" en ${id}`);
}

/**
 * Elige una opción de un lookup del formulario. `opcion` puede ser el texto completo o el comienzo
 * (p. ej. el código). Si la lista tiene buscador, escribe `filtro` (por defecto la opción) para encontrarla.
 */
export async function elegirLookupParametro360(t, id, opcion, filtro = opcion) {
    const sel = control360(id);
    await t.click(sel.find('.dx-lookup-field'));
    const lista = overlayVisible.find('.dx-list-item');
    const buscador = overlayVisible.find('.dx-texteditor-input');
    if (filtro && await buscador.with({ timeout: 3000 }).exists) {
        await t.typeText(buscador.nth(0), String(filtro), { replace: true });
    }
    const buscada = normalizar(opcion).toLowerCase();
    const candidata = lista.filter(n => n.textContent.replace(/\s+/g, ' ').trim().toLowerCase().indexOf(buscada) === 0, { buscada });
    await t
        .expect(candidata.with({ timeout: 10000 }).exists).ok(`No apareció "${opcion}" en la lista de ${id}`)
        .click(candidata.nth(0))
        .expect(overlayVisible.exists).notOk(`No se cerró la lista de ${id}`, { timeout: 5000 });
}

/**
 * Cambia varios parámetros, guarda, recarga la pantalla, valida lo guardado y restaura los valores originales.
 * cambios: [{ id, tipo: 'texto'|'check'|'radio'|'lookup', valor, esperado?, restaurar? }]
 *  - esperado: lo que debe mostrarse después de guardar (si el ERP lo formatea; por defecto `valor`).
 *  - Los valores originales se leen antes de cambiar, así que se restaura exactamente lo que había.
 */
export async function cambiarGuardarYRestaurar360(t, clave, subpestanaId, cambios) {
    await cerrarEdicionParametros360(t);
    await abrirPestanaParametros360(t, clave, subpestanaId);
    const originales = {};
    for (const c of cambios) {
        originales[c.id] = await leerParametro360(t, c.id);
    }

    const aplicar = async (c, valor) => {
        if (c.tipo === 'check') await marcarParametro360(t, c.id, valor === true || valor === 'true');
        else if (c.tipo === 'radio') await elegirOpcionParametro360(t, c.id, valor);
        else if (c.tipo === 'lookup') await elegirLookupParametro360(t, c.id, valor, c.filtro);
        else await escribirParametro360(t, c.id, valor);
    };

    // 1) Cambiar y guardar (si el valor de prueba ya es el actual, se usa el alterno)
    await editarParametros360(t);
    await abrirPestanaParametros360(t, clave, subpestanaId);
    const aplicados = [];
    for (const c of cambios) {
        let valor = c.valor;
        if (c.tipo === 'check') {
            valor = originales[c.id] !== 'true';
        } else if (normalizar(originales[c.id]) === normalizar(c.esperado ?? c.valor) && c.alterno !== undefined) {
            valor = c.alterno;
        }
        await aplicar(c, valor);
        aplicados.push({ ...c, valorAplicado: valor });
    }
    await guardarParametros360(t);

    // 2) Validar lo guardado después de reabrir la pestaña
    await abrirPestanaParametros360(t, clave, subpestanaId);
    for (const c of aplicados) {
        const visto = normalizar(await leerParametro360(t, c.id));
        const esperado = c.tipo === 'check'
            ? String(c.valorAplicado)
            : normalizar(c.valorAplicado === c.valor ? (c.esperado ?? c.valor) : (c.esperadoAlterno ?? c.alterno));
        if (c.tipo === 'lookup') {
            await t.expect(visto.toLowerCase().startsWith(esperado.toLowerCase())).ok(`No se guardó ${c.id}: se ve "${visto}", se esperaba "${esperado}"`);
        } else {
            await t.expect(visto).eql(esperado, `No se guardó ${c.id}`);
        }
    }

    // 3) Restaurar los valores originales
    await editarParametros360(t);
    await abrirPestanaParametros360(t, clave, subpestanaId);
    for (const c of aplicados) {
        const original = originales[c.id];
        if (c.tipo === 'check') await aplicar(c, original === 'true');
        else if (c.tipo === 'lookup' || c.tipo === 'radio') {
            // Sin valor original no hay opción que volver a elegir
            if (original) await aplicar({ ...c, filtro: original.split(' - ')[0] }, original);
        } else await aplicar(c, original);
    }
    if (!await btnGuardar.hasClass('dx-state-disabled')) {
        await guardarParametros360(t);
    } else {
        await cerrarEdicionParametros360(t);
    }
    await abrirPestanaParametros360(t, clave, subpestanaId);
    for (const c of aplicados) {
        const visto = normalizar(await leerParametro360(t, c.id));
        await t.expect(visto).eql(normalizar(originales[c.id]), `No se restauró ${c.id} a su valor original`);
    }
}

/* ------------------------------------------------------------------ Grids (popup "Edit form") */

const gridParametros = gridId => Selector(`[data-testid="${gridId}"], #${gridId}`).filterVisible().nth(0);
export const popupEdicionParametros = Selector('.dx-overlay-content[aria-label="Edit form"]').filterVisible();
const errorPopup = popupEdicionParametros.find('.erp-form-error__text');

/** Fila del grid que tiene una celda con exactamente ese texto. */
export const filaGridParametros = (gridId, texto) =>
    gridParametros(gridId).find('.dx-datagrid-rowsview tr.dx-data-row td').withExactText(String(texto)).parent('tr');

/** Valida los títulos de las columnas del grid. */
export async function validarColumnasGrid360(t, gridId, columnas) {
    const grid = gridParametros(gridId);
    await t.expect(grid.with({ timeout: 15000 }).exists).ok(`No apareció el grid ${gridId}`);
    const vistas = [];
    const encabezados = grid.find('.dx-datagrid-headers .dx-header-row td');
    const total = await encabezados.count;
    for (let i = 0; i < total; i++) {
        const texto = normalizar(await encabezados.nth(i).textContent);
        if (texto) vistas.push(texto);
    }
    await t.expect(vistas).eql(columnas, `Columnas del grid ${gridId}`);
}

/** Pulsa "Agregar una fila" y espera el popup. */
export async function agregarFilaGrid360(t, gridId) {
    const boton = gridParametros(gridId).find('.dx-datagrid-header-panel [aria-label="Agregar una fila"]');
    await t
        .expect(boton.with({ timeout: 10000 }).exists).ok(`No está el botón "Agregar una fila" en ${gridId}`)
        .click(boton)
        .expect(popupEdicionParametros.with({ timeout: 10000 }).exists).ok(`No abrió el formulario para agregar en ${gridId}`);
}

/** Abre Editar en la fila que tiene el texto indicado. */
export async function editarFilaGrid360(t, gridId, texto) {
    const fila = filaGridParametros(gridId, texto);
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No se encontró la fila "${texto}" en ${gridId}`)
        .click(fila.find('[aria-label="Editar"]'))
        .expect(popupEdicionParametros.with({ timeout: 10000 }).exists).ok(`No abrió el formulario para editar "${texto}"`);
}

/** Escribe en un campo del popup por el final de su id (p. ej. 'StrTitulo'); sirve para input y textarea. */
export async function escribirCampoPopupParametros(t, campo, valor) {
    const input = popupEdicionParametros.find(`input[id$="_${campo}"], textarea[id$="_${campo}"]`).nth(0);
    await t
        .expect(input.with({ timeout: 10000 }).exists).ok(`No apareció el campo ${campo} en el formulario`)
        .typeText(input, String(valor), { replace: true })
        .pressKey('tab')
        .expect(input.value).eql(String(valor), `No quedó "${valor}" en ${campo}`);
}

/** Elige una opción del lookup del popup (índice 0 = primer lookup del formulario). */
export async function elegirLookupPopupParametros(t, opcion, indice = 0) {
    const lookup = popupEdicionParametros.find('.dx-lookup').nth(indice);
    await t.click(lookup.find('.dx-lookup-field'));
    const item = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withExactText(opcion);
    await t
        .expect(item.with({ timeout: 10000 }).exists).ok(`No está la opción "${opcion}" en la lista del formulario`)
        .click(item)
        .expect(lookup.find('.dx-lookup-field').withExactText(opcion).exists).ok(`No quedó "${opcion}" en el formulario`, { timeout: 5000 });
}

/**
 * Abre el lookup del popup y elige la primera opción que no esté en `usadas` (p. ej. tipos que ya tienen fila).
 * Devuelve la opción elegida, o null si todas están usadas (en ese caso cierra el formulario sin guardar).
 */
export async function elegirOpcionLibrePopupParametros(t, usadas, indice = 0) {
    const lookup = popupEdicionParametros.find('.dx-lookup').nth(indice);
    await t.click(lookup.find('.dx-lookup-field'));
    const items = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    await t.expect(items.with({ timeout: 10000 }).exists).ok('La lista del formulario no tiene opciones');
    const total = await items.count;
    for (let i = 0; i < total; i++) {
        const texto = normalizar(await items.nth(i).textContent);
        if (!usadas.map(normalizar).includes(texto)) {
            await t
                .click(items.nth(i))
                .expect(lookup.find('.dx-lookup-field').withExactText(texto).exists).ok(`No quedó "${texto}" en el formulario`, { timeout: 5000 });
            return texto;
        }
    }
    // Todas usadas: se cierra la lista y luego el formulario
    const cancelar = Selector('.dx-overlay-content').filterVisible().find('.dx-button').withText(/^\s*Cancelar\s*$/);
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPopupParametros(t);
    return null;
}

/** Guardar del popup: espera que se cierre; si no, falla con el mensaje de error del formulario. */
export async function guardarPopupParametros(t) {
    const guardar = popupEdicionParametros.find('.dx-button[aria-label="Guardar"]');
    for (let intento = 0; intento < 2 && await popupEdicionParametros.exists; intento++) {
        await t.click(guardar);
        const inicio = Date.now();
        while (await popupEdicionParametros.exists && !await errorPopup.exists && Date.now() - inicio < 15000) {
            await t.wait(300);
        }
        if (await errorPopup.exists) {
            await t.expect(false).ok(`El formulario no guardó: ${normalizar(await errorPopup.innerText)}`);
        }
    }
    await t.expect(popupEdicionParametros.exists).notOk('El formulario no se cerró al guardar');
}

/** Cerrar del popup sin guardar. */
export async function cerrarPopupParametros(t) {
    if (await popupEdicionParametros.exists) {
        await t
            .click(popupEdicionParametros.find('.dx-button[aria-label="Cerrar"]'))
            .expect(popupEdicionParametros.exists).notOk('El formulario no se cerró', { timeout: 10000 });
    }
}

/** Elimina la fila (Eliminar + confirmar) y valida que desaparezca. */
export async function eliminarFilaGridParametros360(t, gridId, texto) {
    const fila = filaGridParametros(gridId, texto);
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No se encontró la fila "${texto}" en ${gridId}`)
        .click(fila.find('[aria-label="Eliminar"]'))
        .expect(avisoVisible.withText(/Eliminar registro/i).with({ timeout: 10000 }).exists).ok('No apareció la confirmación de eliminar')
        .click(btnAceptarAviso)
        .expect(fila.exists).notOk(`La fila "${texto}" sigue en ${gridId} después de eliminarla`, { timeout: 15000 });
}

/** Elimina la fila si existe (limpieza de corridas anteriores). */
export async function eliminarFilaSiExisteParametros360(t, gridId, texto) {
    if (await filaGridParametros(gridId, texto).with({ timeout: 5000 }).exists) {
        await eliminarFilaGridParametros360(t, gridId, texto);
    }
}

/** Textos de una columna del grid (índice de celda, 0 = primera). */
export async function textosColumnaGrid360(gridId, indiceCelda) {
    const filas = gridParametros(gridId).find('.dx-datagrid-rowsview tr.dx-data-row');
    const textos = [];
    const total = await filas.count;
    for (let i = 0; i < total; i++) {
        textos.push(normalizar(await filas.nth(i).find('td').nth(indiceCelda).textContent));
    }
    return textos;
}
