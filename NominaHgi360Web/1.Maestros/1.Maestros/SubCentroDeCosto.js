import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// SubCentro de Costo - test.hgi360.com (Nómina > Maestros > Maestros). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'SubCentro de Costo',
    grid: 'gridSubCentrosCostos',
    guardar: 'BtnActualizarSubCentroCosto_btn',
    campoCodigo: 'txtSubCentroCosto_Codigo',
    codigo: 'MiSubCC',
    crear: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtSubCentroCosto_Estado', tipo: 'check' }
    ],
    editar: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba SubCentroDeCosto Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba SUBCENTRO DE COSTO CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
