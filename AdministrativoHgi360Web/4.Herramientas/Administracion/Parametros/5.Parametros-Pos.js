import { Selector } from 'testcafe';
import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametros360.js';
import {
    validarPestanaParametros360,
    abrirPestanaParametros360,
    editarParametros360,
    validarColumnasGrid360,
    agregarFilaGrid360,
    editarFilaGrid360,
    escribirCampoPopupParametros,
    guardarPopupParametros,
    cerrarPopupParametros,
    popupEdicionParametros,
    eliminarFilaGridParametros360,
    eliminarFilaSiExisteParametros360,
    filaGridParametros
} from '../../../../Funciones/HelpersParametros360.js';
import { GRIDS_PARAMETROS } from '../../../../Funciones/InventarioParametros360.js';

// Herramientas > Parámetros > Pos (prueba nueva, 29-oct-2026). test.hgi360.com, AutAdmin, 8902.
// 1) Nombres de los 9 parámetros (Punto de Venta y Puerto Serial), solo lectura sin Editar y clic en cada uno.
// 2) Grid "Pendientes" (documentos temporales del POS, números negativos; ~330 registros en 22 páginas, el
//    primero es el menor): crea el pendiente DOCUMENTO, lo consulta con Editar y lo elimina. Si quedó de una
//    corrida anterior, lo borra antes. El 29-oct-2026 quedó creado el -9901 al revisar la pantalla.

const GRID = GRIDS_PARAMETROS.PosPendientes;
const DOCUMENTO = '-9901';

fixture `Parámetros - Pos - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Pos - nombres y parámetros clickeables - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Pos');
    });
});

test('Parámetros Pos > Pendientes - CRUD del grid - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await editarParametros360(t);
        await abrirPestanaParametros360(t, GRID.pestana);
        await validarColumnasGrid360(t, GRID.grid, GRID.columnas);

        await eliminarFilaSiExisteParametros360(t, GRID.grid, DOCUMENTO);
        const nuevo = DOCUMENTO;

        // Crear
        await agregarFilaGrid360(t, GRID.grid);
        await escribirCampoPopupParametros(t, 'IntDocumento', nuevo);
        await guardarPopupParametros(t);
        await t.expect(filaGridParametros(GRID.grid, nuevo).with({ timeout: 15000 }).exists)
            .ok(`No aparece el documento pendiente ${nuevo}`);

        // Consultar (el número del pendiente no se modifica)
        await editarFilaGrid360(t, GRID.grid, nuevo);
        await t.expect(popupEdicionParametros.find('input[id$="_IntDocumento"]').value)
            .eql(nuevo, 'El formulario de edición no muestra el documento pendiente');
        await cerrarPopupParametros(t);

        // Eliminar
        await eliminarFilaGridParametros360(t, GRID.grid, nuevo);
        await t.expect(Selector('.swal2-popup').filterVisible().withText(/no se puede/i).exists).notOk('El ERP no permitió eliminar el pendiente');
    });
});
