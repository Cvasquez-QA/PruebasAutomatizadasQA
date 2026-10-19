import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Actividades Eco - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Actividades Eco',
    grupo: 'terceros',
    grid: 'gridActividadesEconomicas',
    guardar: 'BtnGuardarActividadEconomica_btn',
    campoCodigo: 'txtActividadEconomica_Id',
    codigo: 'QAACT1',
    crear: [
        { id: 'txtActividadEconomica_Descripcion', valor: 'descActividadEco' }
    ],
    editar: [
        { id: 'txtActividadEconomica_Descripcion', valor: 'nuevaDescActividadEco' }
    ],
    validarEditado: 'nuevaDescActividadEco'
};

fixture `Prueba ActividadesEco - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD ActividadesEco Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
