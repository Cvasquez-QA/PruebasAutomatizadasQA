import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, eliminarRegistroSiExiste, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO_USUARIO = 'MiUsuarioQA';
const NOMBRE = 'NombreMiUsuarioQA';
const CORREO = 'MICORREO@gmail.COM';
const CORREO_SUFIJO_EDIT = '.co';
const VENDEDOR = '0 - GENERAL';
const CLAVE = '123';


async function ejecutarPruebaHerramientas1Usuarios(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'USUARIOS');
        await eliminarRegistroSiExiste(t, '#gridUsuarios', CODIGO_USUARIO);
        await t
            .wait(2000)
            //Se crea el usuario
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
            //Se consulta 
            
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'USUARIOS');
        await t
            .click(Selector('.dx-texteditor-input-container .dx-texteditor-input'))
            .typeText('#gridUsuarios .dx-texteditor-input', CODIGO_USUARIO)
            .wait(3000)
            .expect(Selector('#gridUsuarios td').withText(CODIGO_USUARIO).exists).ok()
            //Se edita
            .click(Selector('#gridUsuarios [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(2000)
            .click('#txtUsuarios_StrMail .dx-texteditor-input')
            .typeText('#txtUsuarios_StrMail .dx-texteditor-input', CORREO_SUFIJO_EDIT)
            .click(Selector('#BtnGuardarUsuario span').withText('Guardar'))
            .wait(2000);
            /*
            //Se elimina 
            
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'USUARIOS');
        await t
            .typeText('#gridUsuarios .dx-texteditor-input', CODIGO_USUARIO)
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridUsuarios');
            */
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-1.Usuarios - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Usuarios - Mi ERP', async t => {
    await ejecutarPruebaHerramientas1Usuarios(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-1.Usuarios - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Usuarios - Test Contable', async t => {
    await ejecutarPruebaHerramientas1Usuarios(t, testContableConfig, ingresarAplicacion);
});
