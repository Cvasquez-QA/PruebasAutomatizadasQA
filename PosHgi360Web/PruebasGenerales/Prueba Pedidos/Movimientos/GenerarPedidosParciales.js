import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360
} from '../../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../../Funciones/HelpersMaestros360.js';
import {
    nuevoDocumento360,
    elegirTerceroDocumento,
    guardarDocumento360,
    agregarLineaDocumento,
    editarCantidadLineaDocumento,
    esperarLineasDocumento,
    cargarPedidoEnDocumento360,
    eliminarDocumentoActual360,
    eliminarDocumentoSiExiste360
} from '../../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

// Pedidos parciales (test.hgi360.com, AutPos):
// 1) pedido 07 al Consumidor Final: productos 01..05 con cantidades 10, 20, 30, 40, 50
// 2) primera factura 01Pedido: descarga el pedido y factura 1, 2, 3, 4, 5
// 3) segunda factura: al descargar el pedido trae lo pendiente 9, 18, 27, 36, 45
// 4) se borran las facturas y el pedido
// Transacciones: ver GenerarPedidos.js ("12 - PEDIDOS" no existe en la versión React para AutPos).
const TX_PEDIDO = { filtro: '07', texto: '07 - PEDIDOS' };
const TX_FACTURA = { filtro: '01Pedido', texto: '01Pedido - 01 FACTURA DE VENTA ELECTRÓNICA' };
const TERCERO = '222222222222';
const LINEAS = [
    { producto: '01', pedido: 10, factura: 1 },
    { producto: '02', pedido: 20, factura: 2 },
    { producto: '03', pedido: 30, factura: 3 },
    { producto: '04', pedido: 40, factura: 4 },
    { producto: '05', pedido: 50, factura: 5 }
];

async function nuevaFacturaConPedido(t, numeroPedido) {
    await nuevoDocumento360(t, TX_FACTURA.filtro, TX_FACTURA.texto);
    await elegirTerceroDocumento(t, TERCERO);
    const numero = await guardarDocumento360(t);
    await cargarPedidoEnDocumento360(t, numeroPedido);
    const lineas = await esperarLineasDocumento(t, LINEAS.length, 'La factura no descargó las 5 líneas del pedido');
    return { numero, lineas };
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    // Pedido
    await nuevoDocumento360(t, TX_PEDIDO.filtro, TX_PEDIDO.texto);
    await elegirTerceroDocumento(t, TERCERO);
    const numeroPedido = await guardarDocumento360(t);
    for (const linea of LINEAS) {
        await agregarLineaDocumento(t, linea.producto, { cantidad: String(linea.pedido) });
    }
    await guardarDocumento360(t);
    await cerrarPestana360(t);

    // Primera factura: parcial
    const primera = await nuevaFacturaConPedido(t, numeroPedido);
    await t.expect(primera.lineas.map(l => l.num.cantidad)).eql(LINEAS.map(l => l.pedido), 'La primera factura no trajo las cantidades del pedido');
    for (let i = 0; i < LINEAS.length; i++) {
        await editarCantidadLineaDocumento(t, i, String(LINEAS[i].factura));
    }
    await guardarDocumento360(t);
    await cerrarPestana360(t);

    // Segunda factura: debe traer lo pendiente
    const segunda = await nuevaFacturaConPedido(t, numeroPedido);
    await t.expect(segunda.lineas.map(l => l.num.cantidad)).eql(LINEAS.map(l => l.pedido - l.factura),
        'La segunda factura no trajo las cantidades pendientes del pedido');

    // Limpieza: segunda factura (abierta), primera factura y pedido
    await eliminarDocumentoActual360(t);
    await eliminarDocumentoSiExiste360(t, TX_FACTURA.filtro, TX_FACTURA.texto, primera.numero);
    await eliminarDocumentoSiExiste360(t, TX_PEDIDO.filtro, TX_PEDIDO.texto, numeroPedido);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Pedidos Parciales Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Pedidos Parciales - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
