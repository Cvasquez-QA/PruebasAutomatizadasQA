import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    abrirTransaccion,
    cerrarPestana360,
    cerrarSesion360,
    eliminarDocumento,
    ingresarAplicacion,
    TX_DOCUMENTO,
} from '../../Funciones/HelpersHgi360.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const TX_PEDIDO = '07QA';
const PRODUCTO = '01';
const CANTIDAD_EXCESIVA = '1000000000';
const MSG_CANTIDAD_INEXISTENTE = 'Cantidad Inexistente';
const MSG_PEDIDOS_SUPERA_SALDO = 'La cantidad mas los pedidos supera el saldo existe';

const inputCantidad = Selector('#txtDocumento_Detalle_Cantidad_cursor_1');
const toastError = Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div');

const crearDocumentoDesdeGrid = async (t, transaccion) => {
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, transaccion);
    await t.click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
};

const crearDocumentoNuevo = async (t, transaccion) => {
    await t.click('#BtnNuevoDocumento .dx-icon.dx-icon-add');
    await abrirTransaccion(t, transaccion);
    await t.click(Selector('#BtnGuardarDocumento span').withText('Guardar'));
};

const ingresarProductoCantidadExcesiva = async t => {
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click(inputCantidad)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(inputCantidad, CANTIDAD_EXCESIVA)
        .pressKey('enter');
};

const validarMensajeInventarioFactura = async t => {
    await crearDocumentoDesdeGrid(t, TX_DOCUMENTO);
    await ingresarProductoCantidadExcesiva(t);

    await t
        .expect(toastError.withText(MSG_CANTIDAD_INEXISTENTE).visible).ok(
            `Se esperaba el mensaje: ${MSG_CANTIDAD_INEXISTENTE}`
        );

    await eliminarDocumento(t);
};

const validarMensajeInventarioPedido = async t => {
    await crearDocumentoNuevo(t, TX_PEDIDO);
    await ingresarProductoCantidadExcesiva(t);

    await t
        .expect(toastError.withText(MSG_PEDIDOS_SUPERA_SALDO).visible).ok(
            `Se esperaba el mensaje: ${MSG_PEDIDOS_SUPERA_SALDO}`
        );

    await eliminarDocumento(t);
};

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Documentos');

    await validarMensajeInventarioFactura(t);
    await validarMensajeInventarioPedido(t);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
};

fixture `INC114 Mensaje inventario pedidos - Test Hgi360 Admin`
    .page(testAdminConfig.pagina);

test('INC114 Mensaje inventario pedidos - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC114 Mensaje inventario pedidos - Hgi360 Admin`
    .page(hgi360AdminConfig.pagina);

test('INC114 Mensaje inventario pedidos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});
