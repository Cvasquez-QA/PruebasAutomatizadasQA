import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    iframeTab,
    ingresarAplicacion,
} from '../../Funciones/HelpersHgi360.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const CLAVE_TEMPORAL = 'Calidad2027*';
const MSG_CLAVE_ANTERIOR = 'La clave anterior es requerida.';
const MSG_CLAVE_NUEVA = 'La clave nueva es requerida.';
const MSG_CONFIRMAR = 'Debe confirmar la clave.';
const MSG_MIN_CARACTERES = 'La clave nueva debe tener al menos 12 caracteres e';
const MSG_EXITO = 'La contraseÃ±a fue actualizada correctamente.';

const abrirCambiarClave = async t => {
    await t
        .switchToMainWindow()
        .click(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger'))
        .click(Selector('#lstCambiarClave span').withText('Cambiar clave'))
        .switchToIframe(iframeTab);
};

const limpiarYEscribir = async (t, selector, texto) => {
    await t
        .click(selector)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(selector, texto);
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirCambiarClave(t);

    // Validaciones de campos requeridos
    await t
        .click(Selector('#CambiarClaveUsuario_BtnGuardar span').withText('Guardar'))
        .expect(Selector('#validar_modalCambiarClaveUsuario div').withText(MSG_CLAVE_ANTERIOR).nth(1).visible).ok(
            `No se mostrÃ³: "${MSG_CLAVE_ANTERIOR}"`
        )
        .expect(Selector('#validar_modalCambiarClaveUsuario div').withText(MSG_CLAVE_NUEVA).nth(1).visible).ok(
            `No se mostrÃ³: "${MSG_CLAVE_NUEVA}"`
        )
        .expect(Selector('#validar_modalCambiarClaveUsuario div').withText(MSG_CONFIRMAR).nth(1).visible).ok(
            `No se mostrÃ³: "${MSG_CONFIRMAR}"`
        );

    // Clave nueva demasiado corta
    await t
        .typeText('#claveAnterior .dx-texteditor-input', config.clave)
        .typeText('#nuevaClave .dx-texteditor-input', '123')
        .typeText('#confirmar .dx-texteditor-input', '123')
        .click(Selector('#CambiarClaveUsuario_BtnGuardar span').withText('Guardar'))
        .expect(Selector('#validar_modalCambiarClaveUsuario div').withText(MSG_MIN_CARACTERES).nth(1).visible).ok(
            `No se mostrÃ³ validaciÃ³n de mÃ­nimo de caracteres`
        );

    // Cambio exitoso a clave temporal
    await limpiarYEscribir(t, '#nuevaClave .dx-texteditor-input', CLAVE_TEMPORAL);
    await limpiarYEscribir(t, '#confirmar .dx-texteditor-input', CLAVE_TEMPORAL);

    await t
        .click(Selector('#CambiarClaveUsuario_BtnGuardar span').withText('Guardar'))
        .expect(
            Selector('[class^="dx-overlay-content dx-toast-success dx-toast-conte"] div')
                .withText(MSG_EXITO)
                .visible
        ).ok(`No se mostrÃ³: "${MSG_EXITO}"`);

    // Revertir a la clave original para no romper logins posteriores
    await abrirCambiarClave(t);
    await t.typeText('#claveAnterior .dx-texteditor-input', CLAVE_TEMPORAL);
    await limpiarYEscribir(t, '#nuevaClave .dx-texteditor-input', config.clave);
    await limpiarYEscribir(t, '#confirmar .dx-texteditor-input', config.clave);

    await t
        .click(Selector('#CambiarClaveUsuario_BtnGuardar span').withText('Guardar'))
        .expect(
            Selector('[class^="dx-overlay-content dx-toast-success dx-toast-conte"] div')
                .withText(MSG_EXITO)
                .visible
        ).ok(`No se revirtiÃ³ la clave a la original`);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `INC110 Cambio clave - Test Hgi360 Admin`
    .page(testAdminConfig.pagina);

test('INC110 Cambio clave - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC110 Cambio clave - Hgi360 Admin`
    .page(hgi360AdminConfig.pagina);

test('INC110 Cambio clave - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});
