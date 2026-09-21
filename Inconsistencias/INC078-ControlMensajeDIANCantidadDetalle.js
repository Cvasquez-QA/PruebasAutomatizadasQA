import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimiento = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, esHgi360(config) ? 'Documentos' : 'DOCUMENTOS');
    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .wait(2000);
    await abrirTransaccion(t, '0101');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('.dx-item.dx-validationsummary-item div').withText('Debe seleccionar la dependencia').visible).ok('No muestra el mensaje de seleccionar la dependencia')
        .click(Selector('#modal_Documento_validacion .close'))
        .click('#Documento_Dependencia .dx-lookup-field')
        .pressKey('down')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(5000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .click('txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '0')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(1500)
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .click(Selector('div').withText('Enviar').nth(10))
        .wait(3500)
        .expect(Selector('.swal2-content div').withText('no puede tener cantidad cero.').visible).ok('no salió el mensaje genérico')
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(3000)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC078 test Admin`
    .page(testAdminConfig.pagina);

test('Prueba INC078', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
