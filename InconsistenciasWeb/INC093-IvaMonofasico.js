import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    editarTransaccion360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    asegurarDependenciaDocumento360,
    eliminarDocumentoActual360,
    elegirTerceroDocumento,
    guardarDocumento360,
    leerTotalesDocumento,
    nuevoDocumento360,
    numeroDesdeTexto
} from '../Funciones/HelpersDocumentos360.js';
import {
    abrirPuntoDeVenta360,
    agregarProductoPV,
    elegirTransaccionPV,
    eliminarTemporalPV,
    limpiarTemporalPV,
    salirPuntoDeVenta360
} from '../Funciones/HelpersPos360.js';
import { testAdminConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC093 - IVA monofásico.
 *
 * Qué valida: un producto marcado como "IVA monofásico" (010204: tarifa 10 %, precio 10.000) se vende con el IVA
 * INCLUIDO en el precio cuando la transacción tiene "Iva Monofásico", y sin IVA cuando la transacción no lo tiene.
 * En ningún caso el IVA se suma por encima del precio.
 *
 * Revisado en el navegador el 11-nov-2026 (test.hgi360.com, empresa 8902):
 *  - Admin, 0101Doc (con Iva Monofásico): Subtotal 9.090,91 + IVA 909,09 = Total 10.000.
 *  - Admin, 05QA (sin Iva Monofásico): IVA 0.
 *  - POS, 0101 con Iva Monofásico: Subtotal 9.090,91, IVA 909,09, Total 10.000.
 *  - POS, 0101 / 0101.2 sin Iva Monofásico: Subtotal 10.000, IVA 0, Total 10.000.
 * Antes la prueba esperaba IVA de 1.000 (10 % encima del precio) y que en el POS la 0101 costara más que la
 * 0101.2; las dos cosas no corresponden a cómo funciona el IVA monofásico (el precio al público no cambia) y,
 * además, en el POS ninguna de las dos transacciones tenía la marca.
 *
 * La prueba deja el producto con la marca, la 0101Doc con la marca y la 05QA sin ella (como antes). En el POS marca
 * la 0101 solo durante la prueba y siempre la vuelve a dejar sin la marca. Los documentos se eliminan.
 */

const PRODUCTO = '010204';
const TARIFA_IVA = 10;
const PRECIO = 10000;
// IVA incluido en el precio: precio - precio / (1 + tarifa)
const IVA_INCLUIDO = Math.round((PRECIO - PRECIO / (1 + TARIFA_IVA / 100)) * 100) / 100; // 909.09
const CHECK_TX = '#TxtTransaccion_Tribu_Iva_Monofasico';

const casi = (a, b) => Math.abs(a - b) <= 0.02;

async function exigir(t, selector, descripcion) {
    await t.expect(Selector(selector).with({ timeout: 10000 }).exists).ok(`No está el campo ${descripcion} (${selector})`);
}

/** Marca o desmarca "Iva Monofásico" en la transacción (pestaña Documentos) y guarda. */
async function marcaTransaccion(t, codigo, marcar) {
    await editarTransaccion360(t, codigo, 'Documentos');
    await exigir(t, CHECK_TX, `IVA monofásico de la transacción ${codigo}`);
    if (marcar) {
        await marcarCheckboxSiNoEsta(t, CHECK_TX);
    } else {
        await desmarcarCheckboxSiEsta(t, CHECK_TX);
    }
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);
}

async function marcarProducto(t) {
    await abrirMaestros360(t, 'Productos', 'productos');
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    await t.wait(2000);
    await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
    await exigir(t, '#txtMaestroProductos_IvaMonofasico', 'IVA monofásico del producto');
    await marcarCheckboxSiNoEsta(t, '#txtMaestroProductos_IvaMonofasico');
    await guardarMaestro360(t, 'Producto');
    await cerrarPestana360(t);
}

/* ----------------------------- Administrativo (Documentos) ----------------------------- */

async function totalesDeDocumento(t, filtro, texto, { tercero = null, dependencia = false } = {}) {
    await nuevoDocumento360(t, filtro, texto);
    if (tercero) {
        await elegirTerceroDocumento(t, tercero);
    }
    if (dependencia) {
        await asegurarDependenciaDocumento360(t);
    }
    await guardarDocumento360(t);
    try {
        // Sin valor: se usa el precio del producto (10.000)
        await agregarLineaDocumento(t, PRODUCTO, { cantidad: 1 });
        await t.wait(3000);
        const totales = await leerTotalesDocumento();
        console.log(`[INC093] ${filtro}: ${JSON.stringify(totales)}`);
        return totales;
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
}

/* ----------------------------- Punto de Venta ----------------------------- */

/** IVA, valor y total de la línea del producto en el grid del Punto de Venta (columnas por nombre). */
const leerLineaPVCliente = ClientFunction(producto => {
    const visible = e => !!(e && e.getClientRects().length);
    const texto = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
    const grids = Array.prototype.filter.call(document.querySelectorAll('.dx-datagrid'), visible);
    for (let g = 0; g < grids.length; g++) {
        const grid = grids[g];
        const filas = Array.prototype.filter.call(grid.querySelectorAll('tr.dx-data-row'), fila =>
            Array.prototype.some.call(fila.cells, td => texto(td).toUpperCase() === producto.toUpperCase()));
        if (!filas.length) {
            continue;
        }
        let contenedor = grid;
        while (contenedor && !contenedor.querySelector('.dx-header-row')) {
            contenedor = contenedor.parentElement;
        }
        const encabezados = {};
        if (contenedor) {
            Array.prototype.forEach.call(contenedor.querySelector('.dx-header-row').cells, (td, i) => {
                encabezados[td.getAttribute('aria-colindex') || String(i + 1)] = texto(td).toLowerCase();
            });
        }
        const datos = {};
        Array.prototype.forEach.call(filas[0].cells, (td, i) => {
            const nombre = encabezados[td.getAttribute('aria-colindex') || String(i + 1)];
            if (nombre) {
                datos[nombre] = texto(td);
            }
        });
        return datos;
    }
    return null;
});

async function lineaPV(t, transaccion) {
    const datos = await leerLineaPVCliente(PRODUCTO);
    await t.expect(datos).ok(`No se encontró la línea del producto ${PRODUCTO} en el Punto de Venta (${transaccion})`);
    console.log(`[INC093] POS ${transaccion}: ${JSON.stringify(datos)}`);
    return { iva: numeroDesdeTexto(datos.iva), valor: numeroDesdeTexto(datos.valor), total: numeroDesdeTexto(datos.total) };
}

async function ventaPV(t, filtro, texto) {
    await elegirTransaccionPV(t, filtro, texto);
    await limpiarTemporalPV(t);
    const total = await agregarProductoPV(t, PRODUCTO, '1');
    await t.wait(2000);
    try {
        return { ...(await lineaPV(t, filtro)), totalDocumento: total };
    } finally {
        await eliminarTemporalPV(t);
    }
}

/* ----------------------------- Pruebas ----------------------------- */

fixture `INC093 Iva Monofasico Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC093 Iva Monofasico Admin - Test Hgi360', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await marcarProducto(t);
    await marcaTransaccion(t, '0101Doc', true);
    await marcaTransaccion(t, '05QA', false);

    const compra = await totalesDeDocumento(t, '05QA', /^\s*05QA -/i, { tercero: '811021438' });
    // La dependencia la trae el tercero: con el tercero por defecto (0 - GENERAL) queda vacía
    const venta = await totalesDeDocumento(t, '0101Doc', /^\s*0101Doc -/i, { tercero: '811021438', dependencia: true });

    await t
        .expect(compra.iva).eql(0, `La compra (05QA, sin Iva Monofásico) no debe traer IVA y trajo ${compra.iva}`)
        .expect(casi(venta.iva, IVA_INCLUIDO)).ok(
            `La venta (0101Doc, con Iva Monofásico) debe traer el IVA incluido en el precio (${IVA_INCLUIDO}) y trajo ${venta.iva}`)
        .expect(casi(venta.total, PRECIO)).ok(
            `Con IVA monofásico el total debe seguir siendo el precio (${PRECIO}) y quedó en ${venta.total}`)
        .expect(casi(venta.subtotal + venta.iva, venta.total)).ok(
            `Subtotal (${venta.subtotal}) + IVA (${venta.iva}) debe ser igual al total (${venta.total})`);
    await cerrarSesion360(t);
});

fixture `INC093 Iva Monofasico Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC093 Iva Monofasico Punto de Venta - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    // 0101 con la marca solo durante la prueba; 0101.2 sin ella
    await marcaTransaccion(t, '0101', true);
    await marcaTransaccion(t, '0101.2', false);
    const lineas = {};
    let fallo = null;
    try {
        await abrirPuntoDeVenta360(t);
        try {
            lineas['0101'] = await ventaPV(t, '0101', '0101 - PRUEBA FACTURA PV');
            lineas['0101.2'] = await ventaPV(t, '0101.2', '0101.2 - PRUEBA FACTURA PV');
        } finally {
            await salirPuntoDeVenta360(t);
        }
    } catch (e) {
        fallo = e;
    }
    // La 0101 es la transacción principal del POS: siempre se deja sin la marca
    try {
        await marcaTransaccion(t, '0101', false);
    } catch (e) {
        if (!fallo) {
            fallo = e;
        }
    }
    if (fallo) {
        throw fallo;
    }
    const con = lineas['0101'];
    const sin = lineas['0101.2'];
    await t
        .expect(casi(con.iva, IVA_INCLUIDO)).ok(
            `La 0101 (con Iva Monofásico) debe traer el IVA incluido en el precio (${IVA_INCLUIDO}) y trajo ${con.iva}`)
        .expect(sin.iva).eql(0, `La 0101.2 (sin Iva Monofásico) no debe traer IVA y trajo ${sin.iva}`)
        .expect(casi(con.total, PRECIO)).ok(`Con IVA monofásico el total de la línea debe seguir siendo ${PRECIO} y quedó en ${con.total}`)
        .expect(casi(sin.total, PRECIO)).ok(`Sin IVA monofásico el total de la línea debe ser ${PRECIO} y quedó en ${sin.total}`);
    await cerrarSesion360(t);
});
