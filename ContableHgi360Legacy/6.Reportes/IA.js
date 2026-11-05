import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../Funciones/HelpersHgi360Legacy.js';
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { miContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const CONSULTA_IA = 'hola';

async function ejecutarPruebaIA(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .click(Selector('a').withText('IA'))    
            .click(Selector('span').withText('INTELIGENCIA ARTIFICIAL'))
            .wait(1500)
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .typeText('#ConsultaIA .dx-texteditor-input', CONSULTA_IA)
            .click('#IAConsultar .dx-icon.dx-icon-arrowup')
            .wait(5000)
            .expect((Selector('#RespuestaIA .text').nth(1)).exists).ok()
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `IA - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Respuesta IA testhappgi - Mi ERP', async t => {
    await ejecutarPruebaIA(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `IA - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Respuesta IA testhappgi - Test Contable', async t => {
    await ejecutarPruebaIA(t, testContableConfig, ingresarAplicacion);
});
