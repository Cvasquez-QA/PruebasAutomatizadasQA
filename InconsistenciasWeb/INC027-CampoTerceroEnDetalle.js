import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    cargarDocumento360,
    eliminarDocumentoActual360,
    escribirProductoDocumento,
    esperarLineasDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig, testGourmetConfig, testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC27 - La transacción INC027 tiene el campo Tercero en el detalle (test.hgi360.com, Movimientos > Documentos).
 * En la línea se ve el Tercero con su lupa, se elige 1000099598 y la línea queda grabada con ese tercero.
 * Se ejecuta en los módulos Administrativo, POS y POS Gourmet. El documento se elimina al final.
 */

const TERCERO = '1000099598';
const terceroLinea = Selector('#txtDocumento_Detalle_Tercero_cursor_1');
const lupaTercero = Selector('#txtDocumento_Detalle_Tercero_1 .dx-icon-search, #txtDocumento_Detalle_Tercero_cursor_1 .dx-icon-search').filterVisible();

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, 'INC027', 'INC027');
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
    const aviso = Selector('.erp-toast[data-type="error"], .erp-toast[data-type="warning"], .swal2-popup, .erp-form-error__text').filterVisible();
    if (!await Selector('#txtDocumento .dx-texteditor-input').value && await aviso.exists) {
        await t.expect(false).ok(`El encabezado no se guardó: ${(await aviso.nth(0).innerText).replace(/\s+/g, ' ').trim()}`);
    }
    const numero = await guardarDocumento360(t);

    try {
        await escribirProductoDocumento(t, '010203');
        await t
            .expect(terceroLinea.with({ timeout: 10000 }).visible).ok('No está el campo Tercero en el detalle')
            .expect(lupaTercero.exists).ok('No está la lupa para buscar el tercero del detalle')
            .click(lupaTercero);
        const fila = Selector('.dx-overlay-content tr.dx-data-row').filterVisible().withText(TERCERO);
        const buscar = Selector('.dx-overlay-content .dx-datagrid-search-panel .dx-texteditor-input').filterVisible();
        if (await buscar.with({ timeout: 8000 }).exists) {
            await t.typeText(buscar, TERCERO, { replace: true }).wait(2000);
        }
        await t
            .expect(fila.with({ timeout: 10000 }).exists).ok(`El buscador de terceros del detalle no muestra ${TERCERO}`)
            .doubleClick(fila.nth(0).find('td').withText(TERCERO))
            .wait(2000);
        // En POS el doble clic a veces no pasa el tercero: se marca la fila y se confirma con Enter o con el botón del buscador
        if (!String(await terceroLinea.value).includes(TERCERO) && await fila.filterVisible().exists) {
            await t.click(fila.nth(0).find('td').withText(TERCERO)).pressKey('enter').wait(1500);
            const aceptar = Selector('.dx-overlay-content .dx-button').filterVisible().withText(/Seleccionar|Aceptar/i);
            if (await aceptar.exists) {
                await t.click(aceptar.nth(0)).wait(1500);
            }
        }
        const valorTercero = await terceroLinea.value;
        const textoOverlay = await Selector('.dx-overlay-content').filterVisible().exists
            ? (await Selector('.dx-overlay-content').filterVisible().nth(-1).innerText).replace(/\s+/g, ' ').slice(0, 200)
            : 'sin ventana abierta';
        await t
            .expect(valorTercero).contains(TERCERO, `No se seleccionó el tercero en la línea (ventana: ${textoOverlay})`)
            .click('#txtDocumento_Detalle_Boton_1 .dx-icon-save');
        await esperarLineasDocumento(t, 1, 'No se grabó la línea');

        await cargarDocumento360(t, numero);
        const [linea] = await esperarLineasDocumento(t, 1, 'El documento recargado no tiene la línea');
        const tercero = Object.keys(linea).find(clave => clave.startsWith('tercero'));
        await t
            .expect(tercero).ok(`El detalle no tiene la columna Tercero (${Object.keys(linea).join(', ')})`)
            .expect(linea[tercero]).contains(TERCERO, 'No se guardó el tercero seleccionado en la línea');
    } finally {
        const confirmar = Selector('button.swal2-confirm').filterVisible();
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        await t.pressKey('esc');
        await eliminarDocumentoActual360(t).catch(() => undefined);
    }
    await t.expect(Selector('#txtDocumento .dx-texteditor-input').value).notOk(`No se eliminó el documento ${numero}`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba campo tercero en detalle Admin testerp`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba campo tercero en detalle testerp Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba campo tercero en detalle POS testerp`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba campo tercero en detalle testerp POS', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});

fixture `Prueba campo tercero en detalle POS Gourmet testerp`
    .page(testGourmetConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba campo tercero en detalle testerp POS Gourmet', async t => {
    await ejecutarPrueba(t, testGourmetConfig);
});