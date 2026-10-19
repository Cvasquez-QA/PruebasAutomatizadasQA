import { ClientFunction, Selector } from 'testcafe';
import {
    abrirReportes360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360, abrirMaestroMenu360, elegirOpcion } from '../../../Funciones/HelpersMaestros360.js';
import { numeroDesdeTexto } from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Saldos (test.hgi360.com, AutPos): Reportes > Inventarios > Kardex del producto 01 desde el año 2000.
// Suma las entradas y salidas del reporte, las compara con los totales del grid y con el saldo del
// producto en la bodega 01 (Maestros > Productos > saldos).
// PENDIENTE: la pantalla de reportes de la versión React no se pudo recorrer en el navegador:
// los controles se buscan por su texto (Seleccione un reporte, Año, Consultar) y las columnas por nombre.
const REPORTE = 'Kardex';
const ANIO = '2000';
const PRODUCTO = '01';
const BODEGA = '01';

const leerColumnasCliente = ClientFunction(() => {
    const grid = [...document.querySelectorAll('.dx-datagrid')].find(g => g.getClientRects().length > 0 && g.querySelector('tr.dx-data-row'));
    if (!grid) {
        return null;
    }
    const encabezados = [...grid.querySelectorAll('.dx-header-row td')].map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase());
    const filas = [...grid.querySelectorAll('tr.dx-data-row')].map(f => [...f.cells].map(c => c.innerText.trim()));
    const totales = [...grid.querySelectorAll('.dx-footer-row td')].map(td => td.innerText.trim());
    return { encabezados, filas, totales };
});

const leerSaldoBodegaCliente = ClientFunction(bodega => {
    const grid = document.querySelector('[data-testid="gridProductosSaldos"], #gridProductosSaldos');
    if (!grid) {
        return null;
    }
    const encabezados = [...grid.querySelectorAll('.dx-header-row td')].map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase());
    const iSaldo = encabezados.findIndex(h => h.includes('saldo') || h.includes('existencia'));
    const fila = [...grid.querySelectorAll('tr.dx-data-row')]
        .find(f => [...f.cells].some(c => c.innerText.trim() === bodega || c.innerText.trim().startsWith(`${bodega} -`)));
    return fila && iSaldo >= 0 ? fila.cells[iSaldo].innerText : null;
});

const sumarColumna = (datos, nombre) => {
    const i = datos.encabezados.findIndex(h => h.includes(nombre));
    return i < 0 ? null : datos.filas.reduce((suma, fila) => suma + numeroDesdeTexto(fila[i]), 0);
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirReportes360(t, 'Inventarios');

    await t.click(Selector('.dx-lookup-field').filterVisible().withText(/Seleccione un reporte/i).with({ timeout: 20000 }));
    await elegirOpcion(t, REPORTE);
    const lookupProducto = Selector('.dx-lookup, .dx-texteditor').filterVisible().withText(/Producto/i).find('.dx-lookup-field');
    if (await lookupProducto.with({ timeout: 3000 }).exists) {
        await t.click(lookupProducto);
        await filtrarPor(t, PRODUCTO);
        await elegirOpcion(t, new RegExp(`^\\s*${PRODUCTO} -`));
    }
    const lookupAnio = Selector('.dx-texteditor').filterVisible().withText(/Año/i).find('.dx-lookup-field, .dx-dropdowneditor-input-wrapper');
    if (await lookupAnio.with({ timeout: 3000 }).exists) {
        await t.click(lookupAnio.nth(0));
        await elegirOpcion(t, ANIO);
    }
    await t.click(Selector('.dx-button').filterVisible().withText(/Consultar|Generar/i).nth(0)).wait(8000);

    let datos = null;
    for (const inicio = Date.now(); !datos && Date.now() - inicio < 60000;) {
        datos = await leerColumnasCliente();
        if (!datos) {
            await t.wait(2000);
        }
    }
    await t.expect(datos).ok('El reporte Kardex no trajo movimientos');
    const entradas = sumarColumna(datos, 'entrada');
    const salidas = sumarColumna(datos, 'salida');
    await t
        .expect(entradas).notEql(null, 'El reporte no tiene la columna Entradas')
        .expect(salidas).notEql(null, 'El reporte no tiene la columna Salidas');

    const iEntrada = datos.encabezados.findIndex(h => h.includes('entrada'));
    const iSalida = datos.encabezados.findIndex(h => h.includes('salida'));
    if (datos.totales.length) {
        await t
            .expect(numeroDesdeTexto(datos.totales[iEntrada])).eql(entradas, 'El total de entradas del reporte no es la suma de los movimientos')
            .expect(numeroDesdeTexto(datos.totales[iSalida])).eql(salidas, 'El total de salidas del reporte no es la suma de los movimientos');
    }
    await cerrarPestana360(t);

    // Saldo del producto en la bodega
    await abrirMaestroMenu360(t, 'Productos');
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
    let saldo = null;
    for (const inicio = Date.now(); saldo === null && Date.now() - inicio < 15000;) {
        saldo = await leerSaldoBodegaCliente(BODEGA);
        if (saldo === null) {
            await t.wait(1000);
        }
    }
    await t
        .expect(saldo).notEql(null, `No se encontró la bodega ${BODEGA} en los saldos del producto ${PRODUCTO}`)
        .expect(numeroDesdeTexto(saldo)).eql(entradas - salidas, 'El saldo del producto no coincide con Entradas - Salidas del Kardex');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Saldos Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba sumatoria moviminetos reporte Inventario - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
