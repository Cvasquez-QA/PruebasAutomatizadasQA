import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config, filtroTx) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimientoPos(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, filtroTx);
    await t
        .click('#BtnNuevoDocumento')
        .expect(Selector('#Documento_ModalValidacionDIAN h5').withText('Validación Tercero').visible).ok('No está saliendo el control del tercero')
        .click(Selector('#Documento_ModalValidacionDIAN_BtnCancelar span').withText('Cancelar'))
        .wait(2000)
        .expect(Selector('#BtnPago').visible).notOk('El botón de PAGO está habilitado')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('#BtnPago').visible).ok('El botón de PAGO está INhabilitado')
        .wait(2000)
        .click(Selector('#BtnPago'))
        .expect(Selector('.swal2-content div').withText('El total del documento no puede ser cero (0).').visible).ok('no salió el mensaje genérico')
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC074 mensaje control botón Pago`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC071 mensaje control botón Pago', async t => {
    await ejecutarPrueba(t, testAdminConfig, '0101');
});

fixture `Prueba INC074 mensaje control botón Pago Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC071 mensaje control botón Pago Happgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig, '01PV');
});
