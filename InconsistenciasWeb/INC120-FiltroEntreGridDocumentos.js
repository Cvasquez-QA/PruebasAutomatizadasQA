import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC120 - Filtro "Entre" de la grid de Documentos (12-nov-2026).
 * En Movimientos > Documentos, al elegir "Entre" en el operador del filtro de la columna FECHA deben aparecer
 * los dos campos del rango (Inicio y Fin) y debe poder escribirse en ambos. Solo filtra: no abre ni guarda documentos.
 *
 * Revisado en el navegador el 12-nov-2026: la grid tiene Gestión | Transacción | Documento | Fecha | ... y los
 * operadores de filtro están en Transacción, Documento, Fecha y Nombre. La prueba abría el segundo operador
 * (Documento); ahora busca la columna por su título "Fecha". Con "Entre" los dos campos NO quedan en la celda:
 * se abren en un panel aparte (.dx-datagrid-filter-range-overlay) con placeholders "Inicio" y "Fin", y aceptan
 * fechas en formato aaaa-mm-dd. Al salir del panel la celda muestra "inicio - fin".
 */

const COLUMNA = 'Fecha';
const FECHA_INICIO = '2026-11-01';
const FECHA_FIN = '2026-11-12';

const grid = Selector('[data-testid="ListagridDocumentos"], #ListagridDocumentos');
const filaFiltro = grid.find('tr.dx-datagrid-filter-row');
const opcionEntre = Selector('.dx-overlay-content').filterVisible().find('.dx-menu-item').withText('Entre');
const panelRango = Selector('.dx-datagrid-filter-range-overlay .dx-overlay-content').filterVisible();
const camposRango = panelRango.find('input.dx-texteditor-input');

/** Celda de la fila de filtros que corresponde a la columna con ese título (se empareja por aria-colindex). */
async function celdaFiltro(t, titulo) {
    const encabezado = grid.find('.dx-header-row td').withExactText(titulo);
    await t.expect(encabezado.with({ timeout: 10000 }).exists).ok(`La grid de Documentos no tiene la columna ${titulo}`);
    const indice = await encabezado.getAttribute('aria-colindex');
    return filaFiltro.find(`td[aria-colindex="${indice}"]`);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 })
        .expect(filaFiltro.with({ timeout: 20000 }).visible).ok('La grid de Documentos no mostró la fila de filtros');

    const celda = await celdaFiltro(t, COLUMNA);
    const menu = celda.find('.dx-menu-item-has-icon');
    await t.expect(menu.with({ timeout: 10000 }).visible).ok(`No se ve el operador del filtro de la columna ${COLUMNA}`);
    for (let intento = 0; intento < 2 && !await opcionEntre.exists; intento++) {
        await t.click(menu).wait(500);
    }
    await t
        .expect(opcionEntre.with({ timeout: 5000 }).visible).ok(`No apareció la opción "Entre" en el filtro de ${COLUMNA}`)
        .click(opcionEntre)
        .expect(camposRango.nth(0).with({ timeout: 10000 }).visible).ok(`El filtro "Entre" de ${COLUMNA} no mostró el campo Inicio`)
        .expect(camposRango.nth(1).visible).ok(`El filtro "Entre" de ${COLUMNA} no mostró el campo Fin`)
        .typeText(camposRango.nth(0), FECHA_INICIO, { replace: true })
        .typeText(camposRango.nth(1), FECHA_FIN, { replace: true })
        .expect(camposRango.nth(0).value).eql(FECHA_INICIO, 'No quedó la fecha inicial del filtro "Entre"')
        .expect(camposRango.nth(1).value).eql(FECHA_FIN, 'No quedó la fecha final del filtro "Entre"')
        .pressKey('tab')
        .expect(celda.innerText).contains(FECHA_INICIO, `La celda del filtro de ${COLUMNA} no muestra la fecha inicial`, { timeout: 5000 })
        .expect(celda.innerText).contains(FECHA_FIN, `La celda del filtro de ${COLUMNA} no muestra la fecha final`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `INC120 Filtro Entre grid documentos - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC120 Filtro Entre grid documentos - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
