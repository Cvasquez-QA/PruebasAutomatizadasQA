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

// Pedidos (test.hgi360.com, AutPos):
// 1) pedido 07 al Consumidor Final con los productos 01..05; se editan las cantidades de 3 líneas
// 2) factura 01Pedido que descarga el pedido (Descargar pedido > Cargar un solo Pedido) y debe traer
//    las mismas líneas y cantidades
// 3) se borran la factura y el pedido
// En la versión React no existe la transacción "12 - PEDIDOS" para AutPos; se usa "07 - PEDIDOS" y la
// factura "01Pedido", que es la que lista los pedidos del tercero (revisado el 19-oct-2026).
const TX_PEDIDO = { filtro: '07', texto: '07 - PEDIDOS' };
const TX_FACTURA = { filtro: '01Pedido', texto: '01Pedido - 01 FACTURA DE VENTA ELECTRÓNICA' };
const TERCERO = '222222222222';
const LINEAS = [
    { producto: '01', cantidad: '10' },
    { producto: '02', cantidad: '1' },
    { producto: '03', cantidad: '3' },
    { producto: '04', cantidad: '40' },
    { producto: '05', cantidad: '5' }
];
const EDICIONES = [{ indice: 1, cantidad: '20' }, { indice: 2, cantidad: '30' }, { indice: 4, cantidad: '50' }];

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    // Pedido
    await nuevoDocumento360(t, TX_PEDIDO.filtro, TX_PEDIDO.texto);
    await elegirTerceroDocumento(t, TERCERO);
    const numeroPedido = await guardarDocumento360(t);
    for (const linea of LINEAS) {
        await agregarLineaDocumento(t, linea.producto, { cantidad: linea.cantidad });
    }
    for (const edicion of EDICIONES) {
        await editarCantidadLineaDocumento(t, edicion.indice, edicion.cantidad);
    }
    await guardarDocumento360(t);
    const esperadas = LINEAS.map((l, i) => {
        const edicion = EDICIONES.find(e => e.indice === i);
        return Number(edicion ? edicion.cantidad : l.cantidad);
    });
    const lineasPedido = await esperarLineasDocumento(t, LINEAS.length, 'El pedido no quedó con las 5 líneas');
    await t.expect(lineasPedido.map(l => l.num.cantidad)).eql(esperadas, 'Las cantidades del pedido no quedaron editadas');
    await cerrarPestana360(t);

    // Factura que descarga el pedido
    await nuevoDocumento360(t, TX_FACTURA.filtro, TX_FACTURA.texto);
    await elegirTerceroDocumento(t, TERCERO);
    await guardarDocumento360(t);
    await cargarPedidoEnDocumento360(t, numeroPedido);
    const lineasFactura = await esperarLineasDocumento(t, LINEAS.length, 'La factura no descargó las 5 líneas del pedido');
    await t
        .expect(lineasFactura.map(l => l.num.cantidad)).eql(esperadas, 'La factura no trajo las cantidades del pedido')
        .expect(lineasFactura.map(l => l.producto)).eql(LINEAS.map(l => l.producto), 'La factura no trajo los productos del pedido');
    await guardarDocumento360(t);

    // Limpieza: factura y pedido
    await eliminarDocumentoActual360(t);
    await eliminarDocumentoSiExiste360(t, TX_PEDIDO.filtro, TX_PEDIDO.texto, numeroPedido);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Pedidos Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Pedidos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
