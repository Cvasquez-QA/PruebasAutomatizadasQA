import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Productos - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Productos',
    grupo: 'productos',
    grid: 'gridProductos',
    guardar: 'BtnGuardarProducto_btn',
    campoCodigo: 'txtIdProducto',
    codigo: '141516',
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
        { id: 'txtMaestroProductos_Kardex', tipo: 'check' },
        { id: 'txtMaestroProductos_Vigente', tipo: 'check' },
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

test.describe('Prueba Productos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Productos Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
