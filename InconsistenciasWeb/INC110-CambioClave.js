import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC110 - Cambiar clave: valida requeridos y mínimo de 12 caracteres, cambia a una clave temporal y la revierte a la
 * original (la clave original debe cumplir la misma política para poder revertirla).
 */

const CLAVE_TEMPORAL = 'Calidad2027*';
const MENSAJES_REQUERIDOS = [/La clave anterior es requerida/, /La clave nueva es requerida/, /Debes? confirmar la clave/];
const MSG_MIN_CARACTERES = /La clave nueva debe tener al menos 12 caracteres/;
const MSG_EXITO = /La contrase[ñn]a fue actualizada correctamente/;

const modal = Selector('#validar_modalCambiarClaveUsuario, .dx-overlay-content').filterVisible();
const btnGuardar = Selector('#CambiarClaveUsuario_BtnGuardar_btn, #CambiarClaveUsuario_BtnGuardar').filterVisible();
const mensaje = texto => Selector('.erp-form-error__text, .dx-invalid-message, .erp-toast, #validar_modalCambiarClaveUsuario div')
    .filterVisible().withText(texto);
const campo = id => Selector(`#${id} .dx-texteditor-input`);

async function abrirCambiarClave(t) {
    await t
        .click(Selector('.erp-user-trigger').filterVisible().with({ timeout: 15000 }).nth(0))
        .click(Selector('#lstCambiarClave').filterVisible().with({ timeout: 10000 }))
        .expect(campo('claveAnterior').with({ timeout: 10000 }).visible).ok('No se abrió el modal de cambiar clave');
}

async function cambiarClave(t, anterior, nueva) {
    await t
        .typeText(campo('claveAnterior'), anterior, { replace: true })
        .typeText(campo('nuevaClave'), nueva, { replace: true })
        .typeText(campo('confirmar'), nueva, { replace: true })
        .click(btnGuardar.nth(0));
    return mensaje(MSG_EXITO).with({ timeout: 15000 }).exists;
}

async function ejecutarPrueba(t, config) {
    await t.expect(config.clave.length >= 12).ok('La clave original no cumple la política de 12 caracteres: no se podría revertir');
    await ingresarAplicacion(t, config);
    await abrirCambiarClave(t);

    // Versión actual: muestra un requerido a la vez; se llena cada campo y se vuelve a guardar (sin confirmar no guarda)
    const valores = [['claveAnterior', config.clave], ['nuevaClave', CLAVE_TEMPORAL]];
    for (let i = 0; i < MENSAJES_REQUERIDOS.length; i++) {
        await t
            .click(btnGuardar.nth(0))
            .expect(mensaje(MENSAJES_REQUERIDOS[i]).with({ timeout: 5000 }).exists).ok(`No se mostró: "${MENSAJES_REQUERIDOS[i].source}"`);
        if (valores[i]) {
            await t.typeText(campo(valores[i][0]), valores[i][1], { replace: true });
        }
    }

    await t
        .typeText(campo('claveAnterior'), config.clave, { replace: true })
        .typeText(campo('nuevaClave'), '123', { replace: true })
        .typeText(campo('confirmar'), '123', { replace: true })
        .click(btnGuardar.nth(0))
        .expect(mensaje(MSG_MIN_CARACTERES).with({ timeout: 5000 }).exists).ok('No se mostró la validación de mínimo de caracteres');

    const cambiada = await cambiarClave(t, config.clave, CLAVE_TEMPORAL);
    // Se intenta revertir aunque no se haya visto el mensaje: si la clave no cambió, el ERP rechaza la anterior.
    let revertida = false;
    for (let intento = 0; intento < 2 && !revertida; intento++) {
        await t.wait(2000);
        if (!await campo('claveAnterior').filterVisible().exists) {
            await abrirCambiarClave(t);
        }
        revertida = await cambiarClave(t, CLAVE_TEMPORAL, config.clave);
    }
    await t
        .expect(cambiada).ok('No se mostró el mensaje de clave actualizada')
        .expect(revertida).ok('ATENCIÓN: no se pudo revertir la clave del usuario a la original');
    if (await modal.find('.dx-closebutton').exists) {
        await t.click(modal.find('.dx-closebutton').nth(0));
    }
    await cerrarSesion360(t);
}

fixture `INC110 Cambio clave - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC110 Cambio clave - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC110 Cambio clave - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC110 Cambio clave - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
