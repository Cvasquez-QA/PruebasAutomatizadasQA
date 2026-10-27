import { ClientFunction, Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    parseTextoNumerico
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    eliminarDocumentoActual360,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testHappgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

/**
 * INC083 - Un documento de entrada (TX 05QA) con bodega 01 en el encabezado debe sumar el saldo del producto
 * en esa bodega. Se compara el saldo de 010202 en la bodega 01 antes y después; el documento se elimina.
 */

const PRODUCTO = '010202';
const BODEGA = '01 - PRINCIPAL';
const CODIGO_BODEGA = '01';
const CANTIDAD = 10;

const filasProductos = Selector('[data-testid="gridProductos"]').filterVisible().find('tr.dx-data-row');
const pestanaSaldos = Selector('[role="tab"]').filterVisible().withExactText('Saldos');

const leerSaldoBodegaCliente = ClientFunction(bodega => {
    const grid = document.getElementById('gridProductosSaldos');
    if (!grid || !grid.querySelector('.dx-header-row')) {
        return null;
    }
    const encabezados = Array.from(grid.querySelectorAll('.dx-header-row td')).map(td => td.innerText.trim().toLowerCase());
    const iSaldo = encabezados.indexOf('saldo');
    const iBodega = encabezados.indexOf('bodega');
    if (iSaldo < 0 || iBodega < 0) {
        return null;
    }
    const fila = Array.from(grid.querySelectorAll('tr.dx-data-row')).find(f => f.cells[iBodega] && f.cells[iBodega].innerText.trim() === bodega);
    return fila ? fila.cells[iSaldo].innerText.trim() : '0';
});

async function leerSaldoProducto(t) {
    await abrirMaestros360(t, 'Productos', 'productos');
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    for (const inicio = Date.now(); Date.now() - inicio < 15000;) {
        if (await filasProductos.count === 1 && await filasProductos.nth(0).find('td').withExactText(PRODUCTO).exists) {
            break;
        }
        await t.wait(500);
    }
    await t.wait(1000);
    await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
    await t
        .click(pestanaSaldos.with({ timeout: 15000 }))
        .expect(Selector('#gridProductosSaldos').with({ timeout: 15000 }).visible).ok('No se ve la grid de saldos del producto');
    const refrescar = Selector('#gridProductosSaldos .dx-icon-refresh').filterVisible();
    if (await refrescar.exists) {
        await t.click(refrescar.nth(0));
    }
    await t.wait(3000);
    const texto = await leerSaldoBodegaCliente(CODIGO_BODEGA);
    await t.expect(texto).notEql(null, `No se pudo leer el saldo del producto ${PRODUCTO}`);
    await cerrarPestana360(t);
    return parseTextoNumerico(texto);
}

async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion(t, config);
    const saldoInicial = await leerSaldoProducto(t);

    await nuevoDocumento360(t, '05QA', /^\s*05QA -/);
    await elegirEnLookup360(t, '#Documento_Bodega', BODEGA);
    const numero = await guardarDocumento360(t);
    let saldoFinal = null;
    try {
        await agregarLineaDocumento(t, PRODUCTO, { cantidad: CANTIDAD, valor: 1000 });
        await cerrarPestana360(t);
        saldoFinal = await leerSaldoProducto(t);
    } finally {
        await nuevoDocumento360(t, '05QA', /^\s*05QA -/);
        await t
            .typeText('#txtDocumento .dx-texteditor-input', String(numero), { replace: true })
            .pressKey('enter')
            .wait(3000);
        if (await Selector('#txtDocumento .dx-texteditor-input').value === String(numero)) {
            await eliminarDocumentoActual360(t);
        }
        await cerrarPestana360(t);
    }
    await t.expect(saldoFinal).eql(saldoInicial + CANTIDAD,
        `El saldo de ${PRODUCTO} en la bodega ${CODIGO_BODEGA} no aumentó en ${CANTIDAD} (antes ${saldoInicial}, después ${saldoFinal})`);
    await cerrarSesion360(t);
}

/* ----------------------------- Happgi (legacy) ----------------------------- */

fixture `Prueba Documentos testHappgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await HelpersHgi360.limpiarCacheChromeTestCafe(t);
    });

test('Prueba Documentos testhappgi admin', async t => {
    await HelpersHappgi.ingresarAplicacion(t, testHappgiAdminConfig);
    await HelpersHappgi.abrirMaestros(t, 'Productos');
    await t
        .typeText(Selector('.dx-texteditor-input'), '010202')
        .wait(2000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .typeText(Selector('.dx-texteditor-input').nth(35), '01')
        .wait(2000);
    const producto = await Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(1).find('td').nth(1).innerText;
    const saldo = Number(producto.replace(',', '.'));
    await t
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'));
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, '04');
    await t
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .click(Selector('#Documento_Bodega .dx-lookup-field'))
        .click(Selector('.dx-item-content').withText('01'))
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010202')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '10')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .wait(3000);
    await HelpersHappgi.abrirMaestros(t, 'Productos');
    await t
        .typeText(Selector('.dx-texteditor-input'), '010202')
        .wait(2000)
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#gridProductosSaldos .dx-icon.dx-icon-refresh')
        .typeText(Selector('.dx-texteditor-input').nth(35), '01')
        .wait(2000);
    const productoNew = await Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines').nth(1).find('td').nth(1).innerText;
    const saldoNew = Number(productoNew.replace(',', '.'));
    await t
        .expect(saldoNew).eql(saldo + 10, 'el valor del saldo no corresponde al correcto luego de hacer la compra')
        .switchToMainWindow()
        .click(Selector('#TabsMenu .dx-icon.dx-icon-close'))
        .switchToMainWindow();
    await HelpersHappgi.cerrarSesion(t);
});

fixture `Prueba INC083 Saldos a bodega Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC083 Saldos a bodega Admin - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});
