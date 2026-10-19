import { Selector } from 'testcafe';
import {
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaGrid360,
    eliminarFilaSiExiste360,
    filtrarPor,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from './HelpersHgi360Web.js';

/**
 * CRUD genérico para los maestros de test.hgi360.com (React).
 *
 * Validado en el navegador (16-oct-2026):
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

const toastExito = texto => Selector('.erp-toast[data-type="success"]').withText(texto).filterVisible();
const toastProblema = Selector('.erp-toast[data-type="error"], .erp-toast[data-type="warning"]').filterVisible();
const avisoVisible = Selector('.swal2-container:not(.swal2-backdrop-hide) .swal2-popup').filterVisible();
const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-item-content');

const escaparRegex = texto => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Ejecuta una promesa con límite de tiempo; si no responde, sigue sin bloquear la prueba. */
const conLimite = (promesa, ms) => Promise.race([promesa, new Promise(resolve => setTimeout(resolve, ms))]);

/**
 * Deja el navegador limpio antes de cada prueba: borra caché, cookies y almacenamiento
 * (localStorage, sessionStorage, IndexedDB, Cache Storage, service workers) de la app y del API,
 * y vuelve a cargar la página de inicio. Así la app no restaura pestañas ni sesión de la prueba anterior.
 * Cada llamada al navegador tiene límite de 10 s para que la limpieza nunca deje la prueba pegada.
 */
export async function prepararNavegador360(t, url) {
    try {
        const client = await conLimite(t.getCurrentCDPSession(), 10000);
        if (client) {
            await conLimite(client.Network.enable(), 10000);
            await conLimite(client.Network.clearBrowserCache(), 10000);
            await conLimite(client.Network.clearBrowserCookies(), 10000);
            const origenes = new Set([new URL(url).origin, 'https://srvtest.hgi360.com']);
            for (const origin of origenes) {
                await conLimite(client.Storage.clearDataForOrigin({ origin, storageTypes: 'all' }), 10000);
            }
        }
    } catch (e) {
        // Sin CDP (p. ej. --disable-native-automation): se continúa con la recarga
    }
    await t.navigateTo(url);
}

/** Borra la caché del navegador al terminar la prueba (con límite de tiempo, nunca bloquea). */
export async function limpiarCache360(t) {
    try {
        const client = await conLimite(t.getCurrentCDPSession(), 10000);
        if (client) {
            await conLimite(client.Network.enable(), 10000);
            await conLimite(client.Network.clearBrowserCache(), 10000);
        }
    } catch (e) {
        // sin CDP: nada que limpiar
    }
}

const CREADO = /almacenad|guardad|cread/i;
const ACTUALIZADO = /actualizad/i;

/**
 * Abre un maestro del menú Maestros sin depender del orden de las tarjetas
 * (en POS las tarjetas y sus "ver más" no están en el mismo orden que en Administrativo).
 */
export async function abrirMaestroMenu360(t, nombreMaestro) {
    const opcion = Selector('#ErpMenuCardGrid .erp-menu-child-text').withExactText(nombreMaestro).filterVisible();
    const verMas = Selector('#ErpMenuCardGrid .erp-menu-card-vermas').filterVisible();

    await t.click(Selector('#ErpSidebarModulos span').withExactText('Maestros'));
    if (!await opcion.with({ timeout: 3000 }).exists) {
        const total = await verMas.count;
        for (let i = 0; i < total; i++) {
            await t.click(verMas.nth(i));
        }
    }
    await t
        .expect(opcion.with({ timeout: 8000 }).exists).ok(`No se encontró el maestro "${nombreMaestro}" en el menú`)
        .click(opcion)
        .wait(1500);
}

/** Elige una opción del lookup abierto. */
export async function elegirOpcion(t, opcion) {
    let candidata;
    if (opcion instanceof RegExp) {
        candidata = opciones.withText(opcion);
    } else if (await opciones.withExactText(String(opcion)).with({ timeout: 3000 }).exists) {
        candidata = opciones.withExactText(String(opcion));
    } else if (await opciones.withText(new RegExp(`^\\s*${escaparRegex(opcion)}`)).with({ timeout: 1000 }).exists) {
        candidata = opciones.withText(new RegExp(`^\\s*${escaparRegex(opcion)}`));
    } else {
        candidata = opciones.withText(String(opcion));
    }
    await t
        .expect(candidata.with({ timeout: 10000 }).exists).ok(`No apareció la opción "${opcion}" en la lista`)
        .click(candidata.nth(0));
}

/** Llena los campos del formulario abierto. */
export async function llenarCampos(t, campos = []) {
    for (const campo of campos) {
        const raiz = `#${campo.id}`;
        await t.expect(Selector(raiz).filterVisible().with({ timeout: 10000 }).exists)
            .ok(`No apareció el campo ${campo.id} en el formulario`);

        switch (campo.tipo) {
            case 'check':
                await t.click(`${raiz} .dx-checkbox-icon`);
                break;
            case 'lookup':
                await t.click(`${raiz} .dx-lookup-field`);
                if (campo.filtro) {
                    await filtrarPor(t, campo.filtro);
                }
                await elegirOpcion(t, campo.opcion);
                break;
            default: // texto, número y área
                await t
                    .typeText(`${raiz} .dx-texteditor-input`, String(campo.valor), { replace: true })
                    .pressKey('tab');
        }
    }
}

/** Pulsa Guardar y espera el toast de éxito; si no llega, falla mostrando el mensaje de la aplicación. */
export async function guardarYConfirmar(t, idGuardar, textoExito, accion) {
    await t.click(Selector(`#${idGuardar}`).filterVisible());

    if (await toastExito(textoExito).with({ timeout: 15000 }).exists) {
        await t.wait(1000);
        return;
    }
    let mensaje = 'sin mensaje en pantalla';
    if (await toastProblema.exists) {
        mensaje = await toastProblema.innerText;
    } else if (await avisoVisible.exists) {
        mensaje = await avisoVisible.innerText;
    }
    await t.expect(false).ok(`${accion}: la aplicación no confirmó el guardado. Mensaje: ${mensaje.replace(/\s+/g, ' ')}`);
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
export async function ejecutarCrudMaestro(t, config, m) {
    await ingresarAplicacion(t, config);
    await abrirMaestroMenu360(t, m.maestro);
    await eliminarFilaSiExiste360(t, m.grid, m.codigo);

    // Crear
    await nuevoRegistroGrid360(t, m.grid);
    await llenarCampos(t, [{ id: m.campoCodigo, valor: m.codigo }, ...(m.crear || [])]);
    await guardarYConfirmar(t, m.guardar, CREADO, `Crear ${m.maestro} ${m.codigo}`);
    await buscarEnGrid360(t, m.grid, m.codigo);
    await t
        .expect(filaGrid360(m.grid, m.codigo).with({ timeout: 15000 }).exists)
        .ok(`No se encontró ${m.codigo} en ${m.maestro} después de crearlo`);

    // Editar
    await accionFilaGrid360(t, m.grid, m.codigo, 'Editar');
    await t.expect(Selector(`#${m.guardar}`).filterVisible().with({ timeout: 15000 }).exists)
        .ok(`No se abrió el formulario de edición de ${m.maestro}`);
    await llenarCampos(t, m.editar || []);
    await guardarYConfirmar(t, m.guardar, ACTUALIZADO, `Editar ${m.maestro} ${m.codigo}`);
    await buscarEnGrid360(t, m.grid, m.codigo);
    if (m.validarEditado !== undefined) {
        await t
            .expect(filaGrid360(m.grid, m.validarEditado).with({ timeout: 15000 }).exists)
            .ok(`No se ve "${m.validarEditado}" en ${m.maestro} después de editar ${m.codigo}`);
    }

    // Eliminar
    await eliminarFilaGrid360(t, m.grid, m.codigo);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

/**
 * Inserción de duplicados: crea el registro de prueba, intenta crearlo otra vez con el mismo código y
 * valida que la aplicación lo rechace ("Ya existe un registro..."); al final borra el registro.
 * No inicia ni cierra sesión (para encadenar varios maestros en una prueba). Usa la misma definición
 * `m` que ejecutarCrudMaestro.
 */
export async function probarDuplicadoMaestro360(t, m) {
    await abrirMaestroMenu360(t, m.maestro);
    await eliminarFilaSiExiste360(t, m.grid, m.codigo);
    const campos = [{ id: m.campoCodigo, valor: m.codigo }, ...(m.crear || [])];

    // Registro original
    await nuevoRegistroGrid360(t, m.grid);
    await llenarCampos(t, campos);
    await guardarYConfirmar(t, m.guardar, CREADO, `Crear ${m.maestro} ${m.codigo}`);
    await cerrarPestana360(t);

    // Duplicado
    await abrirMaestroMenu360(t, m.maestro);
    await nuevoRegistroGrid360(t, m.grid);
    await llenarCampos(t, campos);
    await t.click(Selector(`#${m.guardar}`).filterVisible());
    const rechazo = Selector('.erp-toast[data-type="error"], .erp-toast[data-type="warning"], .swal2-popup')
        .filterVisible()
        .withText(/existe/i);
    const creado = await toastExito(CREADO).with({ timeout: 3000 }).exists;
    await t
        .expect(creado).notOk(`${m.maestro}: la aplicación dejó crear el código duplicado ${m.codigo}`)
        .expect(rechazo.with({ timeout: 15000 }).exists)
        .ok(`${m.maestro}: no se mostró el mensaje de registro existente para el código ${m.codigo}`);
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }
    await cerrarPestana360(t);

    // Limpieza
    await abrirMaestroMenu360(t, m.maestro);
    await eliminarFilaSiExiste360(t, m.grid, m.codigo);
    await cerrarPestana360(t);
}
