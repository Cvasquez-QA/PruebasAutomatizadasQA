import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const PERFIL = '0001 - MiNuevaDescPerfilQA2';
const USUARIO_H11_CODIGO = 'H11';
const USUARIO_H11 = 'H11 - H11';
const USUARIO_H21_CODIGO = 'h21';
const USUARIO_H21 = 'H21 - PRUEBA 21';

async function ejecutarPruebaUsuariosPorPerfil(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'USUARIOS X PERFIL');
    await t
        .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
        ;
    await seleccionarOpcion(t, PERFIL);
    await t
        .click('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow')
        //.click(Selector('#gridUsuariosPerfil .dx-texteditor-input').nth(2))
        .click(Selector('#gridUsuariosPerfil .dx-dropdowneditor-icon').nth(2))
        .wait(6000)
        ;
    await seleccionarOpcion(t, USUARIO_H11_CODIGO);
    await t
        .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .wait(3000)
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(3000);
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'USUARIOS X PERFIL');
    await t
//Editar Usuario x Perfil (Desmarcar casilla Activado)
        .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
        ;
    await seleccionarOpcion(t, PERFIL);
    await t
        .click('#gridUsuariosPerfil .dx-texteditor-input')
        .wait(9000)
        ;
    await seleccionarOpcion(t, USUARIO_H11);
    await t
        .wait(9000)
        .click('#gridUsuariosPerfil .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon')
        .click('#gridUsuariosPerfil .dx-checkbox-icon')
        .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(9000);
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'USUARIOS X PERFIL');
    await t
   //Eliminar Usuario x Perfil
        .click('#txtUsuariosPerfil_Perfil .dx-lookup-field')
        ;
    await seleccionarOpcion(t, PERFIL);
    await t
        .click('#gridUsuariosPerfil .dx-texteditor-input')
        .wait(3000)
        ;
    await seleccionarOpcion(t, USUARIO_H11);
    await t
        .wait(3000)
        .click('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .click(Selector('span').withText('Sí'))
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarSesion360(t);
}


//Prueba desde la pestaña de Usuario
async function ejecutarPruebaDesdePestanaUsuario(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'USUARIOS X PERFIL');
    await t
        .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radiobutton-icon').nth(1))
        .click('#txtUsuariosPerfil_Usuario .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), USUARIO_H11_CODIGO)
        .wait(200)
        //.typeText('#dx-3518c198-da9e-c5ad-5bbe-8b0b6875c5a8 .dx-texteditor-input', 'h11')
        ;
    await seleccionarOpcion(t, USUARIO_H11);
    
        const existePerfil = await Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(PERFIL).nth(8).exists;
        if (!existePerfil) {
            await t
            .click('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow')
            .click(Selector('#gridUsuariosPerfil .dx-texteditor-input').nth(2))
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000);
            await cerrarPestana360(t);
            await abrirHerramientas(t, 'USUARIOS X PERFIL');
            await t
             //Borrar perfil de un Usuario
            .wait(2000)
            .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radio-value-container').nth(1))
            .click('#txtUsuariosPerfil_Usuario .dx-lookup-field')
            .wait(2000)
            ;
    await seleccionarOpcion(t, USUARIO_H11);
    await t
            .wait(2000)
            .click('#gridUsuariosPerfil .dx-texteditor-input')
            .click(Selector('div').withText(PERFIL).nth(27))
             .click('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
             .click(Selector('div').withText('Sí').nth(9))
             .click(Selector('button').withText('Aceptar').nth(1))
        }
        await cerrarPestana360(t);
        await t.wait(3000);
        await cerrarSesion360(t);
}



async function ejecutarPruebaDesdePestanaUsuario2(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'USUARIOS X PERFIL');
    await t
        .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radiobutton-icon').nth(1))
        .click('#txtUsuariosPerfil_Usuario .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), USUARIO_H21_CODIGO)
        .wait(200)
        //.typeText('#dx-3518c198-da9e-c5ad-5bbe-8b0b6875c5a8 .dx-texteditor-input', 'h11')
        ;
    await seleccionarOpcion(t, USUARIO_H21);
    await t
        .wait(2000)
        .click('#gridUsuariosPerfil .dx-dropdowneditor-icon')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#gridUsuariosPerfil .dx-texteditor-input', PERFIL)
        .wait(2000)
        const existePerfil = await Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(PERFIL).nth(8).exists;
        if (existePerfil) {
            await t
             .click('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
             .click(Selector('div').withText('Sí').nth(9))
             .click(Selector('button').withText('Aceptar').nth(1))
        }
        await t
            //Se crea nuevamente
            .click('#gridUsuariosPerfil .dx-icon.dx-icon-edit-button-addrow')
            .click(Selector('#gridUsuariosPerfil .dx-texteditor-input').nth(2))
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .click('#gridUsuariosPerfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000);
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'USUARIOS X PERFIL');
        await t
             //Borrar perfil de un Usuario
            .wait(2000)
            .click(Selector('#txtUsuariosPerfil_Perfil_Usuario .dx-radio-value-container').nth(1))
            .click('#txtUsuariosPerfil_Usuario .dx-lookup-field')
            .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), USUARIO_H21_CODIGO)
            .wait(2000)
            ;
    await seleccionarOpcion(t, USUARIO_H21);
    await t
            .wait(2000)
            .click('#gridUsuariosPerfil .dx-texteditor-input')
            .click(Selector('div').withText(PERFIL).nth(27))
             .click('#gridUsuariosPerfil .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
             .click(Selector('div').withText('Sí').nth(9))
             .click(Selector('button').withText('Aceptar').nth(1));

        await cerrarPestana360(t);
        await t.wait(3000);
        await cerrarSesion360(t);
}

fixture('Usuarios por perfil Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Usuarios x Perfil CRUD', async t => {
    await ejecutarPruebaUsuariosPorPerfil(t, miNominaConfig, ingresarAplicacion);
});

test('Mi Hgi360 - Prueba desde la pestaña de Usuario', async t => {
    await ejecutarPruebaDesdePestanaUsuario(t, miNominaConfig, ingresarAplicacion);
});

test('Mi Hgi360 - Prueba desde la pestaña de Usuario 2', async t => {
    await ejecutarPruebaDesdePestanaUsuario2(t, miNominaConfig, ingresarAplicacion);
});

fixture('Usuarios por perfil Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Usuarios x Perfil CRUD', async t => {
    await ejecutarPruebaUsuariosPorPerfil(t, testNominaConfig, ingresarAplicacion);
});

test('Test Hgi360 - Prueba desde la pestaña de Usuario', async t => {
    await ejecutarPruebaDesdePestanaUsuario(t, testNominaConfig, ingresarAplicacion);
});

test('Test Hgi360 - Prueba desde la pestaña de Usuario 2', async t => {
    await ejecutarPruebaDesdePestanaUsuario2(t, testNominaConfig, ingresarAplicacion);
});
