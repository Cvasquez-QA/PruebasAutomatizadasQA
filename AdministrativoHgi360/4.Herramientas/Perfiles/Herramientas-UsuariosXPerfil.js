import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    selectorOpcion
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const PERFIL = '0001 - MiNuevaDescPerfilQA2';
const USUARIO = 'H11';
const USUARIO_TEXTO = 'H11 - H11';
const FILTRO_USUARIO = 'h11';

async function ejecutarPruebaUsuariosXPerfil(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Usuarios X Perfil');
        await t
            .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .click('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow')
            .click(Selector('#gridUsuariosPerfil .dx-dropdowneditor-icon').nth(2))
            .wait(6000)
            ;
    await seleccionarOpcion(t, USUARIO);
    await t
            .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .wait(3000)
            .click(Selector('button').withText('Aceptar'))
            .wait(3000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Usuarios X Perfil');
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
            .click(Selector('button').withText('Aceptar'))
            .wait(9000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Usuarios X Perfil');
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
            .click(Selector('button').withText('Aceptar'))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaPermisosDesdePestaAUsuario(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Usuarios X Perfil');
        await t
            .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radiobutton-icon').nth(1))
            .click('#txtUsuariosPerfil_Usuario .dx-lookup-field');
    
            await filtrarPor(t, FILTRO_USUARIO);
            await t
            .wait(200)
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
                .click(Selector('button').withText('Aceptar'))
                .wait(2000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Usuarios X Perfil');
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
                 .click(Selector('button').withText('Aceptar'))
            }
            await t.wait(3000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Herramientas Permisos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Herramientas - Usuarios x Perfil - Test Hgi360', async t => {
    await ejecutarPruebaUsuariosXPerfil(t, testAdminConfig, ingresarAplicacion);
});

test('Prueba Permisos desde pestaña Usuario - Test Hgi360', async t => {
    await ejecutarPruebaPermisosDesdePestaAUsuario(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Herramientas Permisos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Herramientas - Usuarios x Perfil - Hgi360 Admin', async t => {
    await ejecutarPruebaUsuariosXPerfil(t, hgiAdminConfig, ingresarAplicacion);
});

test('Prueba Permisos desde pestaña Usuario - Hgi360 Admin', async t => {
    await ejecutarPruebaPermisosDesdePestaAUsuario(t, hgiAdminConfig, ingresarAplicacion);
});
