import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

const desplegableLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input');
const DEPENDENCIA = '0 - General';
const PRODUCTO_1 = '010203';
const PRODUCTO_2 = '010202';

const CAUSACION_TRANSACCION = '09 - CAJA MENOR';
const CAUSACION_TERCERO = '811021438 - HGI S.A.S - HGI S.A.S';
const CAUSACION_SUCURSAL = '0 - GENERAL';
const CAUSACION_CCOSTO = '01 - ADMINISTRACION';
const CUENTA_1 = '11050501';
const CUENTA_2 = '11050502';

const PV_CAJA = testPosConfig.caja;
const PV_TRANSACCION = '0101 - PRUEBA FACTURA PV';
const PV_PRODUCTO_1 = '01';
const PV_PRODUCTO_2 = '02';

const ingresarModulo = async (t, config = testAdminConfig) => {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await t.wait(5000);
};

const abrirDocumentos = async (t, config = testAdminConfig) => {
    await abrirMovimiento(t, 'Documentos');
};

const abrirCausaciones = async (t, config = testAdminConfig) => {
    await abrirMovimiento(t, 'Causaciones');
};

const agregarDetalle = async (t, producto, cantidad = '1', opciones = {}) => {
    await t.typeText('#txtDocumento_Detalle_Producto_cursor_1', producto);

    if (opciones.usarEnter) {
        await t.pressKey('enter');
    }

    if (opciones.caretPos !== undefined) {
        await t.typeText('#txtDocumento_Detalle_Cantidad_cursor_1', cantidad, { caretPos: opciones.caretPos });
    } else {
        await t.typeText('#txtDocumento_Detalle_Cantidad_cursor_1', cantidad);
    }

    await t
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(3000);
};


const agregarDetalleCausacion = async (t, indice, cuenta, valor) => {
    await t.click(`#txtCausacion_Detalle_Cuenta_${indice} .dx-icon.dx-icon-search`);
    await t.wait(3000);
    await t.click(Selector('td').withText(cuenta));
    await t.pressKey('enter');
    await t.typeText(`#txtdocumento_detalle_causacion_Valor_cursor_${indice}`, valor);
    await t.pressKey('enter');
    await t
        .click(`#txtdocumento_detalle_causacion_Boton_${indice} .dx-icon.dx-icon-check`)
        .wait(2000);
};

const ingresarModuloPos = async (t, config = testPosConfig) => {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await t.wait(5000);
};

const abrirPuntoDeVenta = async (t, config = testPosConfig) => {
    await abrirMovimientoPos(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('.dx-list-item').withText(PV_CAJA))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(2000);
};

const agregarDetallePv = async (t, producto) => {
    await t
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', producto)
        .pressKey('enter')
        .wait(2000)
        .click('#txtPuntoDeVenta_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(2000);
};

const cerrarSesionPos = async t => {
    await t
        .click('#PuntoDeVenta_BtnSalir .dx-icon.fas.fa-sign-out-alt')
        .switchToMainWindow();
    await cerrarSesion(t);
};

/*
***********
*************
**************
***********
**************
**********
********
*/

fixture `Prueba Eliminar Detalles INC092 testHGI360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC092 - Eliminar detalles seleccionados en documento administrativo', async t => {
    await ingresarModulo(t);
    await abrirDocumentos(t);

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '0101doc');
    await t
        .click('#Documento_Dependencia .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(DEPENDENCIA))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);

    await agregarDetalle(t, PRODUCTO_1, '1', { caretPos: 0 });
    await agregarDetalle(t, PRODUCTO_2, '1', { usarEnter: true });

    await t.expect(Selector('td').withText(PRODUCTO_2).visible).ok();

    await t
        .click('#chkDocumentos_SeleccionarTodos .dx-checkbox-icon')
        .click(Selector('.dx-checkbox-icon').nth(19))
        .click(Selector('#Documento_Detalle_BtnEliminarSeleccion span').withText('Eliminar detalles'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .expect(Selector('td').withText(PRODUCTO_2).visible).notOk();

    await t.wait(3000);

    for (let i = 0; i < 4; i++) {
        await agregarDetalle(t, PRODUCTO_2, '1', { usarEnter: true });
    }

    await t
        .click('#chkDocumentos_SeleccionarTodos .dx-checkbox-icon')
        .click(Selector('#Documento_Detalle_BtnEliminarSeleccion span').withText('Eliminar detalles'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .expect(Selector('td').withText(PRODUCTO_1).visible).notOk();

    await t
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);

    await cerrarSesion(t);
});


test('INC092 - Eliminar detalles seleccionados en causacion', async t => {
    await ingresarModulo(t);
    await abrirCausaciones(t);
    await t
    .click('#ListagridDocumentosCausaciones .dx-icon.dx-icon-add')
    .click('#Causacion_Transaccion .dx-lookup-field')
    .click(Selector('.dx-item.dx-list-item div').withText(CAUSACION_TRANSACCION))
    .click('#Causacion_Tercero .dx-lookup-field')
    .typeText(desplegableLookup, 'hgi')
    .click(Selector('.dx-item.dx-list-item div').withText(CAUSACION_TERCERO))
    .click('#Causacion_Sucursal .dx-lookup-field')
    .click(Selector('.dx-item.dx-list-item div').withText(CAUSACION_SUCURSAL))
    .click('#Causacion_Ccosto .dx-lookup-field')
    .click(Selector('.dx-item.dx-list-item div').withText(CAUSACION_CCOSTO))
    .typeText('#txtDocumentoCausacion_Referencia .dx-texteditor-input', '12',)
    .click(Selector('#BtnGuardarCausacion div').withText('Guardar'))
    .wait(2000)
    if(await Selector('#swal2-content').exists){
        await t.click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(3000)
        .click('#txtDocumentoCausacion_Referencia .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumentoCausacion_Referencia .dx-texteditor-input', '121')
    }

    await agregarDetalleCausacion(t, 1, CUENTA_1, '10000');
    await agregarDetalleCausacion(t, 2, CUENTA_2, '10000');

    await t
        .click('#chkCausacion_SeleccionarTodos .dx-checkbox-icon')
        .click(Selector('.dx-checkbox-icon').nth(1))
        .click(Selector('#Causacion_Detalle_BtnEliminarSeleccion span').withText('Eliminar detalles'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)

        //.expect(Selector('td').withText(CUENTA_1).visible).ok();

    for (let i = 2; i <= 4; i++) {
        await agregarDetalleCausacion(t, i, CUENTA_2, '10000');
    }

    await t
        .click('#chkCausacion_SeleccionarTodos .dx-checkbox-icon')
        .click(Selector('#Causacion_Detalle_BtnEliminarSeleccion span').withText('Eliminar detalles'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)



    await cerrarSesion(t);
});

fixture `Prueba Eliminar Detalles INC092 testHGI360 Pos`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC092 - Eliminar detalles seleccionados en punto de venta', async t => {
    await ingresarModuloPos(t);
    await abrirPuntoDeVenta(t);

    await t
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-list-item').withText(PV_TRANSACCION))
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000);

    await agregarDetallePv(t, '010203');
    await t.wait(2000);
    await agregarDetallePv(t, '010202');

    await t
    
        .click('#chkPuntoDeVenta_SeleccionarTodos .dx-checkbox-icon')

        .click(Selector('.dx-checkbox-icon').nth(3))
        .click(Selector('#PuntoDeVenta_Detalle_BtnEliminarSeleccion span').withText('Eliminar detalles'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)

    await agregarDetallePv(t, PV_PRODUCTO_2);
    await agregarDetallePv(t, '03');
    await agregarDetallePv(t, '04');
    await agregarDetallePv(t, '05');

    await t
        .click('#chkPuntoDeVenta_SeleccionarTodos .dx-checkbox-icon')
        .click(Selector('#PuntoDeVenta_Detalle_BtnEliminarSeleccion span').withText('Eliminar detalles'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .expect(Selector('#txtPuntoDeVenta_Detalle_Producto_cursor_1').value).eql('')
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);

    await cerrarSesionPos(t);
});
