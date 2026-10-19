import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Clases - test.hgi360.com (POS > Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Clases',
    grupo: 'productos',
    grid: 'gridClases',
    guardar: 'BtnActualizarClases_btn',
    campoCodigo: 'txtStrIdClase',
    codigo: 'QACLA1',
    crear: [
        { id: 'txtClase_Descripcion', valor: 'MiDescripcionClase' },
        { id: 'txtClases_IntTipo', tipo: 'lookup', opcion: 'Productos' },
        { id: 'txtClases_StrConcepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' }
    ],
    editar: [
        { id: 'txtClase_Descripcion', valor: 'MiNuevaDescripciónClase' }
    ],
    validarEditado: 'MiNuevaDescripciónClase'
};

fixture `Prueba Clases testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Clases Completo mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
