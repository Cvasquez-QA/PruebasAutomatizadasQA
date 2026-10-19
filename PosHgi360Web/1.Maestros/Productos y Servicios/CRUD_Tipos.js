import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tipos - test.hgi360.com (POS > Maestros > productos).
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

fixture `Prueba Tipos testerp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba CRUD Tipos mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
