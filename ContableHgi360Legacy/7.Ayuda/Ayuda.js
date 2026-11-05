import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, ingresarAplicacionMiHappgi } from '../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 


async function ejecutarPruebaAyuda1(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .wait(3000)
            .click(Selector('a').withText('Ayuda'))    
            .wait(2000)
            .click(Selector('span').withText('CANAL YOUTUBE'))
            .wait(12000)
            .expect(Selector('#page-header [class^="yt-core-attributed-string yt-core-attributed-strin"]').exists).ok('No se dirigió al canal de youtube de Contable')
            .closeWindow();
        await cerrarSesion360(t);
}

async function ejecutarPruebaAyuda2(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .click(Selector('a').withText('Ayuda'))    
            .click(Selector('span').withText('SOPORTE REMOTO'))    
            .wait(5000)
            .switchToWindow()
            .expect((Selector('h3').withText('Términos y condiciones para la conexión remota')).exists).ok('No se dirigió al Apartado de Soporte Remoto de Contable')
            .closeWindow();
        await cerrarSesion360(t);
}

async function ejecutarPruebaAyuda3(t, config, ingresar) {
    await ingresar(t, config);
                    //Se ingresa al maestro de ayuda
        //Documentacion
            await t
            .wait(3000)
            .click(Selector('#MenuPrincipal a').withText('Ayuda'))    
            .wait(2000)
            .click(Selector('#LinkManualUsuarioApp3 span').withText('DOCUMENTACIÓN')) 
            .wait(8000)
            .expect((Selector('main h1').withText('Centro de ayuda Contable')).exists).ok('No se dirigió al Centro de ayuda Contable')
            .closeWindow();
        await cerrarSesion360(t);
}

fixture `Ayuda - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Redireccionamiento canal de Youtube Test Contable - Mi ERP', async t => {
    await ejecutarPruebaAyuda1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Conexion Remota Test Contable - Mi ERP', async t => {
    await ejecutarPruebaAyuda2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Documentacion - Mi ERP', async t => {
    await ejecutarPruebaAyuda3(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Ayuda - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Redireccionamiento canal de Youtube Test Contable - Test Contable', async t => {
    await ejecutarPruebaAyuda1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Conexion Remota Test Contable - Test Contable', async t => {
    await ejecutarPruebaAyuda2(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Documentacion - Test Contable', async t => {
    await ejecutarPruebaAyuda3(t, testContableConfig, ingresarAplicacion);
});
