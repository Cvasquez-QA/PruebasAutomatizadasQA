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

const USUARIO_CODIGO = 'MiUsuarioQA';
const USUARIO = 'MiUsuarioQA - NombreMiUsuarioQA';
const OPCION_EXTRA = 'VALIDACIÓN CAMPOS';
const GRUPO_GENERAL = 'General';

const activarPermisoSiEsNecesario = async (t, selectorPermiso) => {
    if (await Selector(selectorPermiso).getAttribute('aria-checked') === 'false') {
        await t.click(`${selectorPermiso} .dx-checkbox-icon`);
    }
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'PERMISOS X USUARIO');
    await t
        .click('#UsuariosPermisos_Usuario .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), USUARIO_CODIGO)
        ;
    await seleccionarOpcion(t, USUARIO);
    await t
        .doubleClick('#Consultar_25 .dx-checkbox-icon')
        .wait(2000)
        .click('#Editar_25 .dx-checkbox-icon')
        .wait(2000)
        .click('#Crear_25 .dx-checkbox-icon');
    await activarPermisoSiEsNecesario(t, '#Consultar_25');
    await activarPermisoSiEsNecesario(t, '#Editar_25');
    await activarPermisoSiEsNecesario(t, '#Crear_25');
    await activarPermisoSiEsNecesario(t, '#Eliminar_25');
    await activarPermisoSiEsNecesario(t, '#Anular_25');
    await activarPermisoSiEsNecesario(t, '#Imprimir_25');
    await activarPermisoSiEsNecesario(t, '#Gestion_25');
    await activarPermisoSiEsNecesario(t, '#Servicios_25');
    await t
        .wait(2000)
        .click('#tabs_UsuariosPermisos_extras')
        if(await Selector('#grid_opc_extras_usuario .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon').exists){
            await t
            .click('#grid_opc_extras_usuario .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
            .click(Selector('div').withText('Sí').nth(9))
        }
        
        //.typeText(Selector('#grid_opc_extras_usuario .dx-texteditor-input').nth(10), '25')
        //.click(Selector('div').withText('25 - VALIDACIÓN CAMPOS').nth(9))
    await t
        .click('#grid_opc_extras_usuario .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#grid_opc_extras_usuario .dx-dropdowneditor-icon').nth(10))
        ;
    await seleccionarOpcion(t, OPCION_EXTRA);
    await t
        .click('#grid_opc_extras_usuario .dx-checkbox-icon')
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(1))
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(2))
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(3))
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(4))
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(5))
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(6))
        .click(Selector('#grid_opc_extras_usuario .dx-checkbox-icon').nth(7))
        .click(Selector('#grid_opc_extras_usuario [class^="dx-widget dx-button-mode-contained dx-button-norma"]').nth(11))
        ;
    await seleccionarOpcion(t, GRUPO_GENERAL);
    await t
        .click('#grid_opc_extras_usuario .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .click(Selector('#BtnGuardarPermisosUsuario span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000);
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'PERMISOS X USUARIO');
    await t
    //Se valida que se hayan dado los permisos
        .click('#UsuariosPermisos_Usuario .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), USUARIO_CODIGO)
        ;
    await seleccionarOpcion(t, USUARIO);
    await t
        .expect(Selector('#grid_opc_extras_usuario td').withText(OPCION_EXTRA).exists).ok('no se guardaron los datos')
        .click(Selector('#tabs_UsuariosPermisos_geneal'))
        .wait(2000)
         .expect(Selector('#Consultar_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .expect(Selector('#Editar_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .expect(Selector('#Crear_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .expect(Selector('#Eliminar_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .expect(Selector('#Anular_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .expect(Selector('#Imprimir_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .expect(Selector('#Gestion_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        //.expect(Selector('#Servicios_25').getAttribute('aria-checked')).eql('true','El sistema no guardó el cambio')
        .wait(3000);
    await cerrarSesion360(t);
}

fixture('Permisos por usuario Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Permisos x Usuario CRUD', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture('Permisos por usuario Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Permisos x Usuario CRUD', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
