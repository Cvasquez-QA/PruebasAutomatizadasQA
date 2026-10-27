import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { cerrarSesion360, ingresarAplicacion as ingresarAplicacion360, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    eliminarDocumentoActual360,
    esperarLineasDocumento,
    escribirProductoDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

const campo = nombre => Selector(`#txtDocumento_Detalle_${nombre}_cursor_1`);

async function vaciarCampo(t, nombre) {
    await t
        .expect(campo(nombre).exists).ok(`La transacción 997 no tiene el campo ${nombre} en el detalle`)
        .click(campo(nombre))
        .pressKey('ctrl+a')
        .pressKey('backspace');
}

async function escribirCampo(t, nombre, valor) {
    await t
        .click(campo(nombre))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(campo(nombre), valor);
}

/** TX 997: si se borran Fecha1 y Fecha2 de la línea, al editarla deben seguir vacías (no se rellenan solas). */
async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion360(t, config);
    await nuevoDocumento360(t, '997', /^\s*997 -/);
    await guardarDocumento360(t);
    try {
        await escribirProductoDocumento(t, '01');
        await escribirCampo(t, 'Cantidad', '1');
        await escribirCampo(t, 'ValorUnitario', '1000');
        await vaciarCampo(t, 'Fecha1');
        await vaciarCampo(t, 'Fecha2');
        await t.click('#txtDocumento_Detalle_Boton_1 .dx-icon-save').wait(1500);
        await esperarLineasDocumento(t, 1, 'No se grabó la línea del producto 01');
        await t
            .click(Selector('[data-testid="gridDocumentosConsulta"] tr.dx-data-row').nth(0).find('[aria-label="Editar"]'))
            .expect(campo('Producto').value).eql('01', 'La línea no cargó para editarla', { timeout: 10000 })
            .wait(1000)
            .expect(campo('Fecha1').value).eql('', 'El campo Fecha1 no quedó vacío')
            .expect(campo('Fecha2').value).eql('', 'El campo Fecha2 no quedó vacío');
    } finally {
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, '997');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Fecha1_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click('#txtDocumento_Detalle_Fecha2_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-icon-edit"]'))
        .expect(Selector('#txtDocumento_Detalle_Fecha1_cursor_1').value).eql('', 'El campo no está vacío')
        .expect(Selector('#txtDocumento_Detalle_Fecha2_cursor_1').value).eql('', 'El campo no está vacío')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(1500)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(3000)
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
}

fixture `Prueba INC072 Campo Fecha Detalle Documento POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC072 Campo Fecha Detalle Documento POS - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testPosWebConfig);
});

fixture `Prueba INC072 Campo Fecha Detalle Documento Happgi POS`
    .page(testHappgiPosConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC072 Campo Fecha Detalle Documento Happgi POS', async t => {
    await ejecutarPruebaHappgi(t, testHappgiPosConfig);
});
