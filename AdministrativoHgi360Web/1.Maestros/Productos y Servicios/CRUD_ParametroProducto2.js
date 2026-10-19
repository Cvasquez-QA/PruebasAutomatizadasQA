import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro22 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// El nombre del menú (Parametro22) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro22',
    grupo: 'productos',
    grid: 'gridProdParametro2',
    guardar: 'BtnGuardarProdParametro2_btn',
    campoCodigo: 'txtProdParametro2_Id',
    codigo: 'QAPP2',
    crear: [
        { id: 'txtProdParametro2_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro2_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

fixture `Prueba CRUD_ParametroProducto2`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD_ParametroProducto2 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
