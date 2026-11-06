import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    aceptarValidacionesSiExisten,
    confirmarProceso,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaSiExiste360,
    escribirFecha360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

fixture `INC0000 Grabacion Prueba`
    .page (`https://test.hgi360.com/`)

test('GRABACION', async t => {

});



test('New Test', async t => {
    
});



test('New Test 1', async t => {
    //PRUEBA 
    await t
        .click(Selector('#ErpSidebarModulos span').withText('Movimientos'))    
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Documentos'))
    await t
        .click('#BtnNuevoDocumento .dx-icon.dx-icon-add')
    await t
        .click('#Documento_Transaccion .dx-lookup-field')
    await t
        .typeText('#dx-e2a01254-57a5-e3a3-3dab-3954aece861f .dx-texteditor-input', '0102')
    await t
        .click(Selector('#dx-3758187b-6983-5b71-9b25-4ec1c7e29597 div').withText('0102 - Factura de Venta No Electronica'))
    await t
        .click(Selector('#Documento_Tercero div').withText('0 - GENERAL .').nth(1))
    await t
        .typeText('#dx-2c12cec5-142d-8ae4-3ca2-1a71ea6dcb62 .dx-texteditor-input', '1000099598')
    await t
        .click(Selector('#dx-258fe2e1-1d43-2183-11b1-d91448fc96c7 div').withText('1000099598 - Vasquez Suarez Camilo'))
    await t
        .click('#BtnGuardarDocumento_btn .dx-icon.dx-icon-save')
    await t
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')
    await t
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1', {
            caretPos: 0
        })
        .pressKey('enter')
    await t
        .pressKey('enter')
    await t
        .expect(Selector('#dx-fe5e4839-6c26-9fd0-129a-e4a28d318412 span').withText('010203')).visible
    await t
        .click(Selector('#BtnGuardarDocumento_btn span').withText('Guardar'))
    await t
        .expect(Selector('#root div').withText('Documento actualizado con éxito').nth(1)).visible
    .cerrarSesion360

    //CREAR UNA PRUEBA APARTE, DIFERENTE CON LO SIGUIENTE
});