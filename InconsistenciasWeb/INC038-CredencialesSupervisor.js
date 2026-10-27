import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

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

/**
 * Hgi360 (ERP web): Consulta productos con el usuario "consulta". Al salir pide credenciales de supervisor:
 * un usuario sin permisos y una clave incorrecta deben mostrar su aviso y devolver el foco al campo.
 */
async function ejecutarPrueba360(t, config) {
    const usuario = Selector('#ConsultaProductos_Supervisor_User .dx-texteditor-input');
    const clave = Selector('#ConsultaProductos_Supervisor_Pass .dx-texteditor-input');
    const aviso = Selector('.swal2-popup, .dx-overlay-content, .modal-content').filterVisible();
    const confirmar = Selector('button.swal2-confirm').filterVisible();

    await Web.ingresarAplicacion(t, { ...config, usuario: 'consulta' });
    // El usuario "consulta" entra por defecto a Administrativo; Consulta productos está en el módulo POS
    const moduloActual = Selector('#LblAplicacionActual');
    await t.expect(moduloActual.with({ timeout: 20000 }).visible).ok('No se ve el selector de módulo');
    for (let intento = 0; intento < 3 && (await moduloActual.innerText).trim() !== 'POS'; intento++) {
        const opcionPos = Selector('#dropdownAplicacionesMenu .erp-panel-item').filterVisible()
            .withText(/^\s*POS\b/);
        await t.click(Selector('.erp-selector-trigger').withText(/M[oó]dulo actual/));
        if (!await opcionPos.with({ timeout: 5000 }).exists) {
            continue;
        }
        await t.click(opcionPos.nth(0)).wait(4000);
        if (await confirmar.with({ timeout: 3000 }).exists) {
            await t.click(confirmar).wait(4000);
        }
        await t.expect(moduloActual.with({ timeout: 20000 }).visible).ok('No recargó el encabezado al cambiar de módulo');
    }
    await t.expect((await moduloActual.innerText).trim()).eql('POS', 'No se pudo cambiar al módulo POS');
    await Web.abrirMovimientos360(t, 'Consulta productos');
    await t
        .click(Selector('#BtnSalirAdmin_ConsultaProductos').filterVisible().with({ timeout: 20000 }))
        .expect(usuario.with({ timeout: 10000 }).visible).ok('No salió el modal de supervisor')
        .typeText(usuario, 'CONSULTA', { replace: true })
        .pressKey('enter')
        .typeText(clave, '123', { replace: true })
        .pressKey('enter')
        .expect(aviso.withText('Usuario actual sin permisos, favor ingresar un usuario con permisos').with({ timeout: 10000 }).exists)
        .ok('No salió "Usuario actual sin permisos, favor ingresar un usuario con permisos"');
    // Versión actual: el aviso sale dentro del modal "Autorización Supervisor" (antes era un swal con Aceptar)
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t
        .expect(usuario.focused).ok('No está el foco en usuario')
        .typeText(usuario, 'CVASQUEZ', { replace: true })
        .pressKey('enter')
        .typeText(clave, '14', { replace: true })
        .pressKey('enter')
        .expect(aviso.withText('Usuario o clave incorrectos.').with({ timeout: 10000 }).exists)
        .ok('No salió "Usuario o clave incorrectos."');
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    await t
        .expect(clave.focused).ok('No se hizo el foco en la contraseña')
        .pressKey('esc');
    // Consulta productos queda en pantalla completa y solo se sale con un supervisor válido: se vuelve a la página
    await t.navigateTo(config.pagina);
    if (await Selector('#divpanelmaster .erp-user-trigger').with({ timeout: 20000 }).visible) {
        await Web.cerrarSesion360(t);
    }
}

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

fixture `Prueba INC038 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC038 Prueba Credenciales Supervisor POS - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC038 Hgi360 POS`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC038 Prueba Credenciales Supervisor Hgi360', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});
