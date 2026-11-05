import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tarifas ARL - test.hgi360.com (Nómina > Maestros > Parafiscales). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tarifas ARL',
    grid: 'gridNomTarifasARL',
    guardar: 'BtnGuardarNomTarifasARL_btn',
    campoCodigo: 'txtTarifasArl_Codigo',
    codigo: 'MiTarifaArl',
    crear: [
        { id: 'txtTarifasArl_Descripcion', valor: 'DescripcionTarifaArl' },
        { id: 'txtTarifasArl_Porcentaje', valor: '0,522' },
        { id: 'txtTarifasArl_CodTrabajo', valor: '112010' }
    ],
    editar: [
        { id: 'txtTarifasArl_Descripcion', valor: 'MINUEVADESCRIPCIONARL' }
    ],
    validarEditado: 'MINUEVADESCRIPCIONARL'
};

fixture `Prueba TarifasARL Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba TarifasARL CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
