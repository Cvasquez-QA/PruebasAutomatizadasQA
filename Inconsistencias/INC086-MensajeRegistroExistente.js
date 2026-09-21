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

let abrirMaestros = HelpersHappgi.abrirMaestros;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMaestros = esHgi360(config) ? h.abrirMaestros360 : h.abrirMaestros;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
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


Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div').withText('Ya existe un producto con el código 0 (GENERAL).')


fixture `Prueba Mensaje registro ya existe testHGI360 Admin`
    .page (testAdminConfig.pagina)

test('Prueba Mensaje registro test Hgi360 admin', async t => {
    usarHelpersDe(testAdminConfig);
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros(t, esHgi360(testAdminConfig) ? 'Terceros' : 'TERCEROS');
    await t
        .click(Selector('#gridTerceros .dx-icon.dx-icon-add'))
        .wait(2000)
        .typeText('#txtTercero_Id .dx-texteditor-input', '0')
        .pressKey('enter')
        .expect(Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div').withText('Ya existe un tercero con la identificación').visible).ok('no está el texto visible')
        .click(Selector('#BtnCancelarTercero .dx-icon.dx-icon-close'))
        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMaestros(t, esHgi360(testAdminConfig) ? 'Productos' : 'PRODUCTOS');
    await t
        .click(Selector('#gridProductos .dx-icon.dx-icon-add'))
        .wait(2000)
    //Se inicia inserción de producto
        .typeText('#txtStrIdProducto', '01')   
        . pressKey('enter')
        .expect(Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div').withText('Ya existe un producto con el código').visible).ok('no está el texto visible')
        .click(Selector('#BtnCancelarProducto .dx-icon.dx-icon-close'))
        .switchToMainWindow();
    await cerrarSesion(t);
});