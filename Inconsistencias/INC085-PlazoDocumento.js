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


/*
***********
*************
**************
***********
**************
**********
********
*/

fixture `Prueba Plazo Documentos testHGI360 Admin`
    .page (testAdminConfig.pagina)

test('Prueba Plazo Documentos test Hgi360 admin', async t => {
    usarHelpersDe(testAdminConfig);
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMovimientoPos(t, esHgi360(testAdminConfig) ? 'Documentos' : 'DOCUMENTOS');
    await t
    //Se adiciona un documento
        .click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '085No');
    await t
        .doubleClick('#txtDocumento_Fecha .dx-texteditor-input', {
            caretPos: 8
        })
    await t
        .doubleClick('#txtDocumento_Plazo .dx-texteditor-input', {
            caretPos: 0
        })
    await t
        .doubleClick('#txtDocumento_Fecha_Vence .dx-texteditor-input', {
            caretPos: 0
        })
    await t
        .doubleClick('#frmDocumento .nav.nav-tabs')
    await t
        .click(Selector('#Documento_Tercero .dx-lookup-field'))
    await t
        .doubleClick('#dx-1ea2a9f7-68cd-71b8-a886-e33d19f10cac .dx-texteditor-input')
    await t
        .typeText('#dx-1ea2a9f7-68cd-71b8-a886-e33d19f10cac .dx-texteditor-input', 'hgi')
    await t
        .click(Selector('#dx-0618d2e0-bb3c-b8b9-8681-916bd045246e div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(6))
        
        
        .expect(Selector('#root span').withText('HGI360 Administrativo').visible).ok('no está el texto visible')
        .expect(Selector('#root span').withText('HGI360 CRM').visible).ok('no está el texto visible')
        await t
        .click(Selector('#root span').withText('HGI360 Contable'))
        .wait(2000)
        .click(Selector('#root span').withText('Chatear con un agente'))
        .wait(2000)
        .expect(Selector('#root p').withText('Estás en cola: cuando un asesor tome tu conversación podrás enviar mensajes').visible).ok('no está el texto visible')
        .click(Selector('#root button').withText('×'))
        .switchToMainWindow();
    await cerrarSesion(t);
});