import { ClientFunction, Selector } from 'testcafe';
import {
    abrirHerramientas360,
    buscarEnGrid360,
    cerrarSesion360,
    elegirEnLookup360,
    eliminarFilaSiExiste360,
    filaGrid360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC090 - Herramientas > Usuarios: se crea un usuario nuevo, se ingresa con él (selección de módulo WMS)
 * y se elimina. Usuario y clave de prueba vienen del archivo legacy.
 */

const GRID = 'gridUsuarios';
const USUARIO_NUEVO = 'UsuarioNuevo1';
const NOMBRE_USUARIO = 'PruebaUsuarioNuevo1';
const CLAVE_USUARIO = 'Calidad2026*';
const EMAIL_USUARIO = 'cvasquez@hgi.com';
const VENDEDOR_USUARIO = '01 Vendedor 01';

const campo = (...ids) => Selector(ids.map(id => `input#${id}, #${id} input.dx-texteditor-input`).join(', ')).filterVisible().nth(0);

const camposVisibles = ClientFunction(() => Array.from(document.querySelectorAll('[id]'))
    .filter(function (n) { return n.getClientRects().length && /usuario/i.test(n.id) && /^(txt|Str|Gestion|Usuarios)/.test(n.id); })
    .map(function (n) { return n.id; })
    .slice(0, 30)
    .join(', '));

async function escribir(t, nombre, valor, ...ids) {
    const sel = campo(...ids);
    if (!await sel.with({ timeout: 5000 }).exists) {
        await t.expect(false).ok(`No se encontró el campo ${nombre} del usuario. Campos: ${await camposVisibles()}`);
    }
    await t.typeText(sel, valor, { replace: true });
}

fixture `Prueba Usuario Nuevo INC090 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC090 - Crear usuario nuevo', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirHerramientas360(t, 'Usuarios');
    await eliminarFilaSiExiste360(t, GRID, USUARIO_NUEVO);
    await nuevoRegistroGrid360(t, GRID);
    await escribir(t, 'Usuario', USUARIO_NUEVO, 'StrIdUsuario', 'txtUsuarios_StrIdUsuario');
    await escribir(t, 'Nombre', NOMBRE_USUARIO, 'Gestion_Usuario_Nombre', 'txtUsuarios_StrNombre');
    await escribir(t, 'Correo', EMAIL_USUARIO, 'txtUsuarios_StrMail');
    if (await Selector('#Usuarios_Vendedor').exists) {
        await elegirEnLookup360(t, '#Usuarios_Vendedor', VENDEDOR_USUARIO);
    }
    await escribir(t, 'Clave', CLAVE_USUARIO, 'txtUsuarios_StrClave_cursor_', 'txtUsuarios_StrClave');
    const activo = Selector('#txtUsuario_Activo, #txtUsuarios_Activo').filterVisible();
    if (await activo.exists && await activo.getAttribute('aria-checked') !== 'true') {
        await t.click(activo.find('.dx-checkbox-icon'));
    }
    await t.click(Selector('[id^="BtnGuardar"]').filterVisible().nth(0)).wait(3000);
    // Versión actual: al guardar pregunta "Registro guardado ¿Deseas llenar la información adicional?"
    const adicional = Selector('.swal2-popup').filterVisible().withText(/Registro guardado/i);
    if (await adicional.exists) {
        await t.click(adicional.find('button').withText(/^\s*No\s*$/)).wait(2000);
    }
    const error = Selector('.erp-toast[data-type="error"], .erp-form-error__text, .swal2-popup').filterVisible();
    if (await error.exists) {
        await t.expect(false).ok(`No se guardó el usuario: ${(await error.nth(0).innerText).replace(/\s+/g, ' ').trim()}`);
    }
    await buscarEnGrid360(t, GRID, USUARIO_NUEVO);
    await t.expect(filaGrid360(GRID, USUARIO_NUEVO).with({ timeout: 15000 }).exists).ok(`El usuario ${USUARIO_NUEVO} no aparece en la lista`);
    await cerrarSesion360(t);
});

test('INC090 - Ingreso con usuario nuevo en WMS', async t => {
    await ingresarAplicacion(t, { ...testAdminConfig, usuario: USUARIO_NUEVO, clave: CLAVE_USUARIO });
    const wms = Selector('*').filterVisible().withExactText('WMS');
    await t.expect(wms.with({ timeout: 20000 }).exists).ok('No aparece el módulo WMS en la selección de módulo del usuario nuevo');
    await t
        .click(wms.nth(0))
        .click(Selector('#BtnContinuarSeleccionModulo_HGI360, button').filterVisible().withText(/Ingresar|Continuar/).nth(0))
        .expect(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger').with({ timeout: 30000 }).exists)
        .ok('No ingresó al módulo WMS con el usuario nuevo');
    await cerrarSesion360(t);
});

test('INC090 - Eliminar usuario nuevo', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirHerramientas360(t, 'Usuarios');
    await eliminarFilaSiExiste360(t, GRID, USUARIO_NUEVO);
    await buscarEnGrid360(t, GRID, USUARIO_NUEVO);
    await t.expect(filaGrid360(GRID, USUARIO_NUEVO).exists).notOk(`El usuario ${USUARIO_NUEVO} sigue en la lista`, { timeout: 10000 });
    await cerrarSesion360(t);
});
