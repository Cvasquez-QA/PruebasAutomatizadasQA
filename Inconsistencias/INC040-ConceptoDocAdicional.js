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

let abrirMaestros = HelpersHappgi.abrirMaestros;
let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMaestros = esHgi360(config) ? h.abrirMaestros360 : h.abrirMaestros;
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMaestros(t, 'Transacciones');
    await t
        .wait(12000)
        .typeText(Selector('.dx-texteditor-input-container .dx-texteditor-input'), 'INC040')
        .wait(2000)
        .click(Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines [title="Editar"]'))
        .wait(1500)
        .click('#tabs_documento_General')
        .click('#tabs_documento_Documentos')
        .wait(2000)
        .expect(Selector('#TxtTransaccion_Doc_Cpto_Doc_Adicional .dx-checkbox-icon').exists).ok('No está el parámetro del concepto doc adicional')
        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMovimientoPos(t, 'Documentos');
    await t
        .wait(20000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .wait(2000);
    await abrirTransaccion(t, 'INC040');
    await t
        .click('#tabs_documento_Ubicacion')
        .click(Selector('#tabs_documento_content_Ubicacion div').withText('GENERAL').nth(1))
        .expect(Selector('#Documento_Cpto_Doc_Adicional .dx-lookup-field').visible).ok('No está visible el parámetro')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('#txtDocumento_Detalle_Producto_cursor_1').focused).ok()
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .expect(Selector('#txtDocumento_Detalle_Cantidad_cursor_1').focused).ok()
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .wait(3000)
        .expect(Selector('#txtDocumento_Detalle_Producto_cursor_2').focused).ok()
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(1500)
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .click(Selector('div').withText('Enviar').nth(10))
        .wait(3500)
        .expect(Selector('div').withText('El documento se sincronizó correctamente a la DIAN').nth(2).visible).ok('No se mostró el mensaje de confirmación de enviado a la DIAN')
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC040 testERP Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC040 Concepto Doc Adicional testerp ADMIN', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC040 testERP POS`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC040 Concepto Doc Adicional testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});
