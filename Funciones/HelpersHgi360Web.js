import { ClientFunction, Selector } from 'testcafe';

/**
 * Helpers para mi.hgi360.com (ERP web en React).
 * Usan los selectores de esa versión: data-testid en los grids, aria-label
 * en las acciones de fila, placeholders en el login y el menú lateral
 * #ErpSidebarModulos. No entran a iframes de pestaña.
 */

const selectorGrid = gridId => {
    const id = String(gridId).replace(/^#/, '');
    // Algunos maestros (p. ej. Empleados de Nómina) solo tienen el id, sin data-testid
    return Selector(`[data-testid="${id}"], #${id}`).filterVisible();
};

/** Confirmación del aviso nuevo (SweetAlert): el botón de la acción, p. ej. Eliminar. */
const btnConfirmarDialogo = Selector('button.swal2-confirm').filterVisible();

export const filtrarPorInput = Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-texteditor-input');

export const TX_DOCUMENTO = '01FE';
export const TX_DOCUMENTO_TEXTO = '01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA';
export const TERCERO = '1000099598';
// El nombre está guardado con doble espacio entre "Vasquez" y "Suarez"; así se muestra en los combos.
export const TERCERO_TEXTO = '1000099598 - Vasquez  Suarez Camilo';
export const PRODUCTO = '010203';

export const filtrarPor = async (t, texto) => {
    await t.typeText(filtrarPorInput, texto)
        .wait(2000);
};

export const selectorOpcion = texto => Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-item-content')
    .withText(texto);

export const seleccionarOpcion = async (t, texto) => {
    await t.click(selectorOpcion(texto));
};

/**
 * Abre el lookup del contenedor (p. ej. '#PuntoDeVenta_Tercero'), filtra si se indica y elige la opción:
 * primero el texto exacto, luego el que empieza por el texto y por último el que lo contiene.
 */
export const elegirEnLookup360 = async (t, contenedor, opcion, filtro = null) => {
    await t.click(`${contenedor} .dx-lookup-field`);
    if (filtro !== null) {
        await t
            .expect(filtrarPorInput.with({ timeout: 10000 }).exists).ok(`No se abrió la lista de ${contenedor}`)
            .typeText(filtrarPorInput, String(filtro), { replace: true })
            .wait(2000);
    }
    const lista = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
    const texto = String(opcion).replace(/\s+/g, ' ').trim();
    // Los filtros corren en el navegador: "buscada" llega como dependencia. Algunos nombres traen doble espacio.
    const buscada = texto.toLowerCase();
    const exacta = lista.filter(nodo => nodo.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === buscada, { buscada });
    const empieza = lista.filter(nodo => nodo.textContent.replace(/\s+/g, ' ').trim().toLowerCase().indexOf(buscada) === 0, { buscada });
    const contiene = lista.filter(nodo => nodo.textContent.replace(/\s+/g, ' ').toLowerCase().indexOf(buscada) !== -1, { buscada });
    let candidata = exacta;
    if (!await exacta.with({ timeout: 5000 }).exists) {
        candidata = await empieza.exists ? empieza : contiene;
    }
    const textoEnCampo = new RegExp(escaparRegex(texto).replace(/ /g, '\\s+'), 'i');
    await t
        .expect(candidata.with({ timeout: 10000 }).exists).ok(`No apareció la opción "${texto}" en ${contenedor}`)
        .click(candidata.nth(0))
        .expect(Selector(`${contenedor} .dx-lookup-field`).withText(textoEnCampo).exists)
        .ok(`No quedó "${texto}" en ${contenedor}`, { timeout: 10000 });
};

/** Fila del grid cuya celda tiene exactamente el texto indicado. */
export const filaGrid360 = (gridId, texto) =>
    selectorGrid(gridId)
        .find('tr.dx-data-row td')
        .withExactText(String(texto))
        .parent('tr');

/** Escribe en el buscador general del grid ("Buscar..."). */
export const buscarEnGrid360 = async (t, gridId, texto) => {
    const grid = selectorGrid(gridId);
    const campo = grid.find('.dx-datagrid-search-panel .dx-texteditor-input');

    await t
        .expect(grid.with({ timeout: 15000 }).exists).ok(
            `No apareció el grid ${gridId}`
        )
        .expect(campo.with({ timeout: 10000 }).exists).ok(
            `No apareció el buscador del grid ${gridId}`
        )
        // Si se escribe antes de que el grid cargue sus datos, la búsqueda se pierde
        .expect(grid.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible().with({ timeout: 20000 }).exists)
        .ok(`El grid ${gridId} no terminó de cargar`)
        .typeText(campo, String(texto), { replace: true })
        .wait(1500);
};

const pulsarNuevo = ClientFunction(() => {
    document.querySelectorAll('.erp-page-skeleton-toolbar').forEach(nodo => nodo.remove());
    const btn = document.querySelector('[id^="BtnNuevo"]');
    if (btn) btn.click();
});

/** Clic en el botón Nuevo del maestro abierto (#BtnNuevo<Maestro>). */
export const nuevoRegistroGrid360 = async (t, gridId) => {
    const btnNuevo = Selector('[id^="BtnNuevo"]').filterVisible();
    const esqueleto = Selector('.erp-page-skeleton-toolbar');

    await t.expect(btnNuevo.with({ timeout: 15000 }).exists).ok(
        `No apareció el botón Nuevo del maestro (${gridId})`
    );
    const inicio = Date.now();
    while (await esqueleto.filterVisible().exists && Date.now() - inicio < 8000) {
        await t.wait(400);
    }
    await pulsarNuevo();
};

/** Clic en una acción de la fila: 'Editar' | 'Eliminar' | 'Ver'. */
export const accionFilaGrid360 = async (t, gridId, texto, accion) => {
    const fila = filaGrid360(gridId, texto);
    const boton = fila.find(`[aria-label="${accion}"]`);

    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(
            `No se encontró la fila "${texto}" en ${gridId}`
        )
        .expect(boton.with({ timeout: 10000 }).exists).ok(
            `No apareció la acción "${accion}" en la fila "${texto}"`
        )
        .click(boton.nth(0));
};

/** Elimina la fila indicada y valida que desaparezca. */
export const eliminarFilaGrid360 = async (t, gridId, texto) => {
    await accionFilaGrid360(t, gridId, texto, 'Eliminar');
    await t
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .expect(filaGrid360(gridId, texto).with({ timeout: 15000 }).exists)
        .notOk(`La fila "${texto}" sigue en ${gridId} después de eliminarla`);
};

/** Busca el registro en el grid y lo elimina solo si existe. */
export const eliminarFilaSiExiste360 = async (t, gridId, texto) => {
    await buscarEnGrid360(t, gridId, texto);
    // Grids grandes (p. ej. Terceros) tardan más de 4 s en filtrar
    if (await filaGrid360(gridId, texto).with({ timeout: 8000 }).exists) {
        await eliminarFilaGrid360(t, gridId, texto);
    }
};

/** Elimina la primera fila visible del grid y confirma el aviso. */
export const eliminarRegistroDesdeGrid = async (t, gridId) => {
    const boton = selectorGrid(gridId).find('[aria-label="Eliminar"]').filterVisible();

    await t
        .expect(boton.with({ timeout: 10000 }).exists).ok(
            `No apareció Eliminar en ${gridId}`
        )
        .click(boton.nth(0))
        .click(btnConfirmarDialogo.with({ timeout: 10000 }));
};

/** Busca el código en el grid y elimina la fila si existe. */
export const eliminarRegistroSiExiste = async (t, gridId, codigo) => {
    await buscarEnGrid360(t, gridId, codigo);
    if (await filaGrid360(gridId, codigo).with({ timeout: 4000 }).exists) {
        await eliminarFilaGrid360(t, gridId, codigo);
    }
};

/** Popup de edición visible de un grid (formulario "Edit form" de DevExtreme). */
export const popupEdicion360 = Selector('.dx-overlay-content[aria-label="Edit form"]').filterVisible();

/** Input del popup de edición por su campo de datos: el id del input termina en _<campo> (p. ej. IntCantidad). */
export const campoPopup360 = campo =>
    popupEdicion360.find(`input.dx-texteditor-input[id$="_${campo}"]`);

/** Escribe en un campo del popup de edición y sale con Tab. */
export const escribirCampoPopup360 = async (t, campo, valor) => {
    const input = campoPopup360(campo);
    await t
        .expect(input.with({ timeout: 10000 }).exists).ok(
            `No apareció el campo ${campo} en el popup de edición`
        )
        .typeText(input, String(valor), { replace: true })
        .pressKey('tab');
};

/**
 * Guardar del popup de edición. El popup solo se cierra si el ERP acepta el registro;
 * si no se cierra, falla con el texto del resumen de errores (resumen: selector, p. ej. '#summary_AdPresupuestoVentas').
 */
export const guardarPopup360 = async (t, resumen = null) => {
    await t.click(popupEdicion360.find('.dx-button[aria-label="Guardar"]'));

    const inicio = Date.now();
    while (await popupEdicion360.exists && Date.now() - inicio < 30000) {
        await t.wait(500);
    }

    let mensaje = '';
    if (resumen && await Selector(resumen).filterVisible().exists) {
        mensaje = await Selector(resumen).filterVisible().innerText;
    }
    await t.expect(popupEdicion360.exists).notOk(
        `El popup de edición no se cerró al guardar. ${mensaje}`.trim()
    );
};

/** Cerrar del popup de edición sin guardar. */
export const cerrarPopup360 = async t => {
    await t
        .click(popupEdicion360.find('.dx-button[aria-label="Cerrar"]'))
        .expect(popupEdicion360.exists).notOk('El popup de edición no se cerró', { timeout: 10000 });
};

/** Escribe una fecha (yyyy-MM-dd) en un DateBox y la confirma con Enter. */
export const escribirFecha360 = async (t, contenedor, fecha) => {
    const input = Selector(`${contenedor} .dx-texteditor-input`);
    await t
        .typeText(input, fecha, { replace: true })
        .pressKey('enter')
        .expect(input.value).eql(fecha, `No quedó la fecha ${fecha} en ${contenedor}`);
};

export const verMasProductos360 = async t => {
    await t.click(Selector('.erp-menu-card-vermas').nth(0));
};

export const verMasTerceros360 = async t => {
    await t.click(Selector('.erp-menu-card-vermas').nth(1));
};

export const verMasLocalizacion360 = async t => {
    await t.click(Selector('.erp-menu-card-vermas').nth(2));
};

export const verMasImpuestos360 = async t => {
    await t.click(Selector('.erp-menu-card-vermas').nth(3));
};

const escaparRegex = texto => String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Opción del menú de tarjetas por su texto, sin distinguir mayúsculas (las pruebas legacy usan p. ej. 'DOCUMENTOS').
 * Prefiere la coincidencia exacta; si no hay, la que contenga el texto.
 */
const opcionMenu360 = async opcion => {
    const opciones = Selector('#ErpMenuCardGrid .erp-menu-child-text');
    // El filtro corre en el navegador: "buscada" llega como dependencia del Selector, no por closure
    const exacta = opciones.filter(
        nodo => nodo.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === buscada,
        { buscada: String(opcion).replace(/\s+/g, ' ').trim().toLowerCase() }
    );
    return await exacta.with({ timeout: 2000 }).exists
        ? exacta
        : opciones.withText(new RegExp(escaparRegex(opcion), 'i'));
};

/** Si la opción está en una tarjeta recogida, pulsa "Ver más" de esa tarjeta. */
const expandirTarjetaMenu360 = async (t, opcion) => {
    if (await opcion.exists && !await opcion.filterVisible().exists) {
        const verMas = opcion.parent('article').find('.erp-menu-card-vermas');
        if (await verMas.exists) {
            await t.click(verMas).wait(1000);
        }
    }
};

const abrirMenu360 = async (t, modulo, opcion) => {
    await t.click(Selector('#ErpSidebarModulos span').withText(modulo));

    await t.expect(Selector('#ErpMenuCardGrid .erp-menu-child-text').with({ timeout: 20000 }).exists)
        .ok(`No cargó el menú de ${modulo}`);
    const destino = await opcionMenu360(opcion);
    await expandirTarjetaMenu360(t, destino);

    await t
        .expect(destino.filterVisible().with({ timeout: 8000 }).exists).ok(
            `No se encontró "${opcion}" en el menú ${modulo}`
        )
        .click(destino.filterVisible().nth(0))
        .wait(1500);
};

/**
 * Abre un maestro del menú lateral.
 * grupo (opcional): 'productos' | 'terceros' | 'localizacion' | 'impuestos'
 */
export const abrirMaestros360 = async (t, nombreMaestro, grupo = null) => {
    await t.click(Selector('#ErpSidebarModulos span').withText('Maestros'));

    const opcionMenu = Selector('#ErpMenuCardGrid')
        .find('.erp-menu-child-text')
        .withExactText(nombreMaestro)
        .filterVisible();

    const yaVisible = await opcionMenu.with({ timeout: 2000 }).exists;

    if (!yaVisible && grupo) {
        if (grupo === 'productos') {
            await verMasProductos360(t);
        } else if (grupo === 'terceros') {
            await verMasTerceros360(t);
        } else if (grupo === 'localizacion') {
            await verMasLocalizacion360(t);
        } else if (grupo === 'impuestos') {
            await verMasImpuestos360(t);
        }
        await t.wait(1500);
    } else if (!yaVisible) {
        await expandirTarjetaMenu360(t, Selector('#ErpMenuCardGrid .erp-menu-child-text').withExactText(nombreMaestro));
    }

    await t
        .expect(opcionMenu.with({ timeout: 8000 }).exists).ok(
            `No se encontró el maestro "${nombreMaestro}" en el menú (grupo=${grupo || 'ninguno'})`
        )
        .click(opcionMenu)
        .wait(1500);
};

export const abrirMovimientos360 = async (t, nombreMovimiento) => {
    await abrirMenu360(t, 'Movimientos', nombreMovimiento);
};

export const abrirMovimiento360 = abrirMovimientos360;

export const abrirHerramientas360 = async (t, nombreHerramienta) => {
    await abrirMenu360(t, 'Herramientas', nombreHerramienta);
};

/** Módulo CRM: Gestión > Contratos, Casos, Agenda, Oportunidades... */
export const abrirGestion360 = async (t, nombreOpcion) => {
    await abrirMenu360(t, 'Gestión', nombreOpcion);
};

export const abrirProcesos360 = async (t, nombreProceso) => {
    await abrirMenu360(t, 'Procesos', nombreProceso);
};

export const abrirReportes360 = async (t, nombreReporte) => {
    await abrirMenu360(t, 'Reportes', nombreReporte);
};

export const abrirUtilitarios360 = async (t, nombreUtilitario) => {
    await abrirMenu360(t, 'Utilitarios', nombreUtilitario);
};

export const abrirNominaE360 = async (t, nombreOpcion) => {
    await abrirMenu360(t, 'NominaE', nombreOpcion);
};

export const abrirAyuda360 = async (t, nombreOpcion) => {
    await abrirMenu360(t, 'Ayuda', nombreOpcion);
};

export const abrirIA360 = async (t, nombreOpcion) => {
    await abrirMenu360(t, 'IA', nombreOpcion);
};

export async function confirmarProceso(t) {
    if (await btnConfirmarDialogo.visible) {
        await t.click(btnConfirmarDialogo).wait(1500);
    }
}

export async function aceptarValidacionesSiExisten(t) {
    if (await btnConfirmarDialogo.visible) {
        await t.click(btnConfirmarDialogo).wait(1500);
    }
    if (await btnConfirmarDialogo.visible) {
        await t.click(btnConfirmarDialogo).wait(1500);
    }
}

export const castearValorEntero = valor => {
    const limpio = String(valor ?? '').replace(/[$\s]/g, '');
    const parteEntera = limpio.split(',')[0].replace(/\./g, '').trim();
    return parseInt(parteEntera, 10) || 0;
};

export const parseTextoNumerico = texto => castearValorEntero(texto);

export const parseValorNumerico = async selector => {
    const elemento = Selector(selector);
    const valor = await elemento.value;
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        return castearValorEntero(valor);
    }
    return castearValorEntero(await elemento.innerText);
};

export const cerrarPestana360 = async t => {
    await t
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close.erp-tab-close');
};

export const cerrarSesion360 = async t => {
    const salir = Selector('#divpanelmaster span').withText('Cerrar sesión');
    await t.switchToMainWindow();
    // Si quedó un popup abierto el primer clic solo lo cierra y el menú del usuario no se despliega
    for (let intento = 0; intento < 3 && !await salir.visible; intento++) {
        const popup = Selector('.dx-popup-wrapper .dx-overlay-content').filterVisible();
        if (await popup.exists) {
            const cerrar = popup.find('.dx-closebutton, [aria-label="close"], .dx-button').withText(/^\s*(Cancelar|Cerrar)?\s*$/);
            await t.click(await cerrar.exists ? cerrar.nth(0) : popup.find('.dx-button').nth(0)).wait(800);
        }
        await t
            .click(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger'))
            .wait(800);
    }
    await t.click(salir);
};

export const ingresarAplicacion = async (t, config) => {
    await t.switchToMainWindow();
    await t.maximizeWindow();
    await t.wait(2000);
    const empresa = Selector('input.dx-texteditor-input[placeholder="Identificación Empresa"]');
    const usuario = Selector('input.dx-texteditor-input[placeholder="Usuario"]');
    const clave = Selector('input.dx-texteditor-input[placeholder="Contraseña"]');
    const btnIngresar = Selector('#buttonAutenticar');

    await t.wait(3000);
    // Tras un fallo de la prueba anterior la página a veces no termina de cargar: se recarga una vez
    for (let recarga = 0; recarga < 2 && !await empresa.with({ timeout: 20000 }).exists; recarga++) {
        await t.navigateTo(config.pagina).wait(3000);
    }
    if (!await empresa.with({ timeout: 30000 }).exists) {
        const pagina = await ClientFunction(() => `${location.href} | ${(document.body && document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 200)}`)();
        await t.expect(false).ok(`No apareció el campo Empresa en el login. Página: ${pagina}`);
    }
    await t
        .click(empresa)
        .typeText(empresa, config.empresa, { replace: true, paste: true })
        .wait(1000)
        .click(usuario)
        .typeText(usuario, config.usuario, { replace: true, paste: true })
        .wait(1000)
        .click(clave)
        .typeText(clave, config.clave, { replace: true, paste: true })
        .wait(1000)
        .click(btnIngresar)
        .wait(3000);
};

/** Abre Movimientos > Documentos, pulsa Nuevo y elige la transacción TX_DOCUMENTO. */
const abrirNuevoDocumento360 = async t => {
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 })
        .click(Selector('#BtnNuevoDocumento').filterVisible())
        .expect(Selector('#Documento_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se abrió el formulario de documentos')
        .click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, TX_DOCUMENTO);
    await seleccionarOpcion(t, TX_DOCUMENTO_TEXTO);
};

export const eliminarDocumento360 = async (t, numeroDocumento) => {
    await abrirNuevoDocumento360(t);
    await t
        .typeText('#txtDocumento .dx-texteditor-input', String(numeroDocumento), { replace: true })
        .pressKey('enter')
        .wait(3000)
        .expect(Selector('#Documento_Tercero').withText(TERCERO).exists)
        .ok(`No cargó el documento ${numeroDocumento} para eliminarlo`)
        .click('#BtnEliminarDocumento_btn')
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .wait(3000);
};

export const crearDocumento360 = async t => {
    await abrirNuevoDocumento360(t);
    await t.click('#Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, TERCERO);
    // Por el código: el nombre trae doble espacio y según el combo se ve con uno o con dos
    await seleccionarOpcion(t, new RegExp(`^\\s*${TERCERO} -`));

    // Encabezado
    await t
        .click('#BtnGuardarDocumento_btn')
        .wait(3000);

    // Detalle: producto, cantidad 1, valor unitario 1000.
    // Al confirmar el producto la app lo carga (~0,7 s), reinicia cantidad/valor y pasa el foco a Remesa:
    // se espera eso antes de escribir cantidad y valor.
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO, { replace: true })
        .pressKey('enter')
        .expect(Selector('#txtDocumento_Detalle_Producto_Remesa_1').focused)
        .ok(`No terminó de cargar el producto ${PRODUCTO}`, { timeout: 10000 })
        .wait(500)
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1', { replace: true })
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000', { replace: true })
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon-save');

    // El total se recalcula entre 2 y 5 s después de grabar la línea
    let valorDocumento = 0;
    for (const inicio = Date.now(); valorDocumento <= 0 && Date.now() - inicio < 15000;) {
        await t.wait(500);
        valorDocumento = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');
    }
    await t.expect(valorDocumento).gt(0, 'El total del documento quedó en 0');

    await t
        .click('#BtnGuardarDocumento_btn')
        .wait(4000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;
    await t.expect(numeroDocumento).ok('El documento no quedó con número');

    await cerrarPestana360(t);

    return { valorDocumento, numeroDocumento };
};

export const limpiarCacheChromeTestCafe = async t => {
    const client = await t.getCurrentCDPSession();

    await client.Network.enable();
    await client.Network.clearBrowserCache();
};

/* ----------------------------------------------------------------------------
 * Equivalentes React de helpers de HelpersHgi360Legacy.js, con el mismo nombre
 * y firma para las pruebas migradas (InconsistenciasWeb).
 * --------------------------------------------------------------------------*/

export const marcarRadioSiNoEsta = async (t, contenedor, indice = 0) => {
    const radio = Selector(contenedor).find('.dx-radiobutton').nth(indice);
    if (await radio.getAttribute('aria-checked') !== 'true') {
        await t.click(radio.find('.dx-radiobutton-icon'));
    }
};

export const marcarCheckboxSiNoEsta = async (t, selectorCheckbox) => {
    if (await Selector(selectorCheckbox).getAttribute('aria-checked') !== 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

export const desmarcarCheckboxSiEsta = async (t, selectorCheckbox) => {
    if (await Selector(selectorCheckbox).getAttribute('aria-checked') === 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

/** Elige la transacción del documento abierto (lookup #Documento_Transaccion). */
export const abrirTransaccion = async (t, texto) => {
    await t.click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, texto);
    await seleccionarOpcion(t, texto);
};

/** Escribe el número en el campo Documento y lo carga con Enter. */
export const buscarConsecutivoDoc = async (t, numero) => {
    const campo = Selector('#txtDocumento .dx-texteditor-input');
    await t
        .typeText(campo, String(numero), { replace: true })
        .pressKey('enter')
        .expect(campo.value).contains(String(numero), 'No se ingresó el número del documento');
};

/** Valor en una celda o en un campo del detalle (las líneas de Documentos se pintan como campos). */
export const esperarValorVisible = async (t, valor) => {
    const buscado = String(valor);
    const enCelda = Selector('td').withText(buscado).filterVisible();
    // "10,00" también debe encontrar "10,0000" (el detalle muestra 4 decimales)
    const enCampo = Selector('#panel_Documento_Detalle input').filterVisible()
        .filter(nodo => String(nodo.value).indexOf(buscado) === 0, { buscado });
    const inicio = Date.now();
    while (!await enCelda.exists && !await enCampo.exists && Date.now() - inicio < 15000) {
        await t.wait(500);
    }
    await t.expect(await enCelda.exists || await enCampo.exists).ok(`No se encontró el valor ${valor}`);
};

/**
 * Línea 1 del detalle de Documentos: producto y cantidad, y la graba.
 * Al confirmar el producto la app lo carga y pasa el foco a Remesa; se espera eso antes de escribir la cantidad.
 */
export const ingresarDetalle = async (t, producto, cantidad) => {
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', String(producto), { replace: true })
        .pressKey('enter')
        // Al cargar el producto el foco pasa a Remesa (Administrativo) o a Descripción (POS, sin columna Remesa)
        .expect(Selector('#txtDocumento_Detalle_Producto_cursor_1').focused)
        .notOk(`No terminó de cargar el producto ${producto}`, { timeout: 10000 })
        .wait(500)
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', String(cantidad), { replace: true })
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon-save');
};

/** Elimina el documento abierto en Documentos y confirma el aviso. */
export const eliminarDocumento = async t => {
    await t
        .click('#BtnEliminarDocumento_btn')
        .click(btnConfirmarDialogo.with({ timeout: 10000 }))
        .wait(3000);
};

/* ----------------------------------------------------------------------------
 * Cambiar Periodo (menú del usuario): lookups #TxtCambioPeriodo_Anyo y
 * #TxtCambioPeriodo_Periodo, botón #BtnGuardarCambioPeriodo.
 * --------------------------------------------------------------------------*/

/** Abre Cambiar Periodo desde el menú del usuario. */
export const abrirCambioPeriodo360 = async t => {
    const opcion = Selector('#divpanelmaster span').withText(/Cambiar\s+per[ií]odo/i);
    await t.switchToMainWindow();
    // Después de guardar un periodo la aplicación se recarga: el primer clic al menú del usuario puede perderse
    await t.expect(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger').with({ timeout: 30000 }).visible).ok('No cargó el encabezado');
    for (let intento = 0; intento < 4 && !await opcion.visible; intento++) {
        await t.click(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger')).wait(1000);
    }
    await t
        .click(opcion.nth(0))
        .expect(Selector('#TxtCambioPeriodo_Periodo').with({ timeout: 15000 }).visible).ok('No se abrió Cambiar Periodo');
};

/** Periodo y año de trabajo que muestra el encabezado ("Periodo: 10 de 2026 (Abierto)"). */
export const leerPeriodoEncabezado360 = async t => {
    const encabezado = Selector('span, div').filterVisible().withText(/^\s*Periodo:\s*\d+\s+de\s+\d{4}/);
    await t.expect(encabezado.with({ timeout: 20000 }).exists).ok('No se ve el periodo de trabajo en el encabezado');
    const [, periodo, anio] = /Periodo:\s*(\d+)\s+de\s+(\d{4})/.exec(await encabezado.nth(-1).innerText);
    return { periodo, anio };
};

/** Año y periodo que muestra Cambiar Periodo (texto de cada lookup). */
export const leerPeriodo360 = async () => {
    // Al abrir la pantalla los lookups tardan en llenarse: se espera a que tengan texto
    // En algunos módulos el valor está en el texto del lookup y en otros en el value del input del selectbox
    const texto = async id => {
        const campo = Selector(`${id} .dx-lookup-field`);
        const input = Selector(`${id} input.dx-texteditor-input`);
        for (const inicio = Date.now(); Date.now() - inicio < 10000;) {
            const valor = ((await campo.exists ? await campo.innerText : '') || (await input.exists ? await input.value : '') || '').trim();
            if (valor) {
                return valor;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return '';
    };
    return {
        anio: await texto('#TxtCambioPeriodo_Anyo'),
        periodo: await texto('#TxtCambioPeriodo_Periodo')
    };
};

/** Elige en el lookup la opción cuyo texto es el valor o empieza por "valor -". */
const elegirOpcionPeriodo360 = async (t, contenedor, valor) => {
    const buscado = String(valor).split(' - ')[0].trim();
    await t.click(`${contenedor} .dx-lookup-field`);
    const opcion = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item')
        .withText(new RegExp(`^\\s*${escaparRegex(buscado)}(\\s*-.*)?\\s*$`));
    await t
        .expect(opcion.with({ timeout: 10000 }).exists).ok(`No aparece "${valor}" en ${contenedor}`)
        .click(opcion.nth(0))
        .wait(800);
};

/** Cambia al periodo/año indicados con Cambiar Periodo abierto y guarda (acepta la confirmación). */
export const guardarPeriodo360 = async (t, periodo, anio = null) => {
    const buscado = String(periodo).split(' - ')[0].trim();
    const conAnio = anio !== null && anio !== undefined && String(anio).trim() !== '';
    const guardar = Selector('#BtnGuardarCambioPeriodo_btn, #BtnGuardarCambioPeriodo').filterVisible();
    for (let intento = 1; ; intento++) {
        // Los lookups se llenan con el periodo vigente después de abrir la pantalla y pisan lo que se elija antes
        await leerPeriodo360();
        await t.wait(1500);
        if (conAnio) {
            await elegirOpcionPeriodo360(t, '#TxtCambioPeriodo_Anyo', anio);
        }
        await elegirOpcionPeriodo360(t, '#TxtCambioPeriodo_Periodo', periodo);
        await t.click(guardar.nth(0));
        if (await btnConfirmarDialogo.with({ timeout: 8000 }).exists) {
            await t.click(btnConfirmarDialogo);
        }
        await t.wait(5000);
        const actual = await leerPeriodoEncabezado360(t);
        if (actual.periodo === buscado && (!conAnio || actual.anio === String(anio).trim())) {
            return;
        }
        await t.expect(intento).lt(3, `No se pudo cambiar al periodo ${buscado}${conAnio ? ` de ${anio}` : ''} (quedó ${actual.periodo} de ${actual.anio})`);
        await abrirCambioPeriodo360(t);
    }
};

/* ----------------------------------------------------------------------------
 * Maestros > Transacciones (grid gridTransacciones, pestañas #tabs_documento_<Pestaña>,
 * botones #BtnGuardarTransaccion / #BtnCancelarTransaccion).
 * --------------------------------------------------------------------------*/

/** Abre la transacción en edición y, si se indica, la pestaña (Documentos, Cartera, Inventario...). */
export const editarTransaccion360 = async (t, codigo, pestana = null) => {
    await abrirMaestros360(t, 'Transacciones');
    await buscarEnGrid360(t, 'gridTransacciones', codigo);
    await t.wait(1500);
    await accionFilaGrid360(t, 'gridTransacciones', codigo, 'Editar');
    if (pestana) {
        await t
            .click(Selector(`#tabs_documento_${pestana}`).with({ timeout: 15000 }))
            .wait(1500);
    }
};

/** Guarda el registro del maestro abierto (#BtnGuardar<Maestro>) y falla si el ERP muestra un error. */
export const guardarMaestro360 = async (t, maestro) => {
    await t.click(Selector(`#BtnGuardar${maestro}_btn, #BtnGuardar${maestro}`).filterVisible().nth(0)).wait(2500);
    if (await btnConfirmarDialogo.with({ timeout: 3000 }).exists) {
        await t.click(btnConfirmarDialogo).wait(1500);
    }
    const error = Selector('.erp-toast[data-type="error"], .erp-form-error__text').filterVisible();
    if (await error.exists) {
        await t.expect(false).ok(`No se guardó ${maestro}: ${(await error.nth(0).innerText).replace(/\s+/g, ' ').trim()}`);
    }
};

/** Cancela la edición del maestro abierto (si el botón está) y cierra la pestaña. */
export const cancelarMaestro360 = async (t, maestro) => {
    const cancelar = Selector(`[id^="BtnCancelar${maestro}"]`).filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPestana360(t);
};

/**
 * Reportes > <reporte>, plantilla indicada, Generar; busca el texto en el buscador del grid del reporte y devuelve
 * el texto de cada celda de las filas que lo contienen (expande los grupos cerrados).
 */
export const filasReporte360 = async (t, reporte, plantilla, texto) => {
    const listaPlantillas = Selector('[id$="_SlbListaPlantillas"]');
    const grid = Selector('[id$="_GridReportes"]').filterVisible();
    await abrirReportes360(t, reporte);
    await t
        .expect(listaPlantillas.with({ timeout: 20000 }).exists).ok(`No cargó la lista de plantillas de ${reporte}`)
        .click(listaPlantillas)
        .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(plantilla))
        .wait(1500)
        .click(Selector('[id$="_BtnGenerar"]').filterVisible())
        .expect(grid.find('tr.dx-data-row, tr.dx-group-row').with({ timeout: 30000 }).exists).ok(`El reporte ${plantilla} no trajo datos`);
    const buscar = grid.find('.dx-datagrid-search-panel .dx-texteditor-input');
    if (await buscar.exists) {
        await t.typeText(buscar, String(texto), { replace: true }).wait(2500);
    }
    for (let i = 0; i < 5 && await grid.find('.dx-datagrid-group-closed').exists; i++) {
        await t.click(grid.find('.dx-datagrid-group-closed').nth(0)).wait(800);
    }
    return ClientFunction((buscado) => {
        const g = Array.from(document.querySelectorAll('[id$="_GridReportes"]')).find(n => n.getClientRects().length);
        if (!g) return [];
        return Array.from(g.querySelectorAll('tr.dx-data-row'))
            .filter(f => f.innerText.indexOf(buscado) !== -1)
            .map(f => Array.from(f.cells).map(c => c.innerText.trim()));
    })(String(texto));
};

/* Herramientas > Parámetros > Cartera: forma de cartera CxC / CxP (0 General, 1 Cuotas, 2 Grupos, 3 Tipo). */
const formasCartera = ['#TxtParametrosGenerales_CarteraFormaCxC', '#TxtParametrosGenerales_CarteraFormaCxP'];

const editarParametrosCartera360 = async t => {
    await abrirHerramientas360(t, 'Parámetros');
    // La pestaña Cartera está dentro de la pestaña Administrativo
    await t
        .click(Selector('#tabs_parametros_Administrativo').filterVisible().with({ timeout: 20000 }).nth(0))
        .click(Selector('#tabs_parametrosAdmin_Cartera').filterVisible().with({ timeout: 20000 }).nth(0))
        .click(Selector('#BtnEditar_btn, #BtnEditar').filterVisible().nth(0))
        .wait(2000);
};

/** Confirma el swal si aparece; el diálogo puede cerrarse solo antes del clic. */
const confirmarSiAparece360 = async (t, espera) => {
    if (await btnConfirmarDialogo.with({ timeout: espera }).exists) {
        try {
            await t.click(btnConfirmarDialogo.with({ timeout: 3000 }));
        } catch (e) {
            if (await btnConfirmarDialogo.exists) throw e;
        }
    }
};

const cerrarPestanaDescartando360 = async t => {
    await cerrarPestana360(t);
    await confirmarSiAparece360(t, 2000);
};

/** Devuelve [índiceCxC, índiceCxP] de la forma de cartera actual (-1 si no se pudo leer). */
export const leerFormaCartera360 = async t => {
    await editarParametrosCartera360(t);
    const indices = [];
    for (const contenedor of formasCartera) {
        const radios = Selector(`${contenedor} .dx-radiobutton`);
        let marcado = -1;
        for (let i = 0; i < await radios.count; i++) {
            if (await radios.nth(i).hasClass('dx-item-selected') || await radios.nth(i).getAttribute('aria-checked') === 'true') {
                marcado = i;
            }
        }
        indices.push(marcado);
    }
    await cerrarPestanaDescartando360(t);
    return indices;
};

/** Guarda la forma de cartera [índiceCxC, índiceCxP] y falla si el ERP muestra un error. */
export const guardarFormaCartera360 = async (t, indices) => {
    await editarParametrosCartera360(t);
    for (let i = 0; i < formasCartera.length; i++) {
        await t.click(Selector(`${formasCartera[i]} .dx-radiobutton`).nth(indices[i]));
    }
    await t.click(Selector('#BtnGuardar_btn, #BtnGuardar').filterVisible().nth(0)).wait(2500);
    const error = Selector('.erp-toast[data-type="error"], .erp-form-error__text').filterVisible();
    if (await error.exists) {
        await t.expect(false).ok(`No se guardó la forma de cartera: ${(await error.nth(0).innerText).replace(/\s+/g, ' ').trim()}`);
    }
    await confirmarSiAparece360(t, 8000);
    await t.wait(1500);
    await cerrarPestanaDescartando360(t);
};

/** Descarga en el documento abierto un solo pedido, buscado por el texto indicado. */
export const descargarUnSoloPedido = async (t, numeroPedido) => {
    // El botón se habilita después de guardar el encabezado; la lista sale en #gridPedidos_documentos (# | Pedido | Fecha)
    const grid = Selector('#gridPedidos_documentos').filterVisible();
    await t
        .click(Selector('#Documento_Descargar_Pedido .dx-icon-spindown'))
        .click(Selector('.dx-overlay-content .dx-list-item').filterVisible().withText('Cargar un solo Pedido'))
        .expect(grid.with({ timeout: 15000 }).exists).ok('No abrió la lista de pedidos para cargar');
    const buscar = grid.find('.dx-datagrid-search-panel .dx-texteditor-input');
    if (await buscar.exists) {
        await t.typeText(buscar, String(numeroPedido), { replace: true }).wait(1500);
    }
    const celda = grid.find('tr.dx-data-row td').withExactText(String(numeroPedido));
    const fila = celda.parent('tr');
    // Clic en la celda no selecciona la fila: se marca su casilla
    await t
        .expect(celda.with({ timeout: 10000 }).exists).ok(`El pedido ${numeroPedido} no aparece en la lista de pedidos`)
        .click(fila.find('.dx-select-checkbox'))
        .expect(fila.getAttribute('aria-selected')).eql('true', `No quedó seleccionado el pedido ${numeroPedido}`)
        .click(Selector('#btnCargarPedidos_documentos_btn').filterVisible())
        .expect(grid.exists).notOk('No se cerró la lista de pedidos después de cargar', { timeout: 15000 })
        .wait(3000);
};
