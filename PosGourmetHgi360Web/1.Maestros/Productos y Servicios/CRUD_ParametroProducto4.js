import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro44 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// El nombre del menú (Parametro44) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro44',
    grupo: 'productos',
    grid: 'gridProdParametro4',
    guardar: 'BtnGuardarProdParametro4_btn',
    campoCodigo: 'txtProdParametro4_Id',
    codigo: 'QAPP4',
    crear: [
        { id: 'txtProdParametro4_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro4_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

fixture `Prueba CRUD_ParametroProducto4`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD_ParametroProducto4 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
