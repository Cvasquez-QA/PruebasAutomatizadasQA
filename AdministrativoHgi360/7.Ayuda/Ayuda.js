import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';

async function ejecutarPruebaAyuda1(t, config) {
    await ingresarAplicacion(t, config);
        await t
            .wait(3000)
            .click(Selector('a').withText('Ayuda'))
            .wait(2000)
            .click(Selector('span').withText('CANAL YOUTUBE'))
            .wait(12000)
            .expect(Selector('#page-header [class^="yt-core-attributed-string yt-core-attributed-strin"]').exists).ok('No se dirigió al canal de youtube de Hgi360')
            .closeWindow();
        await cerrarSesion360(t);
}

async function ejecutarPruebaAyuda2(t, config) {
    await ingresarAplicacion(t, config);
        await t
            .click(Selector('a').withText('Ayuda'))
            .click(Selector('span').withText('SOPORTE REMOTO'))
            .wait(5000)
            .switchToWindow()
            .expect((Selector('h3').withText('Términos y condiciones para la conexión remota')).exists).ok('No se dirigió al Apartado de Soporte Remoto de Hgi360')
            .closeWindow();
        await cerrarSesion360(t);
}

async function ejecutarPruebaAyuda3(t, config) {
    await ingresarAplicacion(t, config);
                    //Se ingresa al maestro de ayuda
        //Documentacion
            await t
            .wait(3000)
            .click(Selector('#MenuPrincipal a').withText('Ayuda'))
            .wait(2000)
            .click(Selector('#LinkManualUsuarioApp3 span').withText('DOCUMENTACIÓN'))
            .wait(8000)
            .expect((Selector('main h1').withText('Centro de ayuda Hgi360')).exists).ok('No se dirigió al Centro de ayuda Hgi360')
            .closeWindow();
        await cerrarSesion360(t);
}

fixture `Ayuda - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Redireccionamiento canal de Youtube testerp - Test Hgi360', async t => {
    await ejecutarPruebaAyuda1(t, testAdminConfig);
});

test('Prueba Conexion Remota testerp - Test Hgi360', async t => {
    await ejecutarPruebaAyuda2(t, testAdminConfig);
});

test('Prueba Documentacion - Test Hgi360', async t => {
    await ejecutarPruebaAyuda3(t, testAdminConfig);
});

fixture `Ayuda - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Redireccionamiento canal de Youtube Hgi360 Admin - Hgi360 Admin', async t => {
    await ejecutarPruebaAyuda1(t, hgiAdminConfig);
});

test('Prueba Conexion Remota Hgi360 Admin - Hgi360 Admin', async t => {
    await ejecutarPruebaAyuda2(t, hgiAdminConfig);
});

test('Prueba Documentacion - Hgi360 Admin', async t => {
    await ejecutarPruebaAyuda3(t, hgiAdminConfig);
});
