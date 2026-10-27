import { ClientFunction, Selector } from 'testcafe';
import { miContableConfig, testContableConfig, testHappgiContableConfig, devContableConfig, miHappgiContableConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMaestros360, ingresarAplicacion, cerrarSesion360, cerrarPestana360 } from '../Funciones/HelpersHgi360Web.js';
//En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

/**
 * INC48 - Campos del formulario de parámetros de Comprobantes (Contable > Maestros > Comprobantes).
 * Edita el segundo comprobante y, en Encabezado y en Detalle, abre "Nuevo" para validar que se ven los campos
 * de origen y destino. No guarda nada.
 * Solo test.hgi360.com usa el ERP React; los demás ambientes conservan la prueba anterior.
 */

const CAMPOS_COMUNES = ['Valor', 'TipoTercero', 'Resp05', 'RegimenTercero', 'Par1Tercero', 'TarAct', 'CCostoF', 'SucursalF', 'Vendedor', 'clase'];
const CAMPOS_DESTINO = ['Naturaleza', 'Porcentaje', 'Cuenta', 'CuentaEQ', 'Sucursal', 'CCosto', 'SubCCosto', 'Documento', 'DocRef',
    'Tercero', 'Tercero2', 'Base', 'Base2', 'Detalle', 'Agrupar', 'Grupo'];
const CAMPOS_ENCABEZADO = [...CAMPOS_COMUNES, 'FpagoDian', 'Cartera', ...CAMPOS_DESTINO];
const CAMPOS_DETALLE = [...CAMPOS_COMUNES, 'iva', 'impuesto1', 'retfte', ...CAMPOS_DESTINO];

const camposNoVisibles = ClientFunction(campos => campos.filter(function (campo) {
    const nodo = document.getElementById('txtMaestroGestionFormulario_' + campo);
    return !nodo || !nodo.getClientRects().length;
}));
/** Campos visibles del formulario que no están en la lista esperada (para ver si alguno cambió de nombre). */
const camposAdicionales = ClientFunction(campos => Array.prototype.slice.call(document.querySelectorAll('[id^="txtMaestroGestionFormulario_"]'))
    .filter(nodo => nodo.getClientRects().length)
    .map(nodo => nodo.id.replace('txtMaestroGestionFormulario_', ''))
    .filter(campo => campo.indexOf('_') === -1 && campos.indexOf(campo) === -1));
const btnCerrarFormulario = Selector('#BtnCancelarComprobanteFormulario_btn, #BtnCancelarComprobanteFormulario').filterVisible().nth(0);

async function validarFormulario(t, gridId, campos, seccion) {
    const grid = Selector(`[data-testid="${gridId}"], #${gridId}`).filterVisible().nth(0);
    const nuevo = grid.find('.dx-icon-add, [aria-label="Nuevo"], [aria-label="Agregar"]').filterVisible();
    await t
        .expect(grid.with({ timeout: 15000 }).exists).ok(`No se ve la grid de ${seccion} del comprobante`)
        .click(nuevo.nth(0))
        .expect(Selector('#txtMaestroGestionFormulario_Valor').with({ timeout: 15000 }).visible)
        .ok(`No abrió el formulario de ${seccion} del comprobante`);
    const faltan = await camposNoVisibles(campos);
    const otros = faltan.length ? await camposAdicionales(campos) : [];
    await t.expect(faltan).eql([], `${seccion}: no se ven los campos ${faltan.join(', ')} (otros campos visibles: ${otros.join(', ') || 'ninguno'})`);
    await t.click(btnCerrarFormulario);
}

fixture `Prueba INC048 testERP Contable`
    .page(testContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes testerp Contable', async t => {
    await ingresarAplicacion(t, testContableConfig);
    await abrirMaestros360(t, 'Comprobantes');
    await t.click(Selector('[aria-label="Editar"]').filterVisible().with({ timeout: 20000 }).nth(1));
    try {
        await validarFormulario(t, 'gridParametrosComprobantesEncabezado', CAMPOS_ENCABEZADO, 'Encabezado');
        await t.click(Selector('#tabs_documento_Detalle').filterVisible().with({ timeout: 10000 }));
        await validarFormulario(t, 'gridParametrosComprobantesDetalle', CAMPOS_DETALLE, 'Detalle');
    } finally {
        if (await btnCerrarFormulario.exists) {
            await t.click(btnCerrarFormulario);
        }
    }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

// ----------------------------------------------------------------------------------------------------
// Ambientes con el ERP anterior (no se ejecutan en test.hgi360.com)

async function validarCamposLegacy(t) {
    await t
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        .click('#gridParametrosComprobantesEncabezado .dx-icon.dx-icon-add')
        .wait(2000);
    for (const campo of CAMPOS_ENCABEZADO) {
        await t.expect(Selector(`#txtMaestroGestionFormulario_${campo}`).visible).ok(`no está el campo visible: ${campo}`);
    }
    await t
        .wait(3000)
        .click(Selector('#BtnCancelarComprobanteFormulario div').withText('Cerrar'))
        .click('#tabs_documento_Detalle')
        .click('#gridParametrosComprobantesDetalle .dx-icon.dx-icon-add');
    for (const campo of CAMPOS_DETALLE) {
        await t.expect(Selector(`#txtMaestroGestionFormulario_${campo}`).visible).ok(`no está el campo visible: ${campo}`);
    }
    await t.wait(2000);
}

async function ejecutarLegacy(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Comprobantes');
    await validarCamposLegacy(t);
    await cerrarSesion360(t);
}

fixture `Prueba INC048 MIERP Contable`
    .page(miContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes mierp Contable', async t => {
    await ejecutarLegacy(t, miContableConfig);
});

fixture `Prueba INC048 devERP Contable`
    .page(devContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes deverp Contable', async t => {
    await ejecutarLegacy(t, devContableConfig);
});

fixture `Prueba INC048 testhappgi Contable`
    .page(testHappgiContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes testhappgi Contable', async t => {
    await ejecutarLegacy(t, testHappgiContableConfig);
});

fixture `Prueba INC048 mihappgi Contable`
    .page(miHappgiContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes mihappgi Contable', async t => {
    await ejecutarLegacy(t, miHappgiContableConfig);
});
