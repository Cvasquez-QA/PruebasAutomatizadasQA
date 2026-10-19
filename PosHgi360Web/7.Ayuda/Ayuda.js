import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Ayuda (test.hgi360.com, AutPos). En la versión React el menú lateral #ErpSidebarModulos tiene
// "Ayuda", "Soporte Remoto" y "Documentación"; cada enlace externo abre una ventana nueva.
// PENDIENTE: validar en el navegador el texto de la opción del canal de YouTube dentro de Ayuda.
const opcionLateral = texto => Selector('#ErpSidebarModulos span').withExactText(texto).filterVisible();

async function abrirVentanaExterna(t, accion, patronUrl, mensaje) {
    await accion();
    await t.wait(5000);
    await t
        .switchToWindow(w => patronUrl.test(w.url.href))
        .expect(Selector('body').exists).ok(mensaje)
        .closeWindow();
}

async function pruebaYoutube(t, config) {
    await ingresarAplicacion(t, config);
    await t.click(opcionLateral('Ayuda')).wait(1500);
    const canal = Selector('#ErpMenuCardGrid .erp-menu-child-text').withText(/youtube/i).filterVisible();
    await t.expect(canal.with({ timeout: 8000 }).exists).ok('No se encontró la opción del canal de YouTube en Ayuda');
    await abrirVentanaExterna(t, () => t.click(canal), /youtube\.com/i, 'No se dirigió al canal de YouTube de Hgi360');
    await cerrarSesion360(t);
}

async function pruebaSoporteRemoto(t, config) {
    await ingresarAplicacion(t, config);
    await abrirVentanaExterna(t, () => t.click(opcionLateral('Soporte Remoto')), /soporte|remot|hgi/i,
        'No se dirigió al apartado de Soporte Remoto de Hgi360');
    await cerrarSesion360(t);
}

async function pruebaDocumentacion(t, config) {
    await ingresarAplicacion(t, config);
    await abrirVentanaExterna(t, () => t.click(opcionLateral('Documentación')), /ayuda|doc|hgi/i,
        'No se dirigió al Centro de ayuda Hgi360');
    await cerrarSesion360(t);
}

fixture `Prueba Ayuda testerp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Redireccionamiento canal de Youtube testerp - Test Hgi360', async t => {
    await pruebaYoutube(t, testPosWebConfig);
});

test('Prueba Conexion Remota testerp - Test Hgi360', async t => {
    await pruebaSoporteRemoto(t, testPosWebConfig);
});

test('Prueba Documentacion - Test Hgi360', async t => {
    await pruebaDocumentacion(t, testPosWebConfig);
});
