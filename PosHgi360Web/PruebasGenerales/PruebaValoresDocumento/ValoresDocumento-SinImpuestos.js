import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    nuevoDocumento360,
    guardarDocumento360,
    agregarLineaDocumento,
    leerDetalleDocumento,
    leerTotalesDocumento,
    esperarTotalDocumento,
    cargarDocumento360,
    eliminarDocumentoActual360
} from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Valores del documento con impuestos no incluidos (test.hgi360.com, AutPos), transacción 25:
// después de grabar las líneas y recargar el documento se valida que
//   Subtotal = suma de "Valor total" de las líneas, Iva = suma del IVA de las líneas y
//   Total = Subtotal + Iva + Imp. consumo. Al final se borra el documento.
// En la versión React el detalle (grid gridDocumentosConsulta) muestra IVA por línea; el impuesto al
// consumo solo se ve en el total (#txtDocumento_ImpCon).
const TX_DOCUMENTO = '25';
const TX_DOCUMENTO_TEXTO = '25 - VALIDACION CAMPOS';
const TOLERANCIA = 1; // redondeo de decimales

async function validarValores(t) {
    await esperarTotalDocumento(t, total => total > 0, 'El total del documento quedó en 0');
    const lineas = await leerDetalleDocumento();
    const totales = await leerTotalesDocumento();
    const sumaValor = lineas.reduce((s, l) => s + (l.num['valor total'] || 0), 0);
    const sumaIva = lineas.reduce((s, l) => s + (l.num.iva || 0), 0);
    const detalle = JSON.stringify({ totales, sumaValor, sumaIva });

    await t
        .expect(Math.abs(totales.subtotal - sumaValor)).lte(TOLERANCIA, `El subtotal no es la suma del valor total de las líneas ${detalle}`)
        .expect(Math.abs(totales.iva - sumaIva)).lte(TOLERANCIA, `El IVA no es la suma del IVA de las líneas ${detalle}`)
        .expect(Math.abs(totales.total - (totales.subtotal + totales.iva + totales.impcon)))
        .lte(TOLERANCIA, `El total no es Subtotal + Iva + Imp. consumo ${detalle}`);
}

async function ejecutarPrueba(t, config, productos) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, TX_DOCUMENTO, TX_DOCUMENTO_TEXTO);
    const numero = await guardarDocumento360(t);
    for (const producto of productos) {
        await agregarLineaDocumento(t, producto);
    }
    await guardarDocumento360(t);

    // Recargar el documento y validar los valores guardados
    await cerrarPestana360(t);
    await nuevoDocumento360(t, TX_DOCUMENTO, TX_DOCUMENTO_TEXTO);
    await cargarDocumento360(t, numero);
    await validarValores(t);

    await eliminarDocumentoActual360(t);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Valores Documentos - Impuestos no incluídos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Valores Documento 1 detalle - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig, ['01']);
});

test('Prueba Valores Documento varios detalles - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig, ['01', '03', '05']);
});
