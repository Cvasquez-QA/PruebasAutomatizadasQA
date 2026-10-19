import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Parametro66 - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// El nombre del menú (Parametro66) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'Parametro66',
    grupo: 'productos',
    grid: 'gridProdParametro6',
    guardar: 'BtnGuardarProdParametro6_btn',
    campoCodigo: 'txtProdParametro6_Id',
    codigo: 'QAPP6',
    crear: [
        { id: 'txtProdParametro6_Descripcion', valor: 'descEdicion' }
    ],
    editar: [
        { id: 'txtProdParametro6_Descripcion', valor: 'nuevaDescEdicion' }
    ],
    validarEditado: 'nuevaDescEdicion'
};

fixture `Prueba CRUD_ParametroProducto6`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD_ParametroProducto6 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
