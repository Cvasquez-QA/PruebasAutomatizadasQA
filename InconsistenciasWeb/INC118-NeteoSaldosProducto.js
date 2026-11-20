import { ClientFunction, Selector } from 'testcafe';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cancelarMaestro360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, testHappgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC118 - Neteo de saldos del producto (09-nov-2026).
 * Se identificó que no se estaban neteando las cantidades (saldos) del producto 010203 en la bodega 0: en la
 * pestaña Saldos aparecían dos registros con los mismos valores que solo cambiaban en la columna Saldo.
 *
 * La prueba abre el producto, va a la pestaña Saldos y revisa TODOS los registros (todas las páginas del grid):
 * - Agrupa los registros por todas sus columnas menos las de saldo. Si dos o más registros caen en el mismo grupo,
 *   el saldo no se neteó y la prueba falla mostrando los registros repetidos.
 * - La bodega 0 se revisa siempre y se deja en consola lo que tiene, para poder compararlo con producción.
 * Antes de validar pulsa "Actualizar" en el grid de saldos y espera a que vuelvan a cargar los registros
 * (09-nov-2026, a pedido de QA). No guarda nada en el producto.
 */

const PRODUCTO = '010203';
const BODEGA = '0';
// Columnas que pueden cambiar entre registros de una misma llave (no hacen parte de la comparación)
const COLUMNAS_SALDO = /saldo/i;

/** Lee encabezados y filas visibles del grid de saldos (la página actual), alineando por aria-colindex. */
const leerPaginaSaldos = ClientFunction(() => {
    const txt = e => ((e && e.textContent) || '').replace(/\s+/g, ' ').trim();
    const visible = e => !!(e && e.getClientRects().length);
    const grids = Array.prototype.filter.call(
        document.querySelectorAll('[data-testid="gridProductosSaldos"], #gridProductosSaldos'), visible);
    const grid = grids[0];
    if (!grid) {
        return null;
    }
    const encabezados = {};
    Array.prototype.forEach.call(grid.querySelectorAll('.dx-header-row td'), (td, i) => {
        const indice = td.getAttribute('aria-colindex') || String(i + 1);
        encabezados[indice] = txt(td);
    });
    const filas = Array.prototype.filter.call(grid.querySelectorAll('tr.dx-data-row'), visible).map(tr => {
        const fila = {};
        Array.prototype.forEach.call(tr.querySelectorAll('td'), (td, i) => {
            const indice = td.getAttribute('aria-colindex') || String(i + 1);
            const nombre = encabezados[indice];
            if (nombre) {
                fila[nombre] = txt(td);
            }
        });
        return fila;
    });
    const pager = grid.querySelector('.dx-pager');
    return { encabezados: Object.keys(encabezados).map(k => encabezados[k]).filter(Boolean), filas, paginas: pager ? txt(pager) : '' };
});

/** Lee todas las páginas del grid de saldos. */
async function leerTodosLosSaldos(t, gridSaldos) {
    const todas = [];
    let encabezados = [];
    for (let pagina = 1; pagina <= 50; pagina++) {
        const lectura = await leerPaginaSaldos();
        await t.expect(lectura).ok('No se encontró el grid de saldos del producto');
        encabezados = lectura.encabezados;
        todas.push(...lectura.filas);
        const siguiente = gridSaldos.find('.dx-pager .dx-next-button').filterVisible();
        if (!await siguiente.exists || await siguiente.hasClass('dx-button-disable')) {
            break;
        }
        await t.click(siguiente).wait(1500);
    }
    return { encabezados, filas: todas };
}

/** Valida que no haya registros iguales en todo menos en el saldo. */
/** Pulsa "Actualizar" en el grid de saldos y espera a que terminen de cargar los registros. */
async function actualizarSaldos(t, gridSaldos) {
    await t
        .expect(gridSaldos.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible().with({ timeout: 30000 }).exists)
        .ok(`No cargó el grid de saldos del producto ${PRODUCTO}`);
    const actualizar = gridSaldos.find('[aria-label="Actualizar"], .dx-icon-refresh').filterVisible();
    await t
        .expect(actualizar.with({ timeout: 15000 }).exists).ok('No está el botón Actualizar del grid de saldos del producto')
        .click(actualizar.nth(0))
        .wait(3000);
    // Si aparece un aviso al actualizar, se deja en consola y se cierra para poder leer el grid
    const aviso = Selector('.swal2-popup').filterVisible();
    if (await aviso.exists) {
        console.log(`[INC118] Aviso al actualizar saldos: ${(await aviso.innerText).replace(/\s+/g, ' ')}`);
        const confirmar = Selector('button.swal2-confirm').filterVisible();
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
    }
    const cargando = gridSaldos.find('.dx-loadpanel-content, .dx-datagrid-loadpanel').filterVisible();
    await t
        .expect(cargando.with({ timeout: 2000 }).exists).notOk('El grid de saldos sigue cargando después de actualizar', { timeout: 60000 })
        .expect(gridSaldos.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible().with({ timeout: 30000 }).exists)
        .ok(`No volvieron a cargar los saldos del producto ${PRODUCTO} después de Actualizar`)
        .wait(2000);
}

async function validarNeteo(t, gridSaldos, ambiente) {
    await actualizarSaldos(t, gridSaldos);
    const { encabezados, filas } = await leerTodosLosSaldos(t, gridSaldos);
    const columnaBodega = encabezados.find(c => /bodega/i.test(c));
    const columnasLlave = encabezados.filter(c => !COLUMNAS_SALDO.test(c));
    console.log(`[INC118] ${ambiente} - columnas: ${encabezados.join(' | ')}`);
    console.log(`[INC118] ${ambiente} - registros en Saldos del producto ${PRODUCTO}: ${filas.length}`);

    await t
        .expect(filas.length).gt(0, `El producto ${PRODUCTO} no tiene registros en la pestaña Saldos`)
        .expect(columnaBodega).ok(`El grid de saldos no tiene columna Bodega (columnas: ${encabezados.join(' | ')})`);

    const esBodega = (valor, codigo) => new RegExp(`^${codigo}(\\s|-|$)`).test(valor || '');
    const filasBodega = filas.filter(f => esBodega(f[columnaBodega], BODEGA));
    console.log(`[INC118] ${ambiente} - registros de la bodega ${BODEGA}: ${JSON.stringify(filasBodega)}`);

    const columnasSaldo = encabezados.filter(c => COLUMNAS_SALDO.test(c));
    const grupos = {};
    filas.forEach(f => {
        const llave = columnasLlave.map(c => `${c}=${f[c]}`).join(' | ');
        (grupos[llave] = grupos[llave] || []).push(f);
    });
    const gruposRepetidos = Object.keys(grupos).filter(k => grupos[k].length > 1);
    const describir = k => `[${k}] aparece ${grupos[k].length} veces con ` +
        grupos[k].map(f => columnasSaldo.map(c => `${c}: ${f[c]}`).join(', ')).join(' / ');
    const repetidos = gruposRepetidos.map(describir);
    const repetidosBodega = gruposRepetidos.filter(k => esBodega(grupos[k][0][columnaBodega], BODEGA)).map(describir);
    console.log(`[INC118] ${ambiente} - bodega ${BODEGA}: ${repetidosBodega.length ? 'SIN NETEAR ' + repetidosBodega.join(' || ') : 'sin registros repetidos'}`);

    await t.expect(repetidos.join(' || ')).eql('',
        `No se están neteando los saldos del producto ${PRODUCTO}: hay registros iguales que solo difieren en el saldo. ${repetidos.join(' || ')}`);
}

/* ----------------------------- Hgi360 (ERP web React) ----------------------------- */

async function ejecutarPrueba360(t, config) {
    const gridSaldos = Selector('[data-testid="gridProductosSaldos"], #gridProductosSaldos').filterVisible();
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Productos', 'productos');
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    await t.wait(1500);
    await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
    const pestanaSaldos = Selector('#Tab_Maestro_Productos_Saldos_link');
    await t
        .expect(pestanaSaldos.with({ timeout: 20000 }).visible).ok(`El producto ${PRODUCTO} no tiene la pestaña Saldos`)
        .click(pestanaSaldos)
        .expect(gridSaldos.with({ timeout: 20000 }).exists).ok('No se mostró la grid de saldos del producto');
    let fallo = null;
    try {
        await validarNeteo(t, gridSaldos, config.pagina);
    } catch (e) {
        fallo = e;
    }
    try {
        await cancelarMaestro360(t, 'Producto');
        await cerrarSesion360(t);
    } catch (e) {
        if (!fallo) {
            throw e;
        }
    }
    if (fallo) {
        throw fallo;
    }
}

/* ----------------------------- Happgi (menú anterior) ----------------------------- */

async function ejecutarPruebaHappgi(t, config) {
    const gridProductos = Selector('#gridProductos');
    const gridSaldos = Selector('#gridProductosSaldos').filterVisible();
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMaestros(t, 'Productos');
    const buscador = gridProductos.find('.dx-datagrid-search-panel .dx-texteditor-input');
    await t
        .expect(buscador.with({ timeout: 20000 }).exists).ok('No apareció el buscador del maestro Productos')
        .typeText(buscador, PRODUCTO, { replace: true })
        .wait(2500);
    const fila = gridProductos.find('tr.dx-data-row').filterVisible().filter(tr => {
        return Array.prototype.some.call(tr.querySelectorAll('td'), td => td.textContent.trim() === codigo);
    }, { codigo: PRODUCTO });
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No se encontró el producto ${PRODUCTO} en el maestro`)
        .click(fila.nth(0).find('.dx-link-edit'))
        .wait(3000);
    const pestanaSaldos = Selector('a, span, div.dx-tab-text').filterVisible().withExactText('Saldos');
    if (!await gridSaldos.exists && await pestanaSaldos.exists) {
        await t.click(pestanaSaldos.nth(0)).wait(2000);
    }
    await t.expect(gridSaldos.with({ timeout: 20000 }).exists).ok('No se mostró la grid de saldos del producto');
    try {
        await validarNeteo(t, gridSaldos, config.pagina);
    } finally {
        await t.switchToMainWindow();
        await HelpersHappgi.cerrarSesion(t);
    }
}

fixture `INC118 Neteo saldos producto - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC118 Neteo saldos producto 010203 - Test Hgi360 Admin', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});

fixture `INC118 Neteo saldos producto - Test Happgi Admin`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC118 Neteo saldos producto 010203 - Test Happgi Admin', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});
