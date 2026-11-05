import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const PERFIL = '0001 - MiNuevaDescPerfilQA2';

fixture `Prueba Herramientas Permisos Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - Permisos x Perfil - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Permisos X Perfil');
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
});

fixture `Prueba Herramientas Permisos Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - Permisos x Perfil - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Permisos X Perfil');
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
});
