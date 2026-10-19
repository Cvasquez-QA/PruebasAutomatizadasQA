import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parentesco - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Parentesco',
    grupo: 'terceros',
    grid: 'gridParentesco',
    guardar: 'BtnGuardarParentesco_btn',
    campoCodigo: 'txtParentesco_StrIdParentesco',
    codigo: 'QAPAR1',
    crear: [
        { id: 'txtParentesco_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtParentesco_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `CRUD_ParentescoUX - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba PARENTESCO testerp CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
