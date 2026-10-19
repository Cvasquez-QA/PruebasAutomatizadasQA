import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Categorias - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Categorias',
    grupo: 'productos',
    grid: 'gridCategoriasProd',
    guardar: 'BtnGuardarCategoriasProd_btn',
    campoCodigo: 'txtCategoriasProd_StrIdCategoria',
    codigo: 'QACAT1',
    crear: [
        { id: 'txtCategoriasProd_StrDescripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtMaestroCategorias_CodigoPadre', tipo: 'lookup', opcion: '0 - GENERAL' },
        { id: 'txtCategoriasProd_IntEstado', tipo: 'check' },
        { id: 'txtCategoriasProd_IntMenu', tipo: 'check' }
    ],
    editar: [
        { id: 'txtCategoriasProd_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `CRUD_Categorias - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CATEGORIAS testerp CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
