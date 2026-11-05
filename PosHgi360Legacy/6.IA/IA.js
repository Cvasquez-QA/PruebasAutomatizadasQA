import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    abrirIA360,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const CONSULTA_IA = 'hola';

fixture `Prueba IA testhappgi Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Respuesta IA testhappgi - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirIA360(t, 'Inteligencia Artificial');
    await t
        .typeText('#ConsultaIA .dx-texteditor-input', CONSULTA_IA)
        .click('#IAConsultar .dx-icon.dx-icon-arrowup')
        .wait(5000)
        .expect(Selector('#RespuestaIA .text').nth(1).exists).ok();
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba IA testhappgi Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Respuesta IA testhappgi - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirIA360(t, 'Inteligencia Artificial');
    await t
        .typeText('#ConsultaIA .dx-texteditor-input', CONSULTA_IA)
        .click('#IAConsultar .dx-icon.dx-icon-arrowup')
        .wait(5000)
        .expect(Selector('#RespuestaIA .text').nth(1).exists).ok();
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
