import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const PERFIL = '0001 - MiNuevaDescPerfilQA2';


async function ejecutarPruebaHerramientasPermisosXPerfil(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'PERMISOS X PERFIL');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .wait(3000)
            .click('#PermisosPerfil_Perfil .dx-lookup-field')
            ;
    await seleccionarOpcion(t, PERFIL);
    await t
            .wait(3000)
            //
            .click(Selector('#treeListOpcionesPermisosPerfil .dx-treelist-empty-space.dx-treelist-collapsed'))
            //.click(Selector('#treeListOpcionesPermisosPerfil div div').nth(16).find('div div div div table tbody tr td div div span'))
            .click('#Consultar_23 .dx-checkbox-icon')
            .click('#Editar_23101 .dx-checkbox-icon')
            .click('#Crear_23102 .dx-checkbox-icon')
            .click('#Eliminar_231023 .dx-checkbox-icon')
            .click('#Anular_23103 .dx-checkbox-icon')
            .click('#Imprimir_23104 .dx-checkbox-icon')
            .click('#Gestion_23105 .dx-checkbox-icon')
            .click('#Servicios_23106 .dx-checkbox-icon')
            //.click('#Servicios_23500 .dx-checkbox-icon')
            .click(Selector('#BtnGuardarPermisosPerfil span').withText('Guardar'))
            .click(Selector('button').withText('Aceptar').nth(1))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-PermisosXPerfil - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Herramientas - Permisos x Perfil - Mi ERP', async t => {
    await ejecutarPruebaHerramientasPermisosXPerfil(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-PermisosXPerfil - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Herramientas - Permisos x Perfil - Test Contable', async t => {
    await ejecutarPruebaHerramientasPermisosXPerfil(t, testContableConfig, ingresarAplicacion);
});
