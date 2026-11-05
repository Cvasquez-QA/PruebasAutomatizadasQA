import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

const TIPO_CORREO = 'Administrativo';
const CORREO_REMITENTE = 'CorreoRemitente';
const NOMBRE_REMITENTE = 'NombreRemitente';
const CUENTA = '123';
const EMAIL = 'mail';
const CORREO_REMITENTE_EDIT = 'NuevoCorreoRemitente';
const NOMBRE_REMITENTE_EDIT = 'NuevoNombreRemitente';
const CUENTA_EDIT = 'NuevaCuenta';
const EMAIL_EDIT = 'NuevoEmailccco';

fixture `Prueba Parámetros Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Parámetros - Mensajes - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .wait(3000)
        .click('#tabs_parametros_Mensajes')
        .click(Selector('#BtnEditar span').withText('Editar'))
        .click('#ParametrosGeneralesCorreos .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon').nth(1))
        .wait(2000)
        ;
    await seleccionarOpcion(t, TIPO_CORREO);
    await t
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6), CORREO_REMITENTE)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7), NOMBRE_REMITENTE)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8), CUENTA)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9), EMAIL)
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
    //Se edita
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon'))
        ;
    await seleccionarOpcion(t, TIPO_CORREO);
    await t
        .click(Selector('#ParametrosGeneralesCorreos .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon'))
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6), CORREO_REMITENTE_EDIT)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7), NOMBRE_REMITENTE_EDIT)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8), CUENTA_EDIT)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9), EMAIL_EDIT)
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
    //Se elimina
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .click(Selector('div').withText('Sí').nth(9))
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Parámetros Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Parámetros - Mensajes - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .wait(3000)
        .click('#tabs_parametros_Mensajes')
        .click(Selector('#BtnEditar span').withText('Editar'))
        .click('#ParametrosGeneralesCorreos .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon').nth(1))
        .wait(2000)
        ;
    await seleccionarOpcion(t, TIPO_CORREO);
    await t
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6), CORREO_REMITENTE)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7), NOMBRE_REMITENTE)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8), CUENTA)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9), EMAIL)
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
    //Se edita
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon'))
        ;
    await seleccionarOpcion(t, TIPO_CORREO);
    await t
        .click(Selector('#ParametrosGeneralesCorreos .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon'))
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6), CORREO_REMITENTE_EDIT)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7), NOMBRE_REMITENTE_EDIT)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8), CUENTA_EDIT)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9), EMAIL_EDIT)
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
    //Se elimina
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .click(Selector('div').withText('Sí').nth(9))
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
