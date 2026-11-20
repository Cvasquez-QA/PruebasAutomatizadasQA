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
    await t
        .click(Selector('#ErpSidebarModulos span').withText('Movimientos'))    
    await t
        .click(Selector('#ErpMenuCardGrid span').withText('Documentos'))
    await t
    //Selector('[class^="dx-item dx-menu-item dx-menu-item-has-icon dx-menu"]').nth(2).find('.dx-context-menu-container-border')
        .click(Selector('#dx-dcbc3f8e-3264-e0a1-a7d0-4d85919d666b .dx-context-menu-container-border').nth(1))
    await t
        .click(Selector('#dx-dcbc3f8e-3264-e0a1-a7d0-4d85919d666b .dx-context-menu-container-border').nth(1))
    await t
        .click(Selector('#dx-60615619-15c8-6e47-9bbd-9ac29f7e46af span').withText('Entre'))
    await t
        expect(Selector('#ListagridDocumentos .dx-texteditor-input').nth(5)).visible
    await t
        .expect(Selector('#ListagridDocumentos .dx-texteditor-input').nth(6)).visible
    await t
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(5), '1')
    await t
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(6), '2')
    await t

});