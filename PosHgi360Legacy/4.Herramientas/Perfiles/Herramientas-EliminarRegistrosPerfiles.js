import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_PERFIL = '0001';

fixture `Prueba Herramientas Perfiles Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - Eliminar Registros - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
        .wait(3000)
        .expect(Selector('#gridPerfiles td').withText(CODIGO_PERFIL).exists).ok('El perfil no existe');
    await eliminarRegistroDesdeGrid(t, '#gridPerfiles');

        await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Herramientas Perfiles Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - Eliminar Registros - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
        .wait(3000)
        .expect(Selector('#gridPerfiles td').withText(CODIGO_PERFIL).exists).ok('El perfil no existe');
    await eliminarRegistroDesdeGrid(t, '#gridPerfiles');

        await cerrarPestana360(t);
    await cerrarSesion360(t);
});
