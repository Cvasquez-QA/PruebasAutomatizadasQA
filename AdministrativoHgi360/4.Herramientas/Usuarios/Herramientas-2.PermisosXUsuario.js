import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const USUARIO_TEXTO = 'MiUsuarioQA - NombreMiUsuarioQA';
const TRANSACCION = 'FACTURA DE VENTA ELECTRÓNICA';
const GENERAL = 'General';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Permisos X Usuario');
        await t
            .wait(2000)
            .click('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field')
            .pressKey('m')
            .pressKey('i')
            .wait(2000)
            ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
    await t
            .click(Selector('#treeListOpcionesPermisos .dx-treelist-empty-space.dx-treelist-collapsed'))
            .click('#Consultar_23 .dx-checkbox-icon')
            .click('#Editar_23101 .dx-checkbox-icon')
            .click('#Crear_23102 .dx-checkbox-icon')
            .click('#Eliminar_231023 .dx-checkbox-icon')
            .click('#Anular_23103 .dx-checkbox-icon')
            .click('#Imprimir_23104 .dx-checkbox-icon')
            .click('#Gestion_23105 .dx-checkbox-icon')
            .click('#Servicios_23106 .dx-checkbox-icon')
            .wait(2000)
            .click('#tabs_UsuariosPermisos_extras')
            .click('#grid_opc_extras_usuario .dx-icon.dx-icon-edit-button-addrow')
            .click(Selector('#grid_opc_extras_usuario .dx-dropdowneditor-icon').nth(10))
            ;
    await seleccionarOpcion(t, TRANSACCION);
    await t
            .click('#grid_opc_extras_usuario .dx-checkbox-icon')
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(1))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(2))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(3))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(4))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(5))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(6))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(7))
            .click(Selector('#grid_opc_extras_usuario .dx-dropdowneditor-icon').nth(11))
            ;
    await seleccionarOpcion(t, GENERAL);
    await t
            .click('#grid_opc_extras_usuario .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .wait(2000)
            .click(Selector('#BtnGuardarPermisosUsuario span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'));
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Permisos X Usuario');
        await t
            .click('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field')
            .pressKey('m')
            .pressKey('i')
            .wait(2000)
            ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
    await t
            .click('#tabs_UsuariosPermisos_extras')
            .click('#tabs_UsuariosPermisos_content_extras .nav.nav-tabs')
            .pressKey('enter')
            .click('#grid_opc_extras_usuario .dx-link.dx-link-edit.dx-icon-edit.dx-link-icon')
            .click('#grid_opc_extras_usuario .dx-checkbox-icon')
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(1))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(2))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(3))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(4))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(5))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(6))
            .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(7))
            .click('#grid_opc_extras_usuario .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
            .click(Selector('#BtnGuardarPermisosUsuario span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'));
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Permisos X Usuario');
        await t
            .click('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field')
            .pressKey('m')
            .pressKey('i')
            .wait(2000)
            ;
    await seleccionarOpcion(t, USUARIO_TEXTO);
    await t
            .click('#tabs_UsuariosPermisos_extras')
            .click('#tabs_UsuariosPermisos_content_extras .nav.nav-tabs')
            .pressKey('enter')
            .click('#grid_opc_extras_usuario .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
            .click(Selector('span').withText('Sí'))
            .click(Selector('#BtnGuardarPermisosUsuario span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(3000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Permisos x Usuario - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba crear permisos x usuario - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Permisos x Usuario - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba crear permisos x usuario - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
