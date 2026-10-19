import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimientoPos = es360 ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, { ...config, usuario: 'consulta' });
    await abrirMovimientoPos(t, 'Consulta productos');
    await t
        .wait(4000)
        .click('#BtnSalirAdmin_ConsultaProductos .dx-icon.fas.fa-sign-out-alt')
        .expect(Selector('#EncabezadoModal').visible).ok('No salió el modal de supervisor')
        .typeText('#ConsultaProductos_Supervisor_User .dx-texteditor-input', 'CONSULTA')
        .pressKey('enter')
        .typeText('#ConsultaProductos_Supervisor_Pass .dx-texteditor-input', '123')
        .pressKey('enter')
        .pressKey('enter')
        .expect(Selector('.swal2-content div').withText('Usuario actual sin permisos, favor ingresar un usuario con permisos').visible).ok('Salio otro mensaje')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#ConsultaProductos_Supervisor_User .dx-texteditor-input').focused).ok('no está el foco en usuario')
        .typeText('#ConsultaProductos_Supervisor_User .dx-texteditor-input', 'CVASQUEZ')
        .pressKey('enter')
        .typeText('#ConsultaProductos_Supervisor_Pass .dx-texteditor-input', '14')
        .pressKey('enter')
        .pressKey('enter')
        .expect(Selector('.swal2-content div').withText('Usuario o clave incorrectos.').visible).ok('Salio otro mensaje')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#ConsultaProductos_Supervisor_Pass .dx-texteditor-input').focused).ok('No se hizo el foco en la contraseña')
        .typeText('#ConsultaProductos_Supervisor_Pass .dx-texteditor-input', '123')
        .pressKey('enter')
        .pressKey('enter')
        .wait(3000)
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC038 testERP POS`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC038 Prueba Credenciales Supervisor testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba INC038 miERP POS`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC038 Prueba Credenciales Supervisor testerp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
