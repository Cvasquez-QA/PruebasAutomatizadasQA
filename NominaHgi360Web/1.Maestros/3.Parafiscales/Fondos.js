import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Fondos - test.hgi360.com (Nómina > Maestros > Parafiscales). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Fondos',
    grid: 'gridFondos',
    guardar: 'BtnGuardarFondos_btn',
    campoCodigo: 'txtFondo_Codigo',
    codigo: 'MiFondo',
    crear: [
        { id: 'txtFondo_Nombre', valor: 'NombreFondo' },
        { id: 'txtFondo_Nit', valor: '85465469496496' },
        { id: 'selFondo_Tipo', tipo: 'lookup', opcion: /AFP/ }
    ],
    editar: [
        { id: 'txtFondo_Nombre', valor: 'MINUEVANOMBREFONDO' }
    ],
    validarEditado: 'MINUEVANOMBREFONDO'
};

fixture `Prueba Fondos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Fondos CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
