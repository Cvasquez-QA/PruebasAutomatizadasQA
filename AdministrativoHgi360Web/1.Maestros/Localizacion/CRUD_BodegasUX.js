import { Selector } from 'testcafe';
import {
    ejecutarCrudMaestro,
    prepararNavegador360,
    limpiarCache360,
    llenarCampos,
    elegirOpcion
} from '../../../Funciones/HelpersMaestros360.js';
import {
    accionFilaGrid360,
    buscarEnGrid360,
    eliminarFilaGrid360,
    escribirCampoPopup360,
    filaGrid360,
    guardarPopup360,
    popupEdicion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Bodegas - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Bodegas',
    grupo: 'localizacion',
    grid: 'gridBodegas',
    guardar: 'BtnActualizarBodega_btn',
    campoCodigo: 'txtIdBodega',
    codigo: 'QABOD1',
    crear: [
        { id: 'txtBodega_Descripcion', valor: 'descripcionmibodega' },
        { id: 'txtBodega_Direccion', valor: 'direcciónmibidega123' },
        { id: 'txtBodega_Telefono', valor: '1623456' },
        { id: 'txtBodega_Responsable', valor: 'no sé' },
        { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 1' },
        { id: 'txtBodega_Ciudad', tipo: 'lookup', opcion: '01 - MEDELLIN' },
        { id: 'txtBodega_Tercero', tipo: 'lookup', filtro: '1000099598', opcion: /^1000099598 - / },
        { id: 'txtBodega_Ecommerce', tipo: 'check' }
    ],
    editar: [
        { id: 'txtBodega_Descripcion', valor: 'nueva descripcion bodega' },
        { id: 'txtBodega_Responsable', valor: 'nuevoresponsablebodega' },
        { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 2' },
        // La pestaña Precios solo muestra su grid cuando la bodega ya existe (en edición)
        { id: 'tabs_bodegas_Precios', tipo: 'pestana' }
    ],
    validarEditado: 'nueva descripcion bodega',
    antesDeEliminar: crudPreciosBodega
};

// Pestaña Precios (grid gridBodega_Precios, popup "Precio por bodega"). Validado en el navegador el 17-nov-2026.
// El filtro del lookup Producto no filtra la lista: se elige un producto que sale en la primera página.
const GRID_PRECIOS = 'gridBodega_Precios';
const PRODUCTO_PRECIO = '1 - PR BALANZA';
const LISTA_PRECIO = 'Precio 1';
const VALOR_PRECIO = '1500';
const VALOR_PRECIO_EDIT = '2500';
const VALOR_EN_GRID = '1500,00';
const VALOR_EN_GRID_EDIT = '2500,00';

const lookupPopup = campo => popupEdicion360.find(`.dx-lookup-field[id$="_${campo}"]`);

/** Crea, edita y elimina un precio en la pestaña Precios de la bodega de prueba. */
async function crudPreciosBodega(t, m) {
    await buscarEnGrid360(t, m.grid, m.codigo);
    await accionFilaGrid360(t, m.grid, m.codigo, 'Editar');
    await llenarCampos(t, [{ id: 'tabs_bodegas_Precios', tipo: 'pestana' }]);

    // Crear
    await t
        .click(Selector(`[data-testid="${GRID_PRECIOS}"] [aria-label="Agregar una fila"]`).filterVisible())
        .expect(popupEdicion360.with({ timeout: 10000 }).exists).ok('No se abrió el popup de Precio por bodega')
        .click(lookupPopup('StrProducto'));
    await elegirOpcion(t, PRODUCTO_PRECIO);
    await t.click(lookupPopup('IntListaPrecios'));
    await elegirOpcion(t, LISTA_PRECIO);
    await escribirCampoPopup360(t, 'IntValorUnitario', VALOR_PRECIO);
    await guardarPopup360(t);
    await t.expect(filaGrid360(GRID_PRECIOS, VALOR_EN_GRID).with({ timeout: 15000 }).exists)
        .ok(`No apareció el precio ${VALOR_EN_GRID} en la pestaña Precios`);

    // Editar
    await accionFilaGrid360(t, GRID_PRECIOS, VALOR_EN_GRID, 'Editar');
    await t.expect(popupEdicion360.with({ timeout: 10000 }).exists).ok('No se abrió el popup para editar el precio');
    await escribirCampoPopup360(t, 'IntValorUnitario', VALOR_PRECIO_EDIT);
    await guardarPopup360(t);
    await t.expect(filaGrid360(GRID_PRECIOS, VALOR_EN_GRID_EDIT).with({ timeout: 15000 }).exists)
        .ok(`No se ve el precio editado ${VALOR_EN_GRID_EDIT} en la pestaña Precios`);

    // Eliminar
    await eliminarFilaGrid360(t, GRID_PRECIOS, VALOR_EN_GRID_EDIT);

    // Se cierra la bodega sin guardar para seguir con su eliminación
    await t
        .click(Selector('#BtnCancelarBodega_btn').filterVisible())
        .expect(Selector('#BtnActualizarBodega_btn').filterVisible().with({ timeout: 10000 }).exists)
        .notOk('No se cerró el formulario de la bodega');
}

fixture `Prueba Bodegas - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Bodegas Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
