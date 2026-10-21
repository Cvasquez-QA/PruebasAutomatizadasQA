import { ClientFunction, Selector } from 'testcafe';

/**
 * Helpers para mi.hgi360.com (ERP web en React).
 * Usan los selectores de esa versión: data-testid en los grids, aria-label
 * en las acciones de fila, placeholders en el login y el menú lateral
 * #ErpSidebarModulos. No entran a iframes de pestaña.
 */

const selectorGrid = gridId => {
    const id = String(gridId).replace(/^#/, '');
    return Selector(`[data-testid="${id}"]`).filterVisible();
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
        .typeText(campo, String(texto), { replace: true });
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
    if (await filaGrid360(gridId, texto).with({ timeout: 4000 }).exists) {
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

const abrirMenu360 = async (t, modulo, opcion) => {
    await t
        .click(Selector('#ErpSidebarModulos span').withText(modulo))
        .click(Selector('#ErpMenuCardGrid span').withText(opcion))
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
    await t
        .switchToMainWindow()
        .click(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger'))
        .click(Selector('#divpanelmaster span').withText('Cerrar sesión'));
};

export const ingresarAplicacion = async (t, config) => {
    await t.switchToMainWindow();
    await t.maximizeWindow();
    await t.wait(2000);
    const empresa = Selector('input.dx-texteditor-input[placeholder="Identificación Empresa"]');
    const usuario = Selector('input.dx-texteditor-input[placeholder="Usuario"]');
    const clave = Selector('input.dx-texteditor-input[placeholder="Contraseña"]');
    const btnIngresar = Selector('#buttonAutenticar');

    await t
        .expect(empresa.with({ timeout: 15000 }).exists).ok('No apareció el campo Empresa en el login')
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
