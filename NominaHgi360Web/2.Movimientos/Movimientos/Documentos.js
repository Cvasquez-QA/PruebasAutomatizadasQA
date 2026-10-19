import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    parseValorNumerico,
    limpiarCacheChromeTestCafe,
    TX_DOCUMENTO,
    TX_DOCUMENTO_TEXTO,
    TERCERO,
    TERCERO_TEXTO,
    PRODUCTO
} from '../../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const DEPENDENCIA = '0';
const TOTAL_DOCUMENTO = '#txtDocumento_Total .dx-texteditor-input';
const NUMERO_DOCUMENTO = Selector('#txtDocumento .dx-texteditor-input');
const accionesDetalle = Selector('.erp-grid-action-glyph').filterVisible();
const btnConfirmarEliminar = Selector('button.swal2-confirm').filterVisible();

// Al confirmar el producto, la app lo carga (~0,7 s), reinicia cantidad/valor unitario
// y pasa el foco al campo Remesa. Hay que esperar eso antes de escribir cantidad y valor.
const campoRemesa = Selector('#txtDocumento_Detalle_Producto_Remesa_1');
// El total se recalcula varios segundos después de grabar o eliminar una línea (2 a 5 s).
const ESPERA_TOTAL = 15000;

/** Espera hasta que el total del documento cumpla la condición (o falla con el mensaje). */
async function esperarTotal(t, cumple, mensaje) {
    const inicio = Date.now();
    let total = await parseValorNumerico(TOTAL_DOCUMENTO);
    while (!cumple(total) && Date.now() - inicio < ESPERA_TOTAL) {
        await t.wait(500);
        total = await parseValorNumerico(TOTAL_DOCUMENTO);
    }
    await t.expect(cumple(total)).ok(`${mensaje} (total actual: ${total})`);
    return total;
}

async function nuevoDocumento(t) {
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 })
        .click('#BtnNuevoDocumento .dx-button-content')
        .expect(Selector('#Documento_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se abrió el formulario de nuevo documento')
        .click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, TX_DOCUMENTO);
    await seleccionarOpcion(t, TX_DOCUMENTO_TEXTO);
}

async function guardarDocumento(t) {
    await t
        .click(Selector('#BtnGuardarDocumento_btn span').withText('Guardar'))
        .wait(3000);
}

/** Guarda el encabezado y valida que quede con número; si el primer clic no guarda, reintenta una vez. */
async function guardarEncabezado(t) {
    await guardarDocumento(t);
    if (!await NUMERO_DOCUMENTO.value) {
        await guardarDocumento(t);
    }
    await t.expect(NUMERO_DOCUMENTO.value).ok('El documento no quedó guardado (sin número)');
}

async function guardarDetalle(t) {
    await t
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save')
        .wait(1000);
}

async function escribirCampoDetalle(t, selector, valor) {
    await t
        .click(selector)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(selector, valor);
}

async function escribirProducto(t, producto) {
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', producto, { replace: true })
        .pressKey('enter')
        .expect(campoRemesa.focused).ok(`No terminó de cargar el producto ${producto}`, { timeout: 10000 })
        .wait(500);
}

async function editarCantidadPrimerDetalle(t, cantidad) {
    await t
        .click(accionesDetalle.nth(0))
        // La línea tarda ~0,7 s en subir a la fila de captura
        .expect(Selector('#txtDocumento_Detalle_Producto_cursor_1').value)
        .eql(PRODUCTO, 'La línea no cargó para editarla', { timeout: 10000 })
        .wait(500);
    await escribirCampoDetalle(t, '#txtDocumento_Detalle_Cantidad_cursor_1', cantidad);
    await guardarDetalle(t);
}

async function eliminarPrimerDetalle(t) {
    await t
        .click(accionesDetalle.nth(1))
        .click(btnConfirmarEliminar);
}

async function ejecutarPruebaDocumentos(t, config) {
    await ingresarAplicacion(t, config);

    // Encabezado: transacción 01FE con dependencia 0
    await nuevoDocumento(t);
    await t.typeText('#Documento_Dependencia .dx-texteditor-input', DEPENDENCIA, { replace: true });
    await guardarEncabezado(t);

    // Detalle: producto 010203, cantidad 1, valor unitario 100
    await escribirProducto(t, PRODUCTO);
    await escribirCampoDetalle(t, '#txtDocumento_Detalle_Cantidad_cursor_1', '1');
    await escribirCampoDetalle(t, '#txtDocumento_Detalle_ValorUnitario_cursor_1', '100');
    await guardarDetalle(t);
    const totalInicial = await esperarTotal(t, total => total >= 100, 'El total del documento debería ser al menos 100');

    // Editar el detalle: cantidad 2
    await editarCantidadPrimerDetalle(t, '2');
    await esperarTotal(t, total => total >= 200 && total > totalInicial, 'El total del documento debería ser al menos 200');

    // Eliminar el detalle: el total vuelve a 0
    await eliminarPrimerDetalle(t);
    await esperarTotal(t, total => total === 0, 'El total del documento debería ser 0');

    // Cambiar el tercero y guardar
    await t.click('#Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, TERCERO);
    // Por el código: el nombre trae doble espacio y según el combo se ve con uno o con dos
    await seleccionarOpcion(t, new RegExp(`^\\s*${TERCERO} -`));
    await guardarDocumento(t);

    // Recargar el documento y validar el tercero
    await t
        .click('#txtDocumento .dx-texteditor-input')
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('#Documento_Tercero').withText(TERCERO).visible)
        .ok(`El documento no quedó con el tercero ${TERCERO_TEXTO}`);

    // Eliminar el documento
    await t
        .click(Selector('#BtnEliminarDocumento_btn span').withText('Eliminar'))
        .click(btnConfirmarEliminar)
        .wait(2000);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}
/*
async function ejecutarPruebaUltimoDocumento(t, config) {
    await ingresarAplicacion(t, config);

    await nuevoDocumento(t);
    await t

    await t
        .click('#lbl_documento_ultimo_documento')
        .pressKey('enter')
        .wait(2000);

    await editarCantidadPrimerDetalle(t, '2');
    await t.expect(Selector(TOTAL_DOCUMENTO).visible).ok('No se ve el total del documento');
    await eliminarPrimerDetalle(t);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}
*/
fixture `Prueba Documentos - Test Hgi360`
    .page(testNominaConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Último Documento - Test Hgi360', async t => {
    await ejecutarPruebaDocumentos(t, testNominaConfig);
});
