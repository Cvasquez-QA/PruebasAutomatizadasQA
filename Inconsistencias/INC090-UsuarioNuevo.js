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

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let eliminarRegistroDesdeGrid = HelpersHappgi.eliminarRegistroDesdeGrid;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirHerramientas = esHgi360(config) ? h.abrirHerramientas360 : h.abrirHerramientas;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    eliminarRegistroDesdeGrid = h.eliminarRegistroDesdeGrid;
    ingresarAplicacion = h.ingresarAplicacion;
};

const USUARIO_NUEVO = 'UsuarioNuevo1';
const NOMBRE_USUARIO = 'PruebaUsuarioNuevo1';
const CLAVE_USUARIO = 'Calidad2026*';
const EMAIL_USUARIO = 'cvasquez@hgi.com';
const VENDEDOR_USUARIO = '01 - 01 Vendedor 01';

async function abrirUsuarios(t, config) {
    await abrirHerramientas(t, esHgi360(config) ? 'Usuarios' : 'USUARIOS');
}

fixture `Prueba Usuario Nuevo INC090 testHGI360 Admin`
    .page(testAdminConfig.pagina);

test('INC090 - Crear usuario nuevo', async t => {
    usarHelpersDe(testAdminConfig);
    await ingresarAplicacion(t, testAdminConfig);
    await abrirUsuarios(t, testAdminConfig);

    await t
        .typeText('#gridUsuarios .dx-texteditor-input', USUARIO_NUEVO)
        .wait(2000);

    if (await Selector('#gridUsuarios td').withText(USUARIO_NUEVO).exists) {
        await eliminarRegistroDesdeGrid(t, '#gridUsuarios');
        await t.wait(3000);
    }

    await t
        .click('#gridUsuarios .dx-icon.dx-icon-add')
        .typeText('#StrIdUsuario', USUARIO_NUEVO)
        .typeText('#Gestion_Usuario_Nombre', NOMBRE_USUARIO)
        .typeText('#txtUsuarios_StrMail .dx-texteditor-input', EMAIL_USUARIO)
        .click('#Usuarios_Vendedor .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(VENDEDOR_USUARIO))
        .click('#txtUsuarios_StrClave_cursor_')
        .typeText('#txtUsuarios_StrClave_cursor_', CLAVE_USUARIO)
        .click('#txtUsuario_Activo .dx-checkbox-icon')
        .maximizeWindow()
        .wait(3000)
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .wait(3000)
        .expect(Selector('#gridUsuarios td').withText(USUARIO_NUEVO).exists).ok()
        .switchToMainWindow();

    await cerrarSesion(t);
});

test('INC090 - Ingreso con usuario nuevo en WMS', async t => {
    usarHelpersDe(testAdminConfig);
    await ingresarAplicacion(t, {
        ...testAdminConfig,
        usuario: USUARIO_NUEVO,
        clave: CLAVE_USUARIO,
    });
    await t
        .expect(Selector('#contenido_SeleccionModulo_HGI360 h4').withText('Seleccione el módulo de ingreso').visible).ok()
        .expect(Selector('#ContenedorCardsModulos_HGI360 div').withText('WMS').nth(1).visible).ok()
        .click(Selector('#ContenedorCardsModulos_HGI360 div').withText('WMS').nth(1))
        .click(Selector('#BtnContinuarSeleccionModulo_HGI360 div').withText('Ingresar'))
        .wait(5000)
        .expect(Selector('#navbar-mobile span').withText('WMS').visible).ok()
        .switchToMainWindow();

    await cerrarSesion(t);
});

test('INC090 - Eliminar usuario nuevo', async t => {
    usarHelpersDe(testAdminConfig);
    await ingresarAplicacion(t, testAdminConfig);
    await abrirUsuarios(t, testAdminConfig);

    await t
        .typeText(Selector('.dx-texteditor-input-container .dx-texteditor-input'), USUARIO_NUEVO)
        .wait(3000);
    await eliminarRegistroDesdeGrid(t, '#gridUsuarios');
    await t
        .wait(2000)
        .expect(Selector('[class^="dx-overlay-content dx-toast-success dx-toast-content"] div')
            .withText('Registro eliminado con éxito').visible).ok()
        .switchToMainWindow();

    await cerrarSesion(t);
});
