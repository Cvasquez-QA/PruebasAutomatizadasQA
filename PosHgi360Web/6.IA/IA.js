import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// IA (test.hgi360.com, AutPos). El módulo POS en React no tiene el menú "IA > Inteligencia Artificial";
// el asistente se abre desde "Chatea con Isa" en el menú lateral.
// PENDIENTE: validar en el navegador los selectores del chat (campo de texto y respuestas).
const CONSULTA_IA = 'hola';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await t.click(Selector('#ErpSidebarModulos span').withExactText('Chatea con Isa').filterVisible()).wait(3000);

    const campo = Selector('textarea, input[type="text"]').filterVisible().withAttribute('placeholder', /.+/).nth(-1);
    const mensajes = Selector('[class*="message"], [class*="mensaje"], [class*="chat"] p').filterVisible();
    const antes = await mensajes.count;

    await t
        .expect(campo.with({ timeout: 15000 }).exists).ok('No se abrió el chat de Isa')
        .typeText(campo, CONSULTA_IA)
        .pressKey('enter')
        .wait(10000)
        .expect(mensajes.count).gt(antes + 1, 'Isa no respondió la consulta', { timeout: 30000 });

    await cerrarSesion360(t);
}

fixture `Prueba IA testhappgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Respuesta IA testhappgi - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
