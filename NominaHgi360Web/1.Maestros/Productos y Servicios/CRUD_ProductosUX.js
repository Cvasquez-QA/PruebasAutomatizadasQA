import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Productos - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Productos',
    grupo: 'productos',
    grid: 'gridProductos',
    guardar: 'BtnGuardarProducto_btn',
    campoCodigo: 'txtIdProducto',
    codigo: '141517',
    crear: [
        { id: 'txtProducto_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtMaestroProductos_PrecioVenta', valor: '1000' },
        { id: 'txtMaestroProductos_PrecioVenta2', valor: '2000' },
        { id: 'txtMaestroProductos_PrecioVenta3', valor: '3000' },
        { id: 'txtMaestroProductos_PrecioVenta4', valor: '4000' },
        { id: 'txtMaestroProductos_PrecioVenta5', valor: '5000' },
        { id: 'txtMaestroProductos_PrecioVenta6', valor: '6000' },
        { id: 'txtMaestroProductos_PrecioVenta7', valor: '7000' },
        { id: 'txtMaestroProductos_PrecioVenta8', valor: '8000' },
        { id: 'txtMaestroProductos_Descuento1', valor: '10' },
        { id: 'txtMaestroProductos_Descuento2', valor: '20' },
        { id: 'txtMaestroProductos_Descuento3', valor: '30' },
        { id: 'txtMaestroProductos_Descuento4', valor: '40' },
        { id: 'txtMaestroProductos_Kardex', tipo: 'check' },
        { id: 'txtMaestroProductos_Movil', tipo: 'check' },
        { id: 'txtMaestroProductos_Vigente', tipo: 'check' },
        { id: 'txtMaestroProductos_ManejaLote', tipo: 'check' },
        { id: 'txtMaestroProductos_ImpPlastico', tipo: 'check' },
        { id: 'txtMaestroProductos_Excluido', tipo: 'check' }
    ],
    editar: [
        { id: 'txtProducto_Descripcion', valor: 'MINUEVADESCRIPCION' },
        { id: 'txtMaestroProductos_TarifasImpuesto1', tipo: 'lookup', opcion: 'No Aplica' },
        { id: 'txtMaestroProductos_TarifasImpuesto2', tipo: 'lookup', opcion: 'No Aplica' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `CRUD_ProductosUX - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Productos testerp - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
