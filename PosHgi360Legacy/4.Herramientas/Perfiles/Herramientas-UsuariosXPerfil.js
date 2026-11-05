import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    selectorOpcion,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const PERFIL = '0001 - MiNuevaDescPerfilQA2';
const USUARIO = 'H11';
const USUARIO_TEXTO = 'H11 - H11';
const FILTRO_USUARIO = 'h11';

fixture `Prueba Herramientas Permisos Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - Usuarios x Perfil - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Usuarios X Perfil');
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
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(9000);
   //Eliminar Usuario x Perfil

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
        .click(Selector('button').withText('Aceptar').nth(1))
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

test('Prueba Permisos desde pestaña Usuario - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Usuarios X Perfil');
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
             .click(Selector('button').withText('Aceptar').nth(1))
        }
        await t.wait(3000)
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Herramientas Permisos Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - Usuarios x Perfil - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Usuarios X Perfil');
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
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(9000);
   //Eliminar Usuario x Perfil

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
        .click(Selector('button').withText('Aceptar').nth(1))
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

test('Prueba Permisos desde pestaña Usuario - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Usuarios X Perfil');
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
             .click(Selector('button').withText('Aceptar').nth(1))
        }
        await t.wait(3000)
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
