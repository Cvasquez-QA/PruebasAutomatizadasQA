import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, filtrarPor, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi, selectorOpcion } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const PERFIL = '0001 - MiNuevaDescPerfilQA2';
const USUARIO = 'H11';
const USUARIO_TEXTO = 'H11 - H11';
const FILTRO_USUARIO = 'h11';


async function ejecutarPruebaHerramientasUsuariosXPerfil1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'USUARIOS X PERFIL');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .click('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow')
            //.click(Selector('#gridUsuariosPerfil .dx-texteditor-input').nth(2))
            .click(Selector('#gridUsuariosPerfil .dx-dropdowneditor-icon').nth(2))
            .wait(6000)
            ;
    await seleccionarOpcion(t, USUARIO);
    await t
            .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .wait(3000)
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(3000);
    //Editar Usuario x Perfil (Desmarcar casilla Activado)
            
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'USUARIOS X PERFIL');
        await t
            .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .click('#gridUsuariosPerfil .dx-texteditor-input')
            .wait(9000)
            ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
    await t
            .wait(9000)
            .click('#gridUsuariosPerfil .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon')
            .click('#gridUsuariosPerfil .dx-checkbox-icon')
            .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(9000);
       //Eliminar Usuario x Perfil
            
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'USUARIOS X PERFIL');
        await t
            .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .click('#gridUsuariosPerfil .dx-texteditor-input')
            .wait(3000)
            ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
    await t
            .wait(3000)
            .click('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
            .click(Selector('span').withText('Sí'))
            .click(Selector('button').withText('Aceptar').nth(1))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaHerramientasUsuariosXPerfil2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'USUARIOS X PERFIL');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radiobutton-icon').nth(1))
            .click('#txtUsuariosPerfil_Usuario .dx-lookup-field');
            
            await filtrarPor(t, FILTRO_USUARIO);
            await t
            .wait(200)
            //.typeText('#dx-3518c198-da9e-c5ad-5bbe-8b0b6875c5a8 .dx-texteditor-input', FILTRO_USUARIO)
            ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
                var existePerfil = selectorOpcion(PERFIL).exists;
            if(!existePerfil){
                await t
            .click('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow')
                .click(Selector('#gridUsuariosPerfil .dx-texteditor-input').nth(2))
                ;
    await seleccionarOpcion(t, PERFIL);
    await t
                .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
                .click(Selector('button').withText('Aceptar').nth(1))
                .wait(2000);
                 //Borrar perfil de un Usuario
                
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'USUARIOS X PERFIL');
        await t
            .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radio-value-container').nth(1))
                .click('#txtUsuariosPerfil_Usuario .dx-lookup-field')
                .wait(2000)
                ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
    await t
                .wait(2000)
                .click('#gridUsuariosPerfil .dx-texteditor-input')
                ;
    await seleccionarOpcion(t, PERFIL);
    await t
                 .click('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
                 .click(Selector('div').withText('Sí').nth(9))
                 .click(Selector('button').withText('Aceptar').nth(1))
            }
            await t.wait(3000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-UsuariosXPerfil - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Herramientas - Usuarios x Perfil - Mi ERP', async t => {
    await ejecutarPruebaHerramientasUsuariosXPerfil1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Permisos desde pestaña Usuario - Mi ERP', async t => {
    await ejecutarPruebaHerramientasUsuariosXPerfil2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-UsuariosXPerfil - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Herramientas - Usuarios x Perfil - Test Contable', async t => {
    await ejecutarPruebaHerramientasUsuariosXPerfil1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Permisos desde pestaña Usuario - Test Contable', async t => {
    await ejecutarPruebaHerramientasUsuariosXPerfil2(t, testContableConfig, ingresarAplicacion);
});
