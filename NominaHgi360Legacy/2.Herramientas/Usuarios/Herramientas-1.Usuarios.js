import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const USUARIO_CODIGO = 'MiUsuarioQA';
const USUARIO_NOMBRE = 'NombreMiUsuarioQA';
const USUARIO_CORREO = 'MICORREO@gmail.COM';
const USUARIO_CLAVE = '123';
const VENDEDOR_GENERAL = '0 - GENERAL';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'USUARIOS');
    await t
        .wait(3000)
        .typeText('#gridUsuarios .dx-texteditor-input', USUARIO_CODIGO)
        .wait(3000);
    const existeUsuario = await Selector('#gridUsuarios td').withText(USUARIO_CODIGO).exists;
    if (existeUsuario) {
        await eliminarRegistroDesdeGrid(t, '#gridUsuarios');
    }
    await t
        .wait(2000)
        //Se crea el usuario
        .click('#gridUsuarios .dx-icon.dx-icon-add')
        .typeText('#StrIdUsuario', USUARIO_CODIGO)
        .typeText('#Gestion_Usuario_Nombre', USUARIO_NOMBRE)
        .typeText('#txtUsuarios_StrMail .dx-texteditor-input', USUARIO_CORREO)
        .click('#txtUsuario_Activo .dx-checkbox-icon')
        .click('#Usuarios_Vendedor .dx-lookup-field')
        ;
    await seleccionarOpcion(t, VENDEDOR_GENERAL);
    await t
        .typeText('#txtUsuarios_StrClave_cursor_', USUARIO_CLAVE)
        .click(Selector('#BtnGuardarUsuario div').withText('Guardar'))
        .wait(3000);
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'USUARIOS');
    await t
        //Se consulta
        .wait(3000)
        .click(Selector('.dx-texteditor-input-container .dx-texteditor-input'))
        .typeText('#gridUsuarios .dx-texteditor-input', USUARIO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridUsuarios td').withText(USUARIO_CODIGO).exists).ok()
        //Se edita
        .click(Selector('#gridUsuarios [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000)
        .click('#txtUsuarios_StrMail .dx-texteditor-input')
        .typeText('#txtUsuarios_StrMail .dx-texteditor-input', '.co')
        .click(Selector('#BtnGuardarUsuario span').withText('Guardar'))
        .wait(2000);
    await cerrarPestana360(t);
        /*
        //Se elimina
        await abrirHerramientas(t, 'USUARIOS');
        await t
        .wait(3000)
        .typeText('#gridUsuarios .dx-texteditor-input', 'MiUsuarioQA')
        .wait(3000);
    await eliminarRegistroDesdeGrid(t, '#gridUsuarios');
        */
    await cerrarSesion360(t);
}

fixture('Usuarios Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Usuario CRUD', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture('Usuarios Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Usuario CRUD', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
