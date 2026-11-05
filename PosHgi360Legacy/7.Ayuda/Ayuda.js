import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
    abrirAyuda360,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

fixture `Prueba Ayuda testerp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Redireccionamiento canal de Youtube testerp - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirAyuda360(t, 'Canal Youtube');
    await t
        .wait(12000)
        .expect(Selector('#page-header [class^="yt-core-attributed-string yt-core-attributed-strin"]').exists)
        .ok('No se dirigió al canal de youtube de Happgi')
        .closeWindow();
    await cerrarSesion360(t);
});

test('Prueba Conexion Remota testerp - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirAyuda360(t, 'Soporte Remoto');
    await t
        .wait(5000)
        .switchToWindow()
        .expect(Selector('h3').withText('Términos y condiciones para la conexión remota').exists)
        .ok('No se dirigió al Apartado de Soporte Remoto de Happgi')
        .closeWindow();
    await cerrarSesion360(t);
});

test('Prueba Documentacion - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirAyuda360(t, 'Documentación');
    await t
        .wait(8000)
        .expect(Selector('main h1').withText('Centro de ayuda Happgi').exists)
        .ok('No se dirigió al Centro de ayuda Happgi')
        .closeWindow();
    await cerrarSesion360(t);
});

fixture `Prueba Ayuda testerp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Redireccionamiento canal de Youtube testerp - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirAyuda360(t, 'Canal Youtube');
    await t
        .wait(12000)
        .expect(Selector('#page-header [class^="yt-core-attributed-string yt-core-attributed-strin"]').exists)
        .ok('No se dirigió al canal de youtube de Happgi')
        .closeWindow();
    await cerrarSesion360(t);
});

test('Prueba Conexion Remota testerp - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirAyuda360(t, 'Soporte Remoto');
    await t
        .wait(5000)
        .switchToWindow()
        .expect(Selector('h3').withText('Términos y condiciones para la conexión remota').exists)
        .ok('No se dirigió al Apartado de Soporte Remoto de Happgi')
        .closeWindow();
    await cerrarSesion360(t);
});

test('Prueba Documentacion - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirAyuda360(t, 'Documentación');
    await t
        .wait(8000)
        .expect(Selector('main h1').withText('Centro de ayuda Happgi').exists)
        .ok('No se dirigió al Centro de ayuda Happgi')
        .closeWindow();
    await cerrarSesion360(t);
});
