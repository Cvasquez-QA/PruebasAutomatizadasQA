import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { miHappgiAdminConfig } from '../../ParametrosPruebas/MiHappgiAdmin8893.js';
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
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirHerramientas = es360 ? h.abrirHerramientas360 : h.abrirHerramientas;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
};

const esMiHappgi = (config) => String(config?.pagina || '').toLowerCase().includes('mi.happgi');

async function cambiarModoContable(t) {
    const radio0 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon');
    const radio1 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(1);
    const radio2 = Selector('#TxtPrm_General_IntModoGral .dx-radiobutton-icon').nth(2);

    if (await radio0.hasClass('dx-radiobutton-icon-checked')) {
        await t.click(radio1);
    }
    if (await radio1.hasClass('dx-radiobutton-icon-checked')) {
        await t.click(radio2);
    }
    if (await radio1.hasClass('dx-radiobutton-icon-checked')) {
        await t.click(radio0);
    }
    await t
        .wait(6000)
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .wait(3000)
        .expect(Selector('.swal2-content div').innerText).eql('Registro almacenado correctamente.', 'No se está generando el mensaje de guardado correcto')
        .click(Selector('.swal2-confirm.btn.btn-success'));
}

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    if (esMiHappgi(config)) {
        await ingresarAplicacionMiHappgi(t, config);
    } else {
        await ingresarAplicacion(t, config);
    }
    await abrirHerramientas(t, es360 ? 'Parámetros' : 'PARÁMETROS');
    await t.click(Selector('#BtnEditar span').withText('Editar')).wait(2000);
    await cambiarModoContable(t);
    await t.switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC047 testERP Admin`
    .page(testAdminConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable ', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba INC047 MIERP Admin`
    .page(hgi360AdminConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable MiERP', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});

fixture `Prueba INC047 testhappgi Admin`
    .page(testHappgiAdminConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable testhappi admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba INC047 mihappgi Admin`
    .page(miHappgiAdminConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable testhappi admin', async t => {
    await ejecutarPrueba(t, miHappgiAdminConfig);
});

fixture `Prueba INC047 testERP Pos`
    .page(testPosConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba INC047 MIERP Pos`
    .page(hgi360PosConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable MiERP', async t => {
    await ejecutarPrueba(t, hgi360PosConfig);
});

fixture `Prueba INC047 testhappgi Pos`
    .page(testHappgiPosConfig.pagina);

test('Prueba INC047 prueba Cambio de Modo Contable testhappi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
