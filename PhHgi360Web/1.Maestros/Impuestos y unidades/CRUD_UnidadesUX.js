import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Unidades - test.hgi360.com (Maestros > impuestos).
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

fixture `Prueba Unidades - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Unidades CRUD Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
