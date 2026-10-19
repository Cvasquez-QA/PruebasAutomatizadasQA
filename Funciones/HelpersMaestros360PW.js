import { expect } from '@playwright/test';
import {
    abrirMaestros360,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaGrid360,
    eliminarFilaSiExiste360,
    filtrarPor,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    escaparRegex,
    textoExacto,
    existe,
    escribir
} from './HelpersHgi360PW.js';

/**
 * CRUD genérico (Playwright) para los maestros de hgi360 (React). Equivale a HelpersMaestros360.js.
 *
 *  - grid [data-testid="grid..."] con buscador "Buscar..." (los grids están paginados)
 *  - botón Nuevo  #BtnNuevo<Maestro>
 *  - formulario con campos #<id> (TextBox, NumberBox, Lookup, CheckBox) y botón Guardar #<id>_btn
 *  - al guardar aparece un toast .erp-toast[data-type="success"]:
 *      "Registro almacenado con éxito" (crear) / "Registro actualizado con éxito" (editar)
 *  - acciones de fila por aria-label (Ver | Editar | Eliminar) y confirmación button.swal2-confirm
 *
 * Definición de un campo:
 *  { id: 'txtZona_Codigo', valor: 'QAZONA' }                          texto o número (por defecto)
 *  { id: 'txtCargos_TxtFunciones', valor: 'x', tipo: 'area' }         área de texto
 *  { id: 'txtSucursales_IntEstado', tipo: 'check' }                   clic en el checkbox
 *  { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 1' }
 *  { id: 'FormasPago_Banco', tipo: 'lookup', filtro: 'GENERAL', opcion: /^0 - GENERAL/ }
 *     - opcion string: primero texto exacto, luego "empieza por", luego "contiene"
 *     - opcion RegExp: se usa tal cual
 */

const toastExito = (page, texto) => page.locator('.erp-toast[data-type="success"]')
    .filter({ hasText: texto, visible: true });
const toastProblema = page => page.locator('.erp-toast[data-type="error"], .erp-toast[data-type="warning"]')
    .filter({ visible: true });
const avisoVisible = page => page.locator('.swal2-container:not(.swal2-backdrop-hide) .swal2-popup')
    .filter({ visible: true });
const opciones = page => page.locator('.dx-overlay-content').filter({ visible: true }).locator('.dx-item-content');

const CREADO = /almacenad|guardad|cread/i;
const ACTUALIZADO = /actualizad/i;

/** Elige una opción del lookup abierto. */
export async function elegirOpcion(page, opcion) {
    let candidata;
    if (opcion instanceof RegExp) {
        candidata = opciones(page).filter({ hasText: opcion });
    } else if (await existe(opciones(page).filter({ hasText: textoExacto(opcion) }), 3000)) {
        candidata = opciones(page).filter({ hasText: textoExacto(opcion) });
    } else if (await existe(opciones(page).filter({ hasText: new RegExp(`^\\s*${escaparRegex(opcion)}`) }), 1000)) {
        candidata = opciones(page).filter({ hasText: new RegExp(`^\\s*${escaparRegex(opcion)}`) });
    } else {
        candidata = opciones(page).filter({ hasText: String(opcion) });
    }
    await expect(candidata.first(), `No apareció la opción "${opcion}" en la lista`).toBeAttached({ timeout: 10000 });
    await candidata.first().click();
}

/** Llena los campos del formulario abierto. */
export async function llenarCampos(page, campos = []) {
    for (const campo of campos) {
        const raiz = `#${campo.id}`;
        await expect(page.locator(raiz).filter({ visible: true }).first(),
            `No apareció el campo ${campo.id} en el formulario`).toBeAttached({ timeout: 10000 });

        switch (campo.tipo) {
            case 'check':
                await page.locator(`${raiz} .dx-checkbox-icon`).first().click();
                break;
            case 'lookup':
                await page.locator(`${raiz} .dx-lookup-field`).first().click();
                if (campo.filtro) {
                    await filtrarPor(page, campo.filtro);
                }
                await elegirOpcion(page, campo.opcion);
                break;
            default: { // texto, número y área
                const input = page.locator(`${raiz} .dx-texteditor-input`).first();
                await escribir(input, campo.valor);
                await input.press('Tab');
            }
        }
    }
}

/** Pulsa Guardar y espera el toast de éxito; si no llega, falla mostrando el mensaje de la aplicación. */
export async function guardarYConfirmar(page, idGuardar, textoExito, accion) {
    await page.locator(`#${idGuardar}`).filter({ visible: true }).first().click();

    if (await existe(toastExito(page, textoExito), 15000)) {
        await page.waitForTimeout(1000);
        return;
    }
    let mensaje = 'sin mensaje en pantalla';
    if (await existe(toastProblema(page))) {
        mensaje = await toastProblema(page).first().innerText();
    } else if (await existe(avisoVisible(page))) {
        mensaje = await avisoVisible(page).first().innerText();
    }
    expect(false, `${accion}: la aplicación no confirmó el guardado. Mensaje: ${mensaje.replace(/\s+/g, ' ')}`).toBeTruthy();
}

/**
 * Crear -> buscar -> editar -> buscar -> eliminar.
 *
 * m = {
 *   maestro, grupo,            // menú Maestros (abrirMaestros360)
 *   grid,                      // data-testid del grid, p. ej. 'gridZonas'
 *   guardar,                   // id del botón Guardar, p. ej. 'BtnActualizarZona_btn'
 *   campoCodigo, codigo,       // campo del código y valor de prueba
 *   crear: [campos],           // campos adicionales al crear
 *   editar: [campos],          // campos a cambiar al editar
 *   validarEditado             // texto que debe verse en la fila después de editar
 * }
 */
export async function ejecutarCrudMaestro(page, config, m) {
    await ingresarAplicacion(page, config);
    await abrirMaestros360(page, m.maestro, m.grupo);
    await eliminarFilaSiExiste360(page, m.grid, m.codigo);

    // Crear
    await nuevoRegistroGrid360(page, m.grid);
    await llenarCampos(page, [{ id: m.campoCodigo, valor: m.codigo }, ...(m.crear || [])]);
    await guardarYConfirmar(page, m.guardar, CREADO, `Crear ${m.maestro} ${m.codigo}`);
    await buscarEnGrid360(page, m.grid, m.codigo);
    await expect(filaGrid360(page, m.grid, m.codigo).first(),
        `No se encontró ${m.codigo} en ${m.maestro} después de crearlo`).toBeAttached({ timeout: 15000 });

    // Editar
    await accionFilaGrid360(page, m.grid, m.codigo, 'Editar');
    await expect(page.locator(`#${m.guardar}`).filter({ visible: true }).first(),
        `No se abrió el formulario de edición de ${m.maestro}`).toBeAttached({ timeout: 15000 });
    await llenarCampos(page, m.editar || []);
    await guardarYConfirmar(page, m.guardar, ACTUALIZADO, `Editar ${m.maestro} ${m.codigo}`);
    await buscarEnGrid360(page, m.grid, m.codigo);
    if (m.validarEditado !== undefined) {
        await expect(filaGrid360(page, m.grid, m.validarEditado).first(),
            `No se ve "${m.validarEditado}" en ${m.maestro} después de editar ${m.codigo}`).toBeAttached({ timeout: 15000 });
    }

    // Eliminar
    await eliminarFilaGrid360(page, m.grid, m.codigo);
    await cerrarPestana360(page);
    await cerrarSesion360(page);
}
