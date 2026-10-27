import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import {
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    eliminarDocumentoSiExiste360,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * INC082 - Facturación Electrónica > Facturador: el envío masivo de una factura 01FE sin finalizar no debe
 * hacerse; debe avisar "No se puede realizar el envío". Solo se marca la factura que crea la prueba, que se elimina.
 */
const TX = '01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA';

async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, '01FE', /^\s*01FE -/);
    const numero = await guardarDocumento360(t);
    let mensaje = '';
    try {
        await agregarLineaDocumento(t, '01', { cantidad: 1, valor: 1000 });
        await cerrarPestana360(t);

        await t
            .click(Selector('#ErpSidebarModulos span').withText('Facturación Electrónica'))
            .click(Selector('#ErpMenuCardGrid .erp-menu-child-text').withExactText('Facturador').filterVisible().with({ timeout: 10000 }));
        await elegirEnLookup360(t, '#Documentos_Electronicos_Transaccion', TX, '01FE');
        const consultar = Selector('#BtnConsultarDocumentosElectronicos_btn, #BtnConsultarDocumentosElectronicos').filterVisible();
        if (await consultar.exists) {
            await t.click(consultar.nth(0));
        }
        // Versión actual: la grid carga todas las facturas pendientes paginadas; se filtra por la columna Documento
        const filtroDocumento = Selector('tr.dx-datagrid-filter-row').filterVisible().nth(0).find('.dx-texteditor-input').nth(0);
        await t
            .expect(filtroDocumento.with({ timeout: 20000 }).exists).ok('No está el filtro de Documento en el Facturador')
            .typeText(filtroDocumento, String(numero), { replace: true })
            .wait(2500);
        const fila = Selector('tr.dx-data-row').filterVisible().withText(String(numero));
        const enviar = Selector('#BtnEnvioDian_btn, #BtnEnvioDian, .dx-button').filterVisible().withText(/^\s*Enviar\s*$/);
        await t
            .expect(fila.with({ timeout: 20000 }).exists).ok(`La factura ${numero} no aparece en el Facturador`)
            .click(fila.nth(0).find('.dx-checkbox, .dx-select-checkbox').nth(0))
            .click(enviar.nth(0))
            .wait(4000);
        const aviso = Selector('.erp-toast, .swal2-popup').filterVisible();
        if (await aviso.with({ timeout: 10000 }).exists) {
            mensaje = (await aviso.nth(0).innerText).replace(/\s+/g, ' ').trim();
        }
        const confirmar = Selector('button.swal2-confirm').filterVisible();
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await cerrarPestana360(t);
    } finally {
        await nuevoDocumento360(t, '01FE', /^\s*01FE -/);
        await eliminarDocumentoSiExiste360(t, '01FE', /^\s*01FE -/, numero);
        await cerrarPestana360(t);
    }
    await t.expect(mensaje).match(/No se puede realizar el env[ií]o/i, `No salió el aviso "No se puede realizar el envío". Mensaje: "${mensaje}"`);
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, '01FE');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01')
        .pressKey('enter')
        .doubleClick('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .doubleClick('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(3000);
    await HelpersHappgi.cerrarPestana(t);
    await t
        .wait(3000)
        .switchToMainWindow()
        .click(Selector('a').withText('Facturación Electrónica'))
        .click(Selector('a').withText('Facturador'))
        .wait(1500)
        .switchToIframe(HelpersHappgi.iframeTab)
        .wait(1500)
        .click(Selector('#Documentos_Electronicos_Transaccion .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), '01FE')
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(TX))
        .click(Selector('#BtnConsultarDocumentosElectronicos span').withText('Cargar'))
        .wait(4500)
        .click(Selector('.dx-checkbox-container .dx-checkbox-icon'))
        .click(Selector('#BtnEnvioDian span').withText('ENVIAR'))
        .expect(Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div').withText('No se puede realizar el envío.').exists).ok();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `INC082 Envio Masivo Facturador Happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('INC082 Envio Masivo Facturador Happgi Admin', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});

fixture `INC082 Envio Masivo Facturador Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC082 Envio Masivo Facturador Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});
