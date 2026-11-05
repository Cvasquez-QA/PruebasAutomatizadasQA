import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Ubicaciones - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 04-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js. Estado viene marcado por defecto: al editar se desmarca.
const MAESTRO = {
    maestro: 'Ubicaciones',
    grupo: 'localizacion',
    grid: 'gridUbicaciones',
    guardar: 'BtnGuardarUbicacion_btn',
    campoCodigo: 'txtUbicacion_Codigo',
    codigo: 'QAUbicacion',
    crear: [
        { id: 'txtUbicacion_Descripcion', valor: 'QaDesc' }
    ],
    editar: [
        { id: 'txtUbicacion_Descripcion', valor: 'nuevadesc' },
        { id: 'txtUbicacion_Estado', tipo: 'check' }
    ],
    validarEditado: 'nuevadesc'
};

fixture `Prueba Ubicaciones - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Ubicaciones Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
