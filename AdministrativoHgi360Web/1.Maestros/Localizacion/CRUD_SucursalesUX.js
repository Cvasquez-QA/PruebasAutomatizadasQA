import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Sucursales - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Sucursales',
    grupo: 'localizacion',
    grid: 'gridSucursales',
    guardar: 'BtnActualizarSucursal_btn',
    campoCodigo: 'txtStrIdSucursal',
    codigo: 'QASUC1',
    crear: [
        { id: 'txtSucursales_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtSucursales_IntEstado', tipo: 'check' }
    ],
    editar: [
        { id: 'txtSucursales_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba Sucursales - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Sucursales Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
