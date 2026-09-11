import { Selector } from 'testcafe';

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

export const abrirMaestros = async (t, nombreMaestro) => {
    await t
        .click(Selector('a').withText('Maestros'))
        .click(Selector('span').withText(nombreMaestro))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

export const abrirHerramientas = async (t, nombreHerramienta) => {
    await t
        .click(Selector('a').withText('Herramientas'))
        .click(Selector('span').withText(nombreHerramienta))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

export const abrirMovimiento = async (t, nombreMovimiento) => {
        await t
            .click(Selector('a').withText('Movimientos'))
            .click(Selector('a').withText(nombreMovimiento))
            .wait(1500)
            .switchToIframe(iframeTab)
            .wait(1500);
    };

/** Menú Movimiento (singular) usado en PosHgi360 */
export const abrirMovimientoPos = async (t, nombreMovimiento) => {
    await t.click(Selector('a').withText('Movimiento'));

    const opcionEnlace = Selector('a').withText(nombreMovimiento);
    const opcionSpan = Selector('span').withText(nombreMovimiento);
    await t.click((await opcionEnlace.exists) ? opcionEnlace : opcionSpan);

    await t
        .wait(10000)
        .switchToIframe(iframeTab)
        .wait(1500);
};

export const abrirUtilitarios = async (t, nombreUtilitario) => {
    await t.click(Selector('a').withText('Utilitarios'));

    const opcionEnlace = Selector('a').withText(nombreUtilitario);
    const opcionSpan = Selector('span').withText(nombreUtilitario);
    await t.click((await opcionEnlace.exists) ? opcionEnlace : opcionSpan);

    await t
        .wait(10000)
        .switchToIframe(iframeTab)
        .wait(1500);
};

export const abrirProcesos = async (t, nombreProceso) => {
    await t
        .click(Selector('a').withText('Procesos'))
        .click(Selector('span').withText(nombreProceso))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

export const abrirReportes = async (t, nombreReporte) => {
    await t
        .click(Selector('a').withText('Reportes'))
        .click(Selector('span').withText(nombreReporte))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

export const abrirNominaE = async (t, nombreOpcion) => {
    await t
        .click(Selector('a').withText('NominaE'))
        .click(Selector('span').withText(nombreOpcion))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

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