import { Selector } from 'testcafe';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import {
    cerrarPestana360,
    cerrarSesion360,
    editarTransaccion360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import {
    eliminarDocumentoActual360,
    escribirProductoDocumento,
    guardarDocumento360,
    nuevoDocumento360,
    numeroDesdeTexto
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC104 - TX 01QA con "Precio producto sugerido" y origen "Según cantidad": el valor unitario del 010203 cambia con
 * la cantidad (1 = 5.000, 2 = 200, 3 = 300). Deja la TX con esa configuración (igual que la prueba legacy).
 * El documento se elimina sin grabar líneas.
 */

const PRODUCTO = '010203';
const PRECIOS = [['1', 5000], ['2', 200], ['3', 300]];
const cantidad = Selector('#txtDocumento_Detalle_Cantidad_cursor_1');
const valorUnitario = Selector('#txtDocumento_Detalle_ValorUnitario_cursor_1');

async function elegirRadio(t, contenedor, texto) {
    const opcion = Selector(`${contenedor} .dx-radiobutton`).withText(texto);
    if (await opcion.with({ timeout: 5000 }).exists) {
        await t.click(opcion.nth(0));
        return;
    }
    // Versión actual: es una lista desplegable
    const campo = Selector(contenedor);
    await t.expect(campo.with({ timeout: 10000 }).exists).ok(`No está el campo ${contenedor}`);
    const actual = await campo.find('input.dx-texteditor-input').exists ? await campo.find('input.dx-texteditor-input').value : await campo.innerText;
    if ((texto instanceof RegExp ? texto : new RegExp(texto, 'i')).test(actual || '')) {
        return;
    }
    await t.click(campo.find('.dx-dropdowneditor-input-wrapper, .dx-lookup-field').nth(0));
    const item = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(texto);
    await t
        .expect(item.with({ timeout: 10000 }).exists).ok(`No está la opción "${texto}" en ${contenedor}`)
        .click(item.nth(0));
}

async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion(t, config);
    await editarTransaccion360(t, '01QA');
    const pestana = Selector('[id^="tabs_documento_"]').filterVisible().withText(/Inventario|Precio/i);
    if (!await Selector('#TxtTransaccion_Precio_Unitario').filterVisible().exists && await pestana.exists) {
        await t.click(pestana.nth(0)).wait(1000);
    }
    await elegirRadio(t, '#TxtTransaccion_Precio_Unitario', 'Precio producto sugerido');
    await elegirRadio(t, '#TxtTransaccion_Origen_Precio_Unitario', /Seg[uú]n Cantidad/i);
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);

    await nuevoDocumento360(t, '01QA', /^\s*01QA -/i);
    await guardarDocumento360(t);
    const obtenidos = [];
    try {
        await escribirProductoDocumento(t, PRODUCTO);
        for (const [cant] of PRECIOS) {
            await t
                .click(cantidad)
                .pressKey('ctrl+a')
                .pressKey('backspace')
                .typeText(cantidad, cant)
                .pressKey('enter')
                .wait(2000);
            obtenidos.push(numeroDesdeTexto(await valorUnitario.value));
        }
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
    const esperado = PRECIOS.map(([, precio]) => precio);
    await t.expect(obtenidos).eql(esperado,
        `Valor unitario por cantidad 1/2/3: obtenido ${obtenidos.join(' / ')}, esperado ${esperado.join(' / ')}`);
    await cerrarSesion360(t);
}

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMaestros(t, 'Transacciones');
    await t
        .typeText('#gridTransacciones .dx-texteditor-input', '01QA', { replace: true })
        .wait(2000)
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1))
        .wait(2000)
        .click(Selector('#TxtTransaccion_Precio_Unitario div').withText('Precio producto sugerido'))
        .click(Selector('#TxtTransaccion_Origen_Precio_Unitario div').withText('Segun Cantidad'))
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .wait(2000);
    await HelpersHappgi.cerrarPestana(t);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click(Selector('#ListagridDocumentos .dx-button-content').nth(1));
    await HelpersHappgi.abrirTransaccion(t, '01QA');
    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(3500)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .wait(2000);
    for (const [cant, precio] of PRECIOS) {
        await t
            .click(cantidad)
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(cantidad, cant)
            .pressKey('enter')
            .wait(2000);
        const valor = await HelpersHappgi.parseValorNumerico('#txtDocumento_Detalle_ValorUnitario_cursor_1');
        await t.expect(valor).eql(precio, `Valor unitario incorrecto con cantidad ${cant}`);
    }
    await HelpersHappgi.eliminarDocumento(t);
    await HelpersHappgi.cerrarPestana(t);
    await HelpersHappgi.cerrarSesion(t);
}

fixture `INC104 Precio Segun Unidad - Test Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC104 Precio Segun Unidad - Test Happgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});

fixture `INC104 Precio Segun Unidad - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC104 Precio Segun Unidad - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});
