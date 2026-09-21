import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimiento = HelpersHappgi.abrirMovimiento;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimiento = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, es360 ? 'Documentos' : 'DOCUMENTOS');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, 'INC030');
    await t
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
        .click('#tabs_documento_Ubicacion')
        .wait(1500)
        .expect(Selector('#Documento_Cuotas .dx-texteditor-input').value).eql('1', 'No se está creando con cuota 1 por defecto')
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2500)
        .click(Selector('#txtDocumento .dx-texteditor-input'))
        .wait(1500)
        .click('#tabs_documento_Ubicacion')
        .wait(1500)
        .expect(Selector('#Documento_Cuotas .dx-texteditor-input').value).eql('1', 'Se está cambiando la cuota 1 por defecto')
        .wait(1500)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'));
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba Cuota 0 Admin testerp`
    .page(testAdminConfig.pagina);

test('Prueba Cuota 0 Admin testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Cuota 0 Admin Hgi360`
    .page(hgi360AdminConfig.pagina);

test('Prueba Cuota 0 Admin Hgi360', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});
