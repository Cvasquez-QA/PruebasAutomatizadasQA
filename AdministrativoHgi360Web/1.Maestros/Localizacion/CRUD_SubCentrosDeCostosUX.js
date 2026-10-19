import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// SubCentro de Costo - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'SubCentro de Costo',
    grupo: 'localizacion',
    grid: 'gridSubCentrosCostos',
    guardar: 'BtnActualizarSubCentroCosto_btn',
    campoCodigo: 'txtSubCentroCosto_Codigo',
    codigo: 'QASCC1',
    crear: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba SUBCENTROS DE COSTO - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba SUBCENTROS DE COSTO Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
