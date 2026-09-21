import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimientoPos;
let abrirTransaccion = HelpersHappgi.abrirTransaccion;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimientoPos;
    abrirTransaccion = h.abrirTransaccion;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimientoPos(t, esHgi360(config) ? 'Documentos' : 'DOCUMENTOS');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '60');
    await t
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .click(Selector('#modal_Documento_validacion button').withText('×'))
        .click('#tabs_documento_Ubicacion')
        .click('#Documento_NotasDIAN .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"]').nth(1).find('div').withText('4 - Otro').nth(9))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(Selector('#Documento_ModalValidacionDIAN h5').withText('Validación Tercero').visible).ok('No está saliendo el control del tercero')
        .click(Selector('#Documento_ModalValidacionDIAN_BtnCancelar span').withText('Cancelar'))
        .doubleClick('#txtDocumento_Detalle_Producto_cursor_1')
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '100')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .expect(Selector('.swal2-content div').withText('Referencia a objeto no establecida como instancia').visible).ok('no salió el mensaje genérico')
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC071 mensaje doc sin guardar POS`
    .page(testPosConfig.pagina);

test('Prueba INC071 mensaje doc sin guardar mipos', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba INC071 mensaje doc sin guardar Happgi POS`
    .page(testHappgiPosConfig.pagina);

test('Prueba INC071 mensaje doc sin guardar Happgi POS', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
