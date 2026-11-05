import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Sucursales - test.hgi360.com (Nómina > Maestros > Maestros). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Sucursales',
    grid: 'gridSucursales',
    guardar: 'BtnActualizarSucursal_btn',
    campoCodigo: 'txtStrIdSucursal',
    codigo: 'MiSucursal',
    crear: [
        { id: 'txtSucursales_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtSucursales_IntEstado', tipo: 'check' }
    ],
    editar: [
        { id: 'txtSucursales_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba Sucursales Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Sucursales CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
