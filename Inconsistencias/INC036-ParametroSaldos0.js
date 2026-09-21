import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { testHappgiAdminConfig } from '../../ParametrosPruebas/TestHappgiAdmin8902.js';
import { hgi360PosConfig } from '../../ParametrosPruebas/Hgi360Pos8888.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';
import { testHappgiPosConfig } from '../../ParametrosPruebas/TestHappgiPos8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirHerramientas = es360 ? h.abrirHerramientas360 : h.abrirHerramientas;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, es360 ? 'Parámetros' : 'PARÁMETROS');
    await t
        .click('#tabs_parametrosAdmin_Inventarios')
        .click('#BtnEditar .dx-icon.dx-icon-edit')
        .wait(3000)
        .expect(Selector('span').withText('Saldos (0)').visible).notOk('El parámetro Saldos 0 existe')
        .wait(1500);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC036 testERP Admin`
    .page(testAdminConfig.pagina);

test('Prueba INC036 Parametro Saldos 0 testerp', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC036 Hgi360 Admin`
    .page(hgi360AdminConfig.pagina);

test('Prueba INC036 Parametro Saldos 0 Hgi360', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba INC036 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina);

test('Prueba INC036 Parametro Saldos 0 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC036 testERP Pos`
    .page(testPosConfig.pagina);

test('Prueba INC036 Parametro Saldos 0 testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba INC036 Hgi360 Pos`
    .page(hgi360PosConfig.pagina);

test('Prueba INC036 Parametro Saldos 0 Hgi360', async t => {
    await ejecutarPrueba(t, hgi360PosConfig);
});

fixture `Prueba INC036 testhappgi Pos`
    .page(testHappgiPosConfig.pagina);

test('Prueba INC036 Parametro Saldos 0 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
