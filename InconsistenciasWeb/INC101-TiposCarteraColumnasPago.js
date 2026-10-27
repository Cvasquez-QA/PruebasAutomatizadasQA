import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    guardarFormaCartera360,
    ingresarAplicacion,
    leerFormaCartera360,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC101 - Según la forma de cartera de Parámetros (General, Cuotas, Grupos, Tipo) la grid de cartera del pago
 * (01 - RECIBO DE CAJA) muestra las columnas correspondientes. Al final se restaura la forma de cartera original.
 * No se guarda ningún pago.
 */

const COLUMNAS_COMUNES = ['Transacción', 'Doc', 'DocRef', 'Fecha', 'Edad', 'Valor'];
const TIPOS_CARTERA = [
    { nombre: 'General', indice: 0, columnas: [] },
    { nombre: 'Cuotas', indice: 1, columnas: ['Cuota'] },
    { nombre: 'Grupos', indice: 2, columnas: ['Tipo', 'Grupo'] },
    { nombre: 'Tipo', indice: 3, columnas: ['Tipo'] }
];
const confirmar = Selector('button.swal2-confirm').filterVisible();

const encabezadosCartera = ClientFunction(() => {
    const grid = document.querySelector('#gridCartera, [data-testid="gridCartera"]');
    return grid ? Array.from(grid.querySelectorAll('[role="columnheader"]')).map(c => c.innerText.trim()).filter(Boolean) : [];
});

async function columnasDelPago(t) {
    await abrirMovimientos360(t, 'Pagos');
    await t.click(Selector('[id^="BtnNuevoDocumentosPago"]').filterVisible().with({ timeout: 20000 }).nth(0));
    await elegirEnLookup360(t, '#TxtDocumentosPago_Transaccion', 'RECIBO DE CAJA', 'RECIBO');
    await t.wait(2000);
    const columnas = await encabezadosCartera();
    await cerrarPestana360(t);
    if (await confirmar.with({ timeout: 2000 }).exists) {
        await t.click(confirmar);
    }
    return columnas;
}

fixture `INC101 Tipos Cartera Columnas Pago Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC101 Tipos Cartera Columnas Pago', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    const original = await leerFormaCartera360(t);
    await t.expect(original.includes(-1)).notOk(`No se pudo leer la forma de cartera de Parámetros (${original})`);

    const errores = [];
    try {
        for (const tipo of TIPOS_CARTERA) {
            await guardarFormaCartera360(t, [tipo.indice, tipo.indice]);
            const columnas = await columnasDelPago(t);
            const faltantes = [...COLUMNAS_COMUNES, ...tipo.columnas].filter(c => !columnas.includes(c));
            if (faltantes.length) {
                errores.push(`${tipo.nombre}: faltan ${faltantes.join(', ')} (columnas: ${columnas.join(', ') || 'ninguna'})`);
            }
        }
    } finally {
        await guardarFormaCartera360(t, original);
    }
    await t.expect(errores.join(' | ')).eql('', `Columnas de cartera en el pago: ${errores.join(' | ')}`);
    await cerrarSesion360(t);
});
