import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Bodegas - test.hgi360.com (POS > Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Bodegas',
    grupo: 'localizacion',
    grid: 'gridBodegas',
    guardar: 'BtnActualizarBodega_btn',
    campoCodigo: 'txtIdBodega',
    codigo: 'QABOD1',
    crear: [
        { id: 'txtBodega_Descripcion', valor: 'descripcionmibodega' },
        { id: 'txtBodega_Direccion', valor: 'direcciónmibidega123' },
        { id: 'txtBodega_Telefono', valor: '1623456' },
        { id: 'txtBodega_Responsable', valor: 'no sé' },
        { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 1' }
    ],
    editar: [
        { id: 'txtBodega_Descripcion', valor: 'nueva descripcion bodega' },
        { id: 'txtBodega_Responsable', valor: 'nuevoresponsablebodega' },
        { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 2' }
    ],
    validarEditado: 'nueva descripcion bodega'
};

fixture `Prueba Bodegas testerp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Bodegas miErp CRUD', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
