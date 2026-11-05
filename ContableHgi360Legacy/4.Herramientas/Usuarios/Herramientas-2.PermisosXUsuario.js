import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const USUARIO_TEXTO = 'MiUsuarioQA - NombreMiUsuarioQA';
const TRANSACCION = 'FACTURA DE VENTA ELECTRÓNICA';
const GENERAL = 'General';


async function ejecutarPruebaHerramientas2PermisosXUsuario(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'PERMISOS X USUARIO');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .wait(2000)
            .click('#txt_lista_UsuariosPermisos_Usuario .dx-lookup-field')
            .pressKey('m')
            .pressKey('i')
            .wait(2000)
            //.click(Selector('.dx-texteditor-input-container').nth(12).find('.dx-texteditor-input'))
            //.typeText((Selector('.dx-texteditor-input-container').nth(12).find('.dx-texteditor-input')),'miusuario')
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
            //adicionales
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
            .click(Selector('button').withText('Aceptar').nth(1));
            //
            
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'PERMISOS X USUARIO');
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
            .click(Selector('button').withText('Aceptar').nth(1));
            //
            
        await cerrarPestana360(t);
        await abrirHerramientas(t, 'PERMISOS X USUARIO');
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
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(3000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-2.PermisosXUsuario - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba crear permisos x usuario - Mi ERP', async t => {
    await ejecutarPruebaHerramientas2PermisosXUsuario(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-2.PermisosXUsuario - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba crear permisos x usuario - Test Contable', async t => {
    await ejecutarPruebaHerramientas2PermisosXUsuario(t, testContableConfig, ingresarAplicacion);
});
