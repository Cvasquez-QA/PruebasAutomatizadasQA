import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Centro de Costo - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Centro de Costo',
    grupo: 'localizacion',
    grid: 'gridCentrosCostos',
    guardar: 'BtnActualizarCentroCosto_btn',
    campoCodigo: 'txtCentroCosto_Codigo',
    codigo: 'QACC1',
    crear: [
        { id: 'txtCentroCosto_Descripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtCentroCosto_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba CENTROS DE COSTO - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CENTROS DE COSTO Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
