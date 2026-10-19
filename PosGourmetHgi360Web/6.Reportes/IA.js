import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Web.js';
import { testGourmetConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const CONSULTA_IA = 'hola';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await t
        .click(Selector('a').withText('IA'))
        .click(Selector('span').withText('INTELIGENCIA ARTIFICIAL'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .typeText('#ConsultaIA .dx-texteditor-input', CONSULTA_IA)
        .click('#IAConsultar .dx-icon.dx-icon-arrowup')
        .wait(5000)
        .expect((Selector('#RespuestaIA .text').nth(1)).exists).ok();
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba IA - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Respuesta IA - Test Hgi360', async t => {
    await ejecutarPrueba(t, testGourmetConfig);
});
