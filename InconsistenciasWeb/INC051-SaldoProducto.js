import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { hgiPosConfig, testAdminConfig, testHappgiAdminConfig, testPosWebConfig, testHappgiPosConfig, offPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/** Al actualizar los saldos desde el maestro de Productos (grid de saldos del producto) no debe salir ningún aviso. */
async function ejecutarPrueba360(t, config) {
    const grid = Selector('[data-testid="gridProductos"]').filterVisible();
    const gridSaldos = Selector('[data-testid="gridProductosSaldos"], #gridProductosSaldos').filterVisible();
    await Web.ingresarAplicacion(t, config);
    await Web.abrirMaestros360(t, 'Productos', 'productos');
    await t
        .expect(grid.find('[aria-label="Editar"]').with({ timeout: 30000 }).exists).ok('No cargó el maestro Productos')
        .click(grid.find('[aria-label="Editar"]').nth(0));
    const pestanaSaldos = Selector('#Tab_Maestro_Productos_Saldos_link');
    await t
        .expect(pestanaSaldos.with({ timeout: 20000 }).visible).ok('El producto no tiene la pestaña Saldos')
        .click(pestanaSaldos)
        .expect(gridSaldos.with({ timeout: 20000 }).exists).ok('No se mostró la grid de saldos del producto');
    const actualizar = gridSaldos.find('[aria-label="Actualizar"], .dx-icon-refresh').filterVisible();
    await t
        .expect(actualizar.with({ timeout: 15000 }).exists).ok('No está el botón de actualizar saldos del producto')
        .click(actualizar.nth(0))
        .wait(3000);
    const aviso = Selector('.swal2-popup').filterVisible();
    const texto = await aviso.exists ? (await aviso.innerText).replace(/\s+/g, ' ') : '';
    await t.expect(texto).eql('', `Se está generando el mensaje al actualizar saldos desde el maestro de productos: ${texto}`);
    const cancelar = Selector('[id^="BtnCancelarProducto"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi / offline (legacy) ----------------------------- */

async function ingresarAplicacionOffline(t, config) {
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(1000)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .wait(2000)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
}

async function ejecutarPrueba(t, config, ingresar = HelpersHappgi.ingresarAplicacion) {
    await ingresar(t, config);
    await HelpersHappgi.abrirMaestros(t, 'Productos');
    await t
        .click(Selector('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(3000)
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .expect(Selector('.swal2-content div').exists).notOk('Se está generando el mensaje al actualizar saldos desde el maestro de productos')
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba validacion mensaje actualizar saldos Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `Prueba validacion mensaje actualizar saldos happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testhappgi Admin', async t => {
    await ejecutarPrueba(t, testHappgiAdminConfig);
});

fixture `Prueba validacion mensaje actualizar saldos Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});

fixture `Prueba validacion mensaje actualizar saldos Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos Pos - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba validacion mensaje actualizar saldos testhappgi Pos`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos testhappgi Pos', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});

fixture `Prueba validacion mensaje actualizar saldos offline Pos`
    .page(offPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('validacion mensaje al actualizar saldo desde el maestro Productos offline Pos', async t => {
    await ejecutarPrueba(t, offPosConfig, ingresarAplicacionOffline);
});
