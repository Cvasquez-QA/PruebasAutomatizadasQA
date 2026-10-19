import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Unidades - test.hgi360.com (POS > Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Unidades',
    grupo: 'impuestos',
    grid: 'gridUnidades',
    guardar: 'BtnGuardarUnidad_btn',
    campoCodigo: 'txtUnidad_Id',
    codigo: 'QAUN',
    crear: [
        { id: 'txtUnidad_Descripcion', valor: 'midescunidad' },
        { id: 'txtUnidad_Codigo_DIAN', tipo: 'lookup', filtro: '91', opcion: /^\s*91 -/ }
    ],
    editar: [
        { id: 'txtUnidad_Descripcion', valor: 'minuevadescunidad' },
        { id: 'txtUnidad_Codigo_DIAN', tipo: 'lookup', filtro: 'A1', opcion: /^\s*A1 -/ }
    ],
    validarEditado: 'minuevadescunidad'
};

fixture `Prueba Unidades testerp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Unidades CRUD miErp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
