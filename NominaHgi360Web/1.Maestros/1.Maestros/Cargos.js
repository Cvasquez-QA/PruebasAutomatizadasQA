import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Cargos - test.hgi360.com (Nómina > Maestros > Maestros). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Cargos',
    grid: 'gridCargos',
    guardar: 'BtnGuardarCargos_btn',
    campoCodigo: 'txtCargos_StrIdCargo',
    codigo: 'MiCargo',
    crear: [
        { id: 'txtCargos_StrNombre', valor: 'CargoNombre' },
        { id: 'txtCargos_TxtFunciones', valor: 'FuncionesCargo' },
        { id: 'txtCargos_TxtPerfil', valor: 'PerfilCargo' }
    ],
    editar: [
        { id: 'txtCargos_StrNombre', valor: 'NuevoCargoNombre' },
        { id: 'txtCargos_TxtFunciones', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'NuevoCargoNombre'
};

fixture `Prueba Cargos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Cargos CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
