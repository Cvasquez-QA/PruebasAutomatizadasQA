import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO_USUARIO = 'MiUsuarioQA';
const NOMBRE = 'NombreMiUsuarioQA';
const CORREO = 'MICORREO@gmail.COM';
const CORREO_SUFIJO_EDIT = '.co';
const VENDEDOR = '0 - GENERAL';
const CLAVE = '123';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Usuarios');
        await eliminarRegistroSiExiste(t, '#gridUsuarios', CODIGO_USUARIO);
        await t
            .wait(2000)
            .click('#gridUsuarios .dx-icon.dx-icon-add')
            .typeText('#StrIdUsuario', CODIGO_USUARIO)
            .typeText('#Gestion_Usuario_Nombre', NOMBRE)
            .typeText('#txtUsuarios_StrMail .dx-texteditor-input', CORREO)
            .click('#txtUsuario_Activo .dx-checkbox-icon')
            .click('#Usuarios_Vendedor .dx-lookup-field')
            ;
    await seleccionarOpcion(t, VENDEDOR);
    await t
            .typeText('#txtUsuarios_StrClave_cursor_', CLAVE)
            .click(Selector('#BtnGuardarUsuario div').withText('Guardar'))
            .wait(3000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Usuarios');
        await t
            .click(Selector('.dx-texteditor-input-container .dx-texteditor-input'))
            .typeText('#gridUsuarios .dx-texteditor-input', CODIGO_USUARIO)
            .wait(3000)
            .expect(Selector('#gridUsuarios td').withText(CODIGO_USUARIO).exists).ok()
            .click(Selector('#gridUsuarios [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(2000)
            .click('#txtUsuarios_StrMail .dx-texteditor-input')
            .typeText('#txtUsuarios_StrMail .dx-texteditor-input', CORREO_SUFIJO_EDIT)
            .click(Selector('#BtnGuardarUsuario span').withText('Guardar'))
            .wait(2000);
            /*
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Usuarios');
        await t
            .typeText('#gridUsuarios .dx-texteditor-input', CODIGO_USUARIO)
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridUsuarios');
            */
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Usuarios - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Usuarios - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Usuarios - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Usuarios - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
