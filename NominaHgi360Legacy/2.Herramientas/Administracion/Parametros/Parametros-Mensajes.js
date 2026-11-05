import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    ingresarAplicacion,
    
    cerrarSesion360,
    seleccionarOpcion
} from '../../../../Funciones/HelpersHgi360Legacy.js';
import {
    ingresarParametros,
    editarParametros
} from '../HelpersNomina.js';

const TIPO_APLICACION = 'Administrativo';
const DATOS_CORREO_INICIALES = {
    remitente: 'CorreoRemitente',
    nombre: 'NombreRemitente',
    cuenta: '123',
    copiaOculta: 'mail'
};
const DATOS_CORREO_EDITADOS = {
    remitente: 'NuevoCorreoRemitente',
    nombre: 'NuevoNombreRemitente',
    cuenta: 'NuevaCuenta',
    copiaOculta: 'NuevoEmailccco'
};
const ejecutarCrudMensajes = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametros(t, '#tabs_parametros_Mensajes');
    await editarParametros(t);

    await t
        .click('#ParametrosGeneralesCorreos .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon').nth(1))
        ;
    await seleccionarOpcion(t, TIPO_APLICACION);
    await t
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6), DATOS_CORREO_INICIALES.remitente)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7), DATOS_CORREO_INICIALES.nombre)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8), DATOS_CORREO_INICIALES.cuenta)
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9), DATOS_CORREO_INICIALES.copiaOculta)
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon'))
        ;
    await seleccionarOpcion(t, TIPO_APLICACION);
    await t
        .expect(Selector('#ParametrosGeneralesCorreos td').withText(DATOS_CORREO_INICIALES.remitente).exists).ok('No se creó el registro de correo')
        .click(Selector('#ParametrosGeneralesCorreos .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon'))
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(6), DATOS_CORREO_EDITADOS.remitente)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(7), DATOS_CORREO_EDITADOS.nombre)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(8), DATOS_CORREO_EDITADOS.cuenta)
        .click(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#ParametrosGeneralesCorreos .dx-texteditor-input').nth(9), DATOS_CORREO_EDITADOS.copiaOculta)
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(2000)
        .click(Selector('#ParametrosGeneralesCorreos .dx-dropdowneditor-icon'))
        ;
    await seleccionarOpcion(t, TIPO_APLICACION);
    await t
        .expect(Selector('#ParametrosGeneralesCorreos td').withText(DATOS_CORREO_EDITADOS.remitente).exists).ok('No se guardó la edición')
        .click('#ParametrosGeneralesCorreos .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .click(Selector('span').withText('Sí'))
        .wait(2000)
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

fixture `Prueba Parametros Mensajes Nomina - MiHgi360 8893`
    .page(miNominaConfig.pagina);

test('[Mi Hgi360 8893] Parametros Mensajes - CRUD en grid de correos', async t => {
    await ejecutarCrudMensajes(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Parametros Mensajes Nomina - Test Hgi360 8902`
    .page(testNominaConfig.pagina);

test('[Test Hgi360 8902] Parametros Mensajes - CRUD en grid de correos', async t => {
    await ejecutarCrudMensajes(t, testNominaConfig, ingresarAplicacion);
});
