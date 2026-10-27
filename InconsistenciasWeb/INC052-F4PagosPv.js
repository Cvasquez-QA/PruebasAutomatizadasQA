import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiPosConfig, testPosConfig, testHappgiPosConfig, offPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';
import * as Web from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirMovimientoPos = HelpersHappgi.abrirMovimiento;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirMovimientoPos = esHgi360(config) ? h.abrirMovimientos360 : h.abrirMovimiento;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ingresarAplicacionOffline(t, config) {
    await t
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario)
        .wait(1500)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
}

async function validarF4Pagos(t, config) {
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click(Selector('#BtnPuntoDeVenta_Movimientos div').withText('Movimientos'))
        .click(Selector('[title="Movimientos Pagos"] div i'))
        .click('#txtDocumento_Pago_Transaccion_1 .dx-icon.dx-icon-search')
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Transaccion button').withText('X'))
        .click(Selector('#txtDocumento_Pago_TipoCartera_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_TipoCartera button').withText('X'))
        .click(Selector('#txtDocumento_Pago_Concepto_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Conceptos button').withText('X'))
        .click(Selector('#txtDocumento_Pago_Naturaleza_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Naturalezas button').withText('X'))
        .click(Selector('#txtDocPago_Banco_FormaPago_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_FormaPagos button').withText('X'))
        .click(Selector('#txtDocPago_Banco_Banco_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Bancos button').withText('X'))
        .click(Selector('#txtDocPago_Banco_Naturaleza_1 .dx-icon.dx-icon-search'))
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').exists).ok('No está información en la grid')
        .click(Selector('#modal_F4_Naturalezas button').withText('X'))
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('[title="Cerrar"] .dx-icon.dx-icon-close'))
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
}

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/** Campos de Movimientos Pagos (desde el Punto de Venta) cuya lupa (F4) debe mostrar datos. */
const CAMPOS_F4_PAGOS = [
    '#txtDocumento_Pago_Transaccion_1',
    '#txtDocumento_Pago_TipoCartera_1',
    '#txtDocumento_Pago_Concepto_1',
    '#txtDocumento_Pago_Naturaleza_1',
    '#txtDocPago_Banco_FormaPago_1',
    '#txtDocPago_Banco_Banco_1',
    '#txtDocPago_Banco_Naturaleza_1'
];

async function ejecutarPrueba360(t, config) {
    await Web.ingresarAplicacion(t, config);
    await abrirPuntoDeVenta360(t);
    await t.click(Selector('#BtnPuntoDeVenta_Movimientos').filterVisible().with({ timeout: 15000 }));
    // Versión actual (26-oct-2026): «Movimientos» abre directamente el popup "Movimientos Financieros" con listas
    // desplegables (Transacción, Tercero, Forma Pago, Banco, Concepto) en lugar de campos con lupa F4.
    const financieros = Selector('.dx-overlay-content').filterVisible().withText('Movimientos Financieros');
    if (await financieros.with({ timeout: 8000 }).exists) {
        const listas = financieros.find('.dx-lookup-field, .dx-selectbox .dx-dropdowneditor-input-wrapper');
        const total = await listas.count;
        const vacias = [];
        for (let i = 0; i < total; i++) {
            const etiqueta = (await financieros.find('.dx-lookup, .dx-selectbox').nth(i).parent().innerText).split('\n')[0].trim();
            await t.click(listas.nth(i));
            const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item');
            if (!await opciones.with({ timeout: 8000 }).exists) {
                vacias.push(etiqueta || `lista ${i + 1}`);
            }
            await t.pressKey('esc').wait(800);
        }
        await t
            .expect(total).gt(0, 'El popup Movimientos Financieros no tiene listas')
            .expect(vacias.join(', ')).eql('', `Listas sin información en Movimientos Financieros: ${vacias.join(', ')}`)
            .click(financieros.find('.dx-button').filterVisible().withText(/^\s*Cancelar\s*$/).nth(-1));
        await salirPuntoDeVenta360(t);
        await Web.cerrarSesion360(t);
        return;
    }
    await t
        .click(Selector('[title="Movimientos Pagos"], .dx-list-item').filterVisible().withText(/Movimientos Pagos/i).nth(0))
        .wait(3000);
    for (const campo of CAMPOS_F4_PAGOS) {
        const lupa = Selector(`${campo} .dx-icon-search`).filterVisible();
        await t
            .expect(lupa.with({ timeout: 15000 }).exists).ok(`No está la lupa de ${campo}`)
            .click(lupa)
            .expect(Selector('[id^="modal_F4_"] tr.dx-data-row').filterVisible().with({ timeout: 15000 }).exists)
            .ok(`No está información en la grid del F4 de ${campo}`)
            .pressKey('esc')
            .wait(1000);
        const cerrarF4 = Selector('[id^="modal_F4_"]').filterVisible().find('[aria-label="Cerrar"], .dx-closebutton, button');
        if (await Selector('[id^="modal_F4_"] tr.dx-data-row').filterVisible().exists && await cerrarF4.exists) {
            await t.click(cerrarF4.nth(0)).wait(1000);
        }
    }
    const cerrarPagos = Selector('[title="Cerrar"] .dx-icon-close, [aria-label="Cerrar"]').filterVisible();
    if (await cerrarPagos.exists) {
        await t.click(cerrarPagos.nth(0)).wait(1000);
    }
    await salirPuntoDeVenta360(t);
    await Web.cerrarSesion360(t);
}

/* ----------------------------- Happgi / offline (legacy) ----------------------------- */

async function ejecutarPrueba(t, config, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    await ingresar(t, config);
    await abrirMovimientoPos(t, 'Punto de Venta');
    await validarF4Pagos(t, config);
    await cerrarSesion(t);
}

fixture `Prueba INC052 - Test Hgi360 Pos`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC052 Campos para busqueda con F4 - Test Hgi360 Pos', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC052 Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await Web.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC052 Campos para busqueda con F4 Hgi360', async t => {
    await ejecutarPrueba360(t, hgiPosConfig);
});

fixture `Prueba INC052 offline`
    .page(offPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC052 Campos para busqueda con F4 offline', async t => {
    await ejecutarPrueba(t, offPosConfig, ingresarAplicacionOffline);
});

fixture `Prueba INC052 testhappgi`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC052 Campos para busqueda con F4 testhappgi', async t => {
    await ejecutarPrueba(t, testHappgiPosConfig);
});
