import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    nuevoDocumento360,
    elegirTerceroDocumento,
    escribirDependenciaDocumento,
    guardarDocumento360,
    agregarLineaDocumento,
    editarCantidadLineaDocumento,
    leerDetalleDocumento,
    leerTotalesDocumento,
    esperarLineasDocumento,
    esperarTotalDocumento,
    cargarDocumento360,
    eliminarDocumentoActual360,
    enviarDocumentoDian360
} from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Documentos (test.hgi360.com, AutPos).
// CRUD: transacción 25 con 4 líneas, edición de cantidades, recarga y eliminación del documento.
// ENVIO: transacción 0101Doc al tercero HGI S.A.S, envío a la DIAN y validación de que queda el XML
// (este documento queda creado: una factura enviada a la DIAN no se puede borrar).
const TX_DOCUMENTO = '25';
const TX_DOCUMENTO_TEXTO = '25 - VALIDACION CAMPOS';
const DEPENDENCIA = '0';
const LINEAS = [
    { producto: '01', cantidad: '1', valor: '1000' },
    { producto: '02', cantidad: '2', valor: '2000' },
    { producto: '03', cantidad: '3', valor: '3000' },
    { producto: '04', cantidad: '4', valor: '4000' }
];
const CANTIDAD_EDIT_1 = '2';
const CANTIDAD_EDIT_2 = '3';

const TX_DOCUMENTO_ENVIO = '0101Doc';
const TX_DOCUMENTO_ENVIO_TEXTO = '0101Doc - PRUEBA FACTURA DE VENTA';
const TERCERO_ENVIO = '811021438';
const PRODUCTO = '010203';

const subtotalEsperado = lineas => lineas.reduce((suma, l) => suma + Number(l.cantidad) * Number(l.valor), 0);

async function validarTotales(t, subtotal) {
    await esperarTotalDocumento(t, total => total >= subtotal, `El total debería ser al menos ${subtotal}`);
    const totales = await leerTotalesDocumento();
    await t
        .expect(totales.subtotal).eql(subtotal, 'El subtotal no corresponde a cantidad x valor unitario')
        .expect(totales.total).eql(totales.subtotal + totales.iva + totales.impcon,
            `El total no es Subtotal + Iva + ImpCon (${JSON.stringify(totales)})`);
}

async function ejecutarPruebaCrud(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, TX_DOCUMENTO, TX_DOCUMENTO_TEXTO);
    await escribirDependenciaDocumento(t, DEPENDENCIA);
    const numero = await guardarDocumento360(t);

    for (const linea of LINEAS) {
        await agregarLineaDocumento(t, linea.producto, { cantidad: linea.cantidad, valor: linea.valor });
    }
    await validarTotales(t, subtotalEsperado(LINEAS));

    // Editar cantidades de las dos primeras líneas
    await editarCantidadLineaDocumento(t, 0, CANTIDAD_EDIT_1);
    await editarCantidadLineaDocumento(t, 1, CANTIDAD_EDIT_2);
    const editadas = LINEAS.map((l, i) => ({ ...l, cantidad: i === 0 ? CANTIDAD_EDIT_1 : i === 1 ? CANTIDAD_EDIT_2 : l.cantidad }));
    await validarTotales(t, subtotalEsperado(editadas));
    await guardarDocumento360(t);

    // Recargar el documento y validar que quedó con las 4 líneas y las cantidades editadas
    await cerrarPestana360(t);
    await nuevoDocumento360(t, TX_DOCUMENTO, TX_DOCUMENTO_TEXTO);
    await cargarDocumento360(t, numero);
    const lineas = await esperarLineasDocumento(t, LINEAS.length, 'El documento recargado no tiene las 4 líneas');
    await t
        .expect(lineas[0].num.cantidad).eql(Number(CANTIDAD_EDIT_1), 'No quedó la cantidad editada de la línea 1')
        .expect(lineas[1].num.cantidad).eql(Number(CANTIDAD_EDIT_2), 'No quedó la cantidad editada de la línea 2');

    // Eliminar el documento
    await eliminarDocumentoActual360(t);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

async function ejecutarPruebaEnvio(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, TX_DOCUMENTO_ENVIO, TX_DOCUMENTO_ENVIO_TEXTO);
    await elegirTerceroDocumento(t, TERCERO_ENVIO);
    await escribirDependenciaDocumento(t, DEPENDENCIA);
    const numero = await guardarDocumento360(t);

    await agregarLineaDocumento(t, PRODUCTO, { cantidad: '1', valor: '1000' });
    await esperarTotalDocumento(t, total => total > 0, 'El total del documento quedó en 0');
    await guardarDocumento360(t);

    const mensaje = await enviarDocumentoDian360(t);
    await t.expect(/error|no se pudo|rechaz/i.test(mensaje)).notOk(`No se pudo enviar el documento: ${mensaje}`);

    // Recargar el documento y validar que ya tiene el XML de la DIAN
    await cerrarPestana360(t);
    await nuevoDocumento360(t, TX_DOCUMENTO_ENVIO, TX_DOCUMENTO_ENVIO_TEXTO);
    await cargarDocumento360(t, numero);
    await t
        .click('#BtnDian')
        .expect(Selector('.dx-overlay-content .dx-list-item').filterVisible().withText('XML').with({ timeout: 10000 }).exists)
        .ok('El documento no quedó enviado a la DIAN (sin opción XML)')
        .pressKey('esc');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Documentos testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Documentos testerp - Test Hgi360', async t => {
    await ejecutarPruebaCrud(t, testPosWebConfig);
});

test('Prueba ENVIO Documentos testerp - Test Hgi360', async t => {
    await ejecutarPruebaEnvio(t, testPosWebConfig);
});
