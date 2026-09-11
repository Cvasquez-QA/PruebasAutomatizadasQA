import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../../ParametrosPruebas/Hgi360Admin8888.js';

const TIPO_CORREO = 'Administrativo';
const CORREO_REMITENTE = 'CorreoRemitente';
const NOMBRE_REMITENTE = 'NombreRemitente';
const CUENTA = '123';
const EMAIL = 'mail';
const CORREO_REMITENTE_EDIT = 'NuevoCorreoRemitente';
const NOMBRE_REMITENTE_EDIT = 'NuevoNombreRemitente';
const CUENTA_EDIT = 'NuevaCuenta';
const EMAIL_EDIT = 'NuevoEmailccco';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
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
            .click('#ParametrosGeneralesCorreos .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
            .click(Selector('div').withText('Sí').nth(9))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Parámetros - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Parámetros - Mensajes - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Parámetros - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Parámetros - Mensajes - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
