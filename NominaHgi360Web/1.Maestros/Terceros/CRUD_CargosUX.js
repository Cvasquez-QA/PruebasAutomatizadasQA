import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Cargos - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Cargos',
    grupo: 'terceros',
    grid: 'gridCargos',
    guardar: 'BtnGuardarCargos_btn',
    campoCodigo: 'txtCargos_StrIdCargo',
    codigo: 'QACRG1',
    crear: [
        { id: 'txtCargos_StrNombre', valor: 'NombreCargo' },
        { id: 'txtCargos_TxtFunciones', tipo: 'area', valor: 'FUNCIONESCARGO' },
        { id: 'txtCargos_TxtPerfil', tipo: 'area', valor: 'PerfilCargo' }
    ],
    editar: [
        { id: 'txtCargos_StrNombre', valor: 'Cargo Pérez' }
    ],
    validarEditado: 'Cargo Pérez'
};

fixture `CRUD_CargosUX - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Cargo testerp - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
