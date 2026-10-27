import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, agregarProductoPV, elegirTransaccionPV, limpiarTemporalPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * En el Punto de Venta, al editar una línea, la lupa del Precio unitario abre la lista de precios y la lupa del
 * Tercero de la línea abre "Seleccionar Terceros". El temporal se limpia al final.
 */
async function ejecutarPrueba360(t, config) {
    const ventana = texto => Selector('.dx-overlay-content, .modal-content, [role="dialog"]').filterVisible().withText(texto);
    await ingresarAplicacion360(t, config);
    await abrirPuntoDeVenta360(t);
    await elegirTransaccionPV(t);
    await limpiarTemporalPV(t);
    try {
        await agregarProductoPV(t, '01', '1');
        await t
            .click(Selector('tr.dx-data-row').filterVisible().withText('INSUMOS').find('[aria-label="Modificar producto"]').with({ timeout: 10000 }).nth(0))
            .wait(1500);
        const lupaPrecio = Selector('#txtPuntoDeVenta_Detalle_ValorUnitario_1 .dx-icon-find, #txtPuntoDeVenta_Detalle_ValorUnitario_1 .dx-icon-search').filterVisible();
        await t
            .expect(lupaPrecio.with({ timeout: 10000 }).exists).ok('No está la lupa del precio unitario en la línea')
            .click(lupaPrecio.nth(0))
            .expect(ventana('Seleccione una lista para aplicar el precio').with({ timeout: 10000 }).exists)
            .ok('No se desplegó el modal de lista de precios')
            .pressKey('esc')
            .wait(1000);
        const lupaTercero = Selector('#txtPuntoDeVenta_Detalle_Tercero_1 .dx-icon-search').filterVisible();
        if (await lupaTercero.exists) {
            await t
                .click(lupaTercero)
                .expect(ventana('Seleccionar Terceros').with({ timeout: 10000 }).exists).ok('No se despliega la modal de terceros')
                .pressKey('esc')
                .wait(1000);
        }
    } finally {
        await limpiarTemporalPV(t);
        await salirPuntoDeVenta360(t);
    }
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config, transaccion) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Punto de Venta');
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('.dx-item.dx-list-item div').withText(transaccion))
        .click('#PuntoDeVenta_BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(1500)
        .typeText('#txtPuntoDeVenta_Detalle_Producto_cursor_1', '01')
        .wait(1500)
        .pressKey('enter')
        .click(Selector('.dx-icon.dx-icon-check'))
        .wait(4000)
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('enter')
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]'))
        .wait(1500)
        .click('#txtPuntoDeVenta_Detalle_ValorUnitario_1 .dx-icon.dx-icon-find')
        .expect(Selector('#moduleContainer div').withText('Seleccione una lista para aplicar el precio').visible).ok('No se deplegó el modal de lista de precios')
        .switchToMainWindow()
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-icon.dx-icon-close'))
        .switchToMainWindow()
        .click(Selector('#PuntoDeVenta_BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla div i'))
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC060 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC060 lupa precio unitario y tercero en detalle PV - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC060 happgi POS`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC060 validar barra desplazamiento detalles PV HAPPGI', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig, '01PV - PRUEBA FACTURA PV');
});
