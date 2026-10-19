import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tipos - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tipos',
    grupo: 'productos',
    grid: 'gridTipos',
    guardar: 'BtnGuardarTipo_btn',
    campoCodigo: 'txtIdTipo',
    codigo: 'QATIP1',
    crear: [
        { id: 'txtTipo_Descripcion', valor: 'MiDescripcionTipo' }
    ],
    editar: [
        { id: 'txtTipo_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtMaestroTipo_Concepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' }
    ],
    validarEditado: 'minuevadescripcion'
};

fixture `Prueba Tipos - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Tipos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
