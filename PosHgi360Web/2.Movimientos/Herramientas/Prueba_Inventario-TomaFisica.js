import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMovimientos360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { abrirMaestroPos360 } from '../../../Funciones/MenuMaestros360.js';
import {
    nuevoDocumento360,
    guardarDocumento360,
    numeroDesdeTexto,
    confirmarDialogo
} from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Inventario - Toma Física (test.hgi360.com, AutPos):
// 1) lee el saldo del producto 010203 en la bodega 0 (Maestros > Productos > saldos)
// 2) toma física con valor físico 10 y la finaliza
// 3) documento de ajuste (53 entrada o 52 salida) en la bodega 0 con el botón Ajuste
// 4) el saldo del producto en la bodega queda en 10
// PENDIENTE: la pantalla de Toma Física y el grid de saldos del producto no se pudieron recorrer en la
// versión React; los ids son los de la versión anterior (#TomaFisica_*, #BtnFinalizarTF, #BtnEliminarTF).
const PRODUCTO = '010203';
const BODEGA = '0 - GENERAL';
const VALOR_TOMA_FISICA = 10;
const TX_AJUSTE_ENTRADA = { filtro: '53', texto: '53 - AJUSTE ENTRADA' };
const TX_AJUSTE_SALIDA = { filtro: '52', texto: '52 - AJUSTE SALIDA' };
const OBSERVACION = 'PruebaObs';
const MSG_TOMA_FISICA = 'toma física';

const opciones = Selector('.dx-overlay-content').filterVisible().find('.dx-item-content');

const leerSaldoBodegaCliente = ClientFunction(bodega => {
    const grid = document.querySelector('[data-testid="gridProductosSaldos"], #gridProductosSaldos');
    if (!grid) {
        return null;
    }
    const encabezados = [...grid.querySelectorAll('.dx-header-row td')].map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase());
    const iSaldo = encabezados.findIndex(h => h.includes('saldo') || h.includes('existencia'));
    const fila = [...grid.querySelectorAll('tr.dx-data-row')]
        .find(f => [...f.cells].some(c => c.innerText.trim() === bodega || c.innerText.trim().startsWith(`${bodega} -`)));
    if (!fila || iSaldo < 0) {
        return null;
    }
    return fila.cells[iSaldo].innerText;
});

async function leerSaldoProducto(t) {
    await abrirMaestroPos360(t, 'Productos', 'productos');
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
    let texto = null;
    for (const inicio = Date.now(); texto === null && Date.now() - inicio < 15000;) {
        texto = await leerSaldoBodegaCliente('0');
        if (texto === null) {
            await t.wait(1000);
        }
    }
    await t.expect(texto).notEql(null, `No se encontró el saldo del producto ${PRODUCTO} en la bodega 0`);
    await cerrarPestana360(t);
    return numeroDesdeTexto(texto);
}

async function hacerTomaFisica(t) {
    await abrirMovimientos360(t, 'Inventario - Toma Física');
    await t
        .expect(Selector('#TomaFisica_Bodega .dx-lookup-field').with({ timeout: 20000 }).visible).ok('No abrió la Toma Física')
        .click('#TomaFisica_Bodega .dx-lookup-field')
        .click(opciones.withText(BODEGA))
        .wait(1500);

    // Borra una toma física anterior de la bodega, si la hay
    const eliminar = Selector('#BtnEliminarTF').filterVisible();
    if (await eliminar.with({ timeout: 3000 }).exists) {
        await t.click(eliminar);
        if (await confirmarDialogo.with({ timeout: 4000 }).exists) {
            await t.click(confirmarDialogo);
        }
    }

    const producto = Selector('#txtTomaFisica_Detalle_Producto_cursor_1');
    await t
        .typeText(producto, PRODUCTO, { replace: true })
        .pressKey('enter')
        .expect(producto.focused).notOk(`No cargó el producto ${PRODUCTO} en la toma física`, { timeout: 10000 })
        .wait(800)
        .typeText('#txtTomaFisica_Detalle_Fisico_cursor_1', String(VALOR_TOMA_FISICA), { replace: true })
        .typeText('#txtTomaFisica_Detalle_Observaciones_cursor_1', OBSERVACION, { replace: true })
        .click('#txtTomaFisica_Detalle_Boton_1')
        .wait(1500)
        .click(Selector('#BtnFinalizarTF').filterVisible());
    if (await confirmarDialogo.with({ timeout: 4000 }).exists) {
        await t.click(confirmarDialogo);
    }
    await t.expect(Selector('.swal2-popup, .erp-toast').filterVisible().withText(MSG_TOMA_FISICA).with({ timeout: 20000 }).exists)
        .ok('No apareció el mensaje de toma física ejecutada');
    if (await confirmarDialogo.exists) {
        await t.click(confirmarDialogo);
    }
    await cerrarPestana360(t);
}

async function ajustarInventario(t, saldoInicial) {
    const tx = VALOR_TOMA_FISICA > saldoInicial ? TX_AJUSTE_ENTRADA : TX_AJUSTE_SALIDA;
    await nuevoDocumento360(t, tx.filtro, tx.texto);
    await t
        .click('#Documento_Bodega .dx-lookup-field')
        .click(opciones.withText(BODEGA));
    await guardarDocumento360(t);
    await t.click(Selector('#BtnAjuste_btn').filterVisible());
    if (await confirmarDialogo.with({ timeout: 5000 }).exists) {
        await t.click(confirmarDialogo);
    }
    await t.expect(Selector('.erp-toast[data-type="success"]').filterVisible().with({ timeout: 20000 }).exists)
        .ok('El ajuste de inventario no se guardó');
    await cerrarPestana360(t);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const saldoInicial = await leerSaldoProducto(t);
    await hacerTomaFisica(t);
    if (saldoInicial !== VALOR_TOMA_FISICA) {
        await ajustarInventario(t, saldoInicial);
    }
    const saldoFinal = await leerSaldoProducto(t);
    await t.expect(saldoFinal).eql(VALOR_TOMA_FISICA, `El saldo debería quedar en ${VALOR_TOMA_FISICA} (inicial ${saldoInicial})`);
    await cerrarSesion360(t);
}

fixture `Prueba Inventario - Toma Fisica testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Toma fisica y ajuste de inventario Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
