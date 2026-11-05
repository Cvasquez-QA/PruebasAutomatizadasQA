import { ClientFunction, Selector } from 'testcafe';

export const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
export const filtrarPorInput = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input');
export const filtrarPorInputModal = Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('.dx-texteditor-input');
export const campoDocumento = Selector('#txtDocumento .dx-texteditor-input');
export const TX_DOCUMENTO = '01fe';
export const TX_DOCUMENTO_TEXTO = '01FE - PRUEBA FACTURA DE VENTA ELECTRÓNICA QA';
export const TERCERO = '1000099598';
export const TERCERO_TEXTO = '1000099598 - Vasquez Suarez Camilo';
export const PRODUCTO = '010203';


export const filtrarPor = async (t, texto) => {
    await t.typeText(filtrarPorInput, texto);
};
export const filtrarPorEnModal = async (t, texto) => {
    await t.typeText(filtrarPorInputModal, texto);
};


/** Elimina el registro visible del grid (botón delete + Aceptar). gridId ej: '#gridClases' o 'gridClases' */
export const eliminarRegistroDesdeGrid = async (t, gridId) => {
    const grid = gridId.startsWith('#') ? gridId : `#${gridId}`;
    const btnEliminar = Selector(`${grid} [class^="dx-button-mode-contained dx-link dx-link-delete dx"]`);
    const btnEliminarGestion = Selector('[class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]');

    if (await btnEliminar.visible) {
        await t
            .click(btnEliminar)
            .click(Selector('button').withText('Aceptar'));
    } else {
        await t
            .click(btnEliminarGestion)
            .click(Selector('button').withText('Aceptar'));
    }
};

/** Filtra el grid y elimina el registro si ya existe. gridId ej: 'gridCalendario' o '#gridCalendario' */
export const eliminarRegistroSiExiste = async (t, gridId, codigo, filtroNth = 0) => {
    const grid = gridId.startsWith('#') ? gridId : `#${gridId}`;

    await t
        .click(Selector(`${grid} .dx-texteditor-input`).nth(filtroNth))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector(`${grid} .dx-texteditor-input`).nth(filtroNth), codigo)
        .wait(2000);

    if (await Selector(`${grid} td`).withText(codigo).visible) {
        await eliminarRegistroDesdeGrid(t, grid);
        await t.wait(2000);
    }
};

/** Selector de opción en lookup/dropdown visible */
export const selectorOpcion = texto => Selector('.dx-overlay-content')
    .filterVisible()
    .find('.dx-item-content')
    .withText(texto);

/** Click en la opción del lookup/dropdown visible */
export const seleccionarOpcion = async (t, texto) => {
    await t.click(selectorOpcion(texto));
};

/** Textos de las opciones del lookup/dropdown abierto (para mensajes de error). */
const opcionesVisibles = ClientFunction(() => Array.prototype.slice.call(document.querySelectorAll('.dx-overlay-content .dx-item-content'))
    .filter(e => e.getClientRects().length)
    .map(e => (e.textContent || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 30));

/**
 * Elige la caja en el modal "Seleccionar caja" del Punto de Venta de Happgi (ya abierto con el lookup desplegado o no).
 * Reemplaza el antiguo Selector(...).withText(caja).nth(8), que dependía de la posición en el DOM.
 * Si la caja no está en la lista, falla diciendo cuáles cajas hay.
 */
export const seleccionarCajaHappgi = async (t, caja) => {
    const lista = Selector('.dx-overlay-content').filterVisible().find('.dx-item-content');
    if (!await lista.with({ timeout: 3000 }).exists) {
        await t.click('#modalPuntoDeVenta_Caja .dx-lookup-field');
    }
    const opcion = selectorOpcion(caja);
    if (!await opcion.with({ timeout: 10000 }).exists) {
        await t.expect(false).ok(`No existe la caja "${caja}" en la lista de cajas. Cajas: ${(await opcionesVisibles()).join(' | ')}`);
    }
    await t.click(opcion.nth(0));
};

export const marcarRadioSiNoEsta = async (t, contenedor, indice = 0) => {
    const radio = Selector(contenedor).find('.dx-radiobutton').nth(indice);
    const marcado = await radio.getAttribute('aria-checked');

    if (marcado !== 'true') {
        await t.click(radio.find('.dx-radiobutton-icon'));
    }
};

export const marcarCheckboxSiNoEsta = async (t, selectorCheckbox) => {
    const checkbox = Selector(selectorCheckbox);
    const marcado = await checkbox.getAttribute('aria-checked');

    if (marcado !== 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

export const desmarcarCheckboxSiEsta = async (t, selectorCheckbox) => {
    const checkbox = Selector(selectorCheckbox);
    const marcado = await checkbox.getAttribute('aria-checked');

    if (marcado === 'true') {
        await t.click(`${selectorCheckbox} .dx-checkbox-icon`);
    }
};

/* ----------------------------------------------------------------------------
 * Menú principal de Happgi (versión clásica). Revisado el 03-nov-2026 en test.happgi.com:
 *  - Cada módulo es un <a class="navbar-nav-link dropdown-toggle"> dentro de #MenuPrincipal > li.
 *  - Las opciones son <a class="dropdown-item" id="link_N"> con un <span> de texto, agrupadas en niveles;
 *    muchas quedan ocultas hasta pasar por su grupo. El mismo texto se repite en otros módulos
 *    (p. ej. "Cartera" en Procesos y en Reportes), por eso se busca dentro del módulo abierto.
 *  - Antes se hacía clic en la primera coincidencia de todo el documento, que solía estar oculta.
 * --------------------------------------------------------------------------*/
const normalizarMenu = texto => String(texto).replace(/\s+/g, ' ').trim().toLowerCase();

/** <a> del módulo en el menú principal; acepta singular/plural (p. ej. "Movimiento" / "Movimientos"). */
const moduloMenuHappgi = async (t, modulo) => {
    const toggles = Selector('#MenuPrincipal a.dropdown-toggle, #MenuPrincipal a.navbar-nav-link');
    await t.expect(toggles.with({ timeout: 30000 }).exists).ok('No cargó el menú principal');
    const variantes = [modulo, modulo.endsWith('s') ? modulo.slice(0, -1) : `${modulo}s`];
    for (const v of variantes) {
        const exacto = toggles.filter(n => n.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === buscado, { buscado: normalizarMenu(v) });
        if (await exacto.exists) {
            return exacto.nth(0);
        }
    }
    await t.expect(false).ok(`No existe el módulo "${modulo}" en el menú principal`);
    return null;
};

const clicOculto = ClientFunction(id => {
    const e = document.getElementById(id);
    if (e) e.click();
    return !!e;
});

/** Abre el módulo y la opción del menú y entra al iframe de la pestaña que se abre. */
export const abrirMenuHappgi = async (t, modulo, opcion, espera = 1500) => {
    await t.switchToMainWindow();
    const toggle = await moduloMenuHappgi(t, modulo);
    await t.click(toggle).wait(800);
    const li = toggle.parent('li');
    const enlaces = li.find('a.dropdown-item');
    const buscada = normalizarMenu(opcion);
    let destino = enlaces.filter(n => n.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === buscada, { buscada });
    if (!await destino.exists) {
        destino = enlaces.filter(n => n.textContent.replace(/\s+/g, ' ').trim().toLowerCase().indexOf(buscada) !== -1, { buscada });
    }
    await t.expect(destino.with({ timeout: 10000 }).exists).ok(`No se encontró "${opcion}" en el menú ${modulo}`);
    const pestana = Selector('iframe').withAttribute('id', /^iframe_tab_/);
    const pestanasAntes = await pestana.count;
    const visible = destino.filterVisible();
    if (await visible.with({ timeout: 2000 }).exists) {
        await t.click(visible.nth(0));
    } else {
        // Opción dentro de un nivel recogido: se activa su enlace directamente (ejecuta el mismo onclick)
        const id = await destino.nth(0).getAttribute('id');
        await t.expect(id).ok(`La opción "${opcion}" del menú ${modulo} está oculta y no tiene id`);
        await clicOculto(id);
    }
    // Las opciones de Procesos no abren pestaña (abren un aviso de confirmación en la ventana principal):
    // solo se entra al iframe si se abrió una pestaña nueva.
    for (const inicio = Date.now(); Date.now() - inicio < 15000 && await pestana.count <= pestanasAntes;) {
        await t.wait(500);
    }
    await t.wait(espera);
    if (await pestana.count <= pestanasAntes) {
        return;
    }
    // La pestaña activa es la visible; si hay varias abiertas se toma la última
    const activa = await pestana.filterVisible().exists ? pestana.filterVisible().nth(-1) : pestana.nth(-1);
    await t
        .switchToIframe(activa)
        .wait(1500);
};

export const abrirMaestros = async (t, nombreMaestro) => abrirMenuHappgi(t, 'Maestros', nombreMaestro);

export const abrirHerramientas = async (t, nombreHerramienta) => abrirMenuHappgi(t, 'Herramientas', nombreHerramienta);

export const abrirMovimiento = async (t, nombreMovimiento) => abrirMenuHappgi(t, 'Movimientos', nombreMovimiento);

/** Menú Movimiento (singular) usado en PosHgi360; en test.happgi.com POS el módulo se llama "Movimientos". */
export const abrirMovimientoPos = async (t, nombreMovimiento) => abrirMenuHappgi(t, 'Movimiento', nombreMovimiento, 10000);

export const abrirUtilitarios = async (t, nombreUtilitario) => abrirMenuHappgi(t, 'Utilitarios', nombreUtilitario, 10000);

export const abrirProcesos = async (t, nombreProceso) => abrirMenuHappgi(t, 'Procesos', nombreProceso);

export const abrirReportes = async (t, nombreReporte) => abrirMenuHappgi(t, 'Reportes', nombreReporte);

export const abrirNominaE = async (t, nombreOpcion) => abrirMenuHappgi(t, 'NominaE', nombreOpcion);

export const abrirTransaccion = async (t, texto) => {
    await t.click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, texto);
    await seleccionarOpcion(t, texto);
};


export const buscarConsecutivoDoc = async (t, numero) => {
    await t
        .click(campoDocumento)
        .typeText(campoDocumento, numero)
        .pressKey('enter')
        .expect(campoDocumento.value).contains(numero, 'No se ingresó el número del documento');
};

export const esperarValorVisible = async (t, valor,) => {
    await t.expect(Selector('td').withText(valor).visible).ok('No se encontro el valor esperado');
};

export const ingresarDetalle = async (t, producto, cantidad) => {
    await t
        .typeText(`#txtDocumento_Detalle_Producto_cursor_1`, producto)
        .click(`#txtDocumento_Detalle_Cantidad_cursor_1`)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(`#txtDocumento_Detalle_Cantidad_cursor_1`, cantidad)
        .click(`#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check`);
};

/** Convierte montos tipo "$ 1.234,0000" o "1.234,56" a entero sin decimales ni símbolo de moneda */
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

export const cerrarPestana = async t => {
    await t
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close');
};

export const eliminarDocumento = async t => {
    await t
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        //.click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(3000);
};

export const ingresarAplicacion = async (t, config) => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', config.empresa)
        .wait(2000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(2000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .wait(2000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
};

export const ingresarAplicacionMiHappgi = async (t, config) => {
    await t
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', config.empresa)
        .wait(2000)
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', config.empresa)
        .wait(2000)
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(2000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .wait(2000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
};

export const cerrarSesion = async t => {
    await t
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'));
};

export const descargarUnSoloPedido = async (t, texto) => {
    await t
        .click(Selector('#Documento_Descargar_Pedido .dx-icon.dx-icon-spindown.dx-icon-right'))
        .click(Selector('.opcion-descarga-pedido span').withText('Cargar un solo Pedido'));
    await filtrarPor(t, texto);
    await t
        .pressKey('enter')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-checkbox-icon').nth(1))
        .click(Selector('#btnCargarPedidos_documentos span').withText('Cargar'))
        .wait(6000);
};



export const crearDocumento = async (t) => {
    await abrirMovimiento(t, 'DOCUMENTOS');
    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t.click('#Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, TERCERO);
    await t.wait(2000);
    await seleccionarOpcion(t, TERCERO_TEXTO);
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000);

    const valorDocumento = await parseValorNumerico('#txtDocumento_Total .dx-texteditor-input');

    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(7000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;

    await cerrarPestana(t);

    return { valorDocumento, numeroDocumento };
};


export const crearPagoEnDolares = async (t, numeroDocumento, valorDocumento) => {
    await abrirTransaccion(t, 'PAGOS');

    await t
        .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
        .wait(2000)
        .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(TX_PAGO_DOLAR))
        .click('#TxtDocumentosPago_Tercero .dx-lookup-field')
;
        
        await filtrarPor(t, TERCERO);
        await t
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item').withText(TERCERO_TEXTO))
        .click('#TxtDocumentosPago_Moneda .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item').withText(MONEDA))
        .click('#BtnGrabarDocumentosPago .dx-icon.dx-icon-save')
        .wait(3000)
        .click(Selector('#gridCartera [role="columnheader"]').withText('Fecha'))
        .click(Selector('#gridCartera [role="columnheader"]').withText('Fecha'));

    const filaDocumento = Selector('#gridCartera tr').withText(numeroDocumento);

    await t
        .expect(filaDocumento.visible).ok(`No se encontró el documento ${numeroDocumento}`)
        .click(filaDocumento.find('[class^="dx-button-mode-contained dx-link dx-link-download"], a, i, button').nth(0))
        .wait(2000)
        .expect(Selector('#txtdocumento_documento_pago_cursor_1').value).eql(numeroDocumento)
        .typeText('#txtDocPago_Banco_FormaPago_cursor_1', '01')
        .pressKey('enter')
        .typeText('#txtDocPago_Banco_Banco_cursor_1', '01')
        .pressKey('enter')
        .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', numeroDocumento)
        .pressKey('enter')
        .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', '1')
        .pressKey('enter')
        .typeText('#txtdocumento_banco_pago_Valor_cursor_1', String(valorDocumento))
        .pressKey('enter')
        .pressKey('enter')
        .wait(2000);

    const diferencia = await parseValorNumerico('#TxtDocumentosPago_Diferencia .dx-texteditor-input');

    await t.expect(diferencia).eql(0, 'La diferencia del pago debe ser 0');

    const numeroPago = await Selector('#TxtDocumentosPago_Documento_Cursor').value;

    await t
        .click(Selector('#BtnGrabarDocumentosPago div').withText('Guardar'))
        .wait(2000)
        .click(Selector('#BtnCerrarDocumentosPago span').withText('Atras'))
        .wait(2000);

    return numeroPago;
};