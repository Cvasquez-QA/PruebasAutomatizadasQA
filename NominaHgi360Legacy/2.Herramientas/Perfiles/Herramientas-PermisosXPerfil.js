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
const PERFIL_DESCRIPCION = 'MiNuevaDescPerfilQA2';
const OPCION_EXTRA = 'VALIDACIÓN CAMPOS';
const GRUPO_GENERAL = 'General';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'PERMISOS X PERFIL');
    await t
        .wait(3000)
        .click('#PermisosPerfil_Perfil .dx-lookup-field')
        ;
    await seleccionarOpcion(t, PERFIL);
    await t
        .wait(2000)
        .click('#Consultar_25 .dx-checkbox-icon')
        .click('#Editar_25 .dx-checkbox-icon')
        .click('#Crear_25 .dx-checkbox-icon')
        .click('#Eliminar_25 .dx-checkbox-icon')
        .click('#Imprimir_25 .dx-checkbox-icon')
        .click('#tabs_PerfilPermisos_extras')
        .click('#grid_opc_extras_perfil .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#grid_opc_extras_perfil .dx-dropdowneditor-icon').nth(10))
        ;
    await seleccionarOpcion(t, OPCION_EXTRA);
    await t
        .click('#grid_opc_extras_perfil .dx-checkbox-icon')
        .click(Selector('#grid_opc_extras_perfil .dx-checkbox-icon').nth(1))
        .click(Selector('#grid_opc_extras_perfil .dx-checkbox-icon').nth(2))
        .click(Selector('#grid_opc_extras_perfil .dx-checkbox-icon').nth(3))
        .click(Selector('#grid_opc_extras_perfil .dx-checkbox-icon').nth(5))
        .click(Selector('#grid_opc_extras_perfil .dx-texteditor-input').nth(11))
        ;
    await seleccionarOpcion(t, GRUPO_GENERAL);
    await t
        .click('#grid_opc_extras_perfil .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .click(Selector('#BtnGuardarPermisosPerfil div').withText('Guardar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000);
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'PERMISOS X PERFIL');
    await t
        .click('#PermisosPerfil_Perfil .dx-lookup-field')
        ;
    await seleccionarOpcion(t, PERFIL);
    await t
        .click(Selector('#TabsMenu div').withText(PERFIL_DESCRIPCION).nth(3));
    await cerrarSesion360(t);
}

fixture('Permisos por perfil Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Permisos x Perfil CRUD', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture('Permisos por perfil Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Permisos x Perfil CRUD', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
