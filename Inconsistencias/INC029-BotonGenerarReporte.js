import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { miHappgiAdminConfig } from '../../ParametrosPruebas/MiHappgiAdmin8893.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirReportes = HelpersHappgi.abrirReportes;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirReportes = es360 ? h.abrirReportes360 : h.abrirReportes;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
};

const esMiHappgi = (config) => String(config?.pagina || '').toLowerCase().includes('mi.happgi');
const filaReporte = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines pa"] td');

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await abrirReportes(t, es360 ? 'Maestros' : 'MAESTROS');
    await t
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .click(Selector('.dx-list-item').withText('Terceros'))
        .wait(1500)
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .expect(filaReporte.innerText).notEql(null)
        .click(Selector('.dx-lookup-field-wrapper .dx-lookup-field'))
        .wait(1500)
        .click(Selector('.dx-list-item').withText('Productos'))
        .click(Selector('span').withText('Generar'))
        .wait(3000)
        .expect(filaReporte.innerText).notEql(null);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba boton generar reportes Admin testerp`
    .page(testAdminConfig.pagina);

test('Prueba boton generar reportes Admin testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba boton generar reportes Admin Hgi360`
    .page(hgi360AdminConfig.pagina);

test('Prueba boton generar reportes Admin Hgi360', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba boton generar reportes Admin testhappgi`
    .page(testHappgiAdminConfig.pagina);

test('Prueba boton generar reportes Admin testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba boton generar reportes Admin mihappgi`
    .page(miHappgiAdminConfig.pagina);

test('Prueba boton generar reportes Admin mihappgi', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});
