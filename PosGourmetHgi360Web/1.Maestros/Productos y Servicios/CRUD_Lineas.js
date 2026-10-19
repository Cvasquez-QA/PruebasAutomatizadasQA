import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Lineas - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Lineas',
    grupo: 'productos',
    grid: 'gridLineas',
    guardar: 'BtnGuardarLinea_btn',
    campoCodigo: 'txtIdLinea',
    codigo: 'QALIN1',
    crear: [
        { id: 'txtLineas_Descripcion', valor: 'MiDescripciónLinea' }
    ],
    editar: [
        { id: 'txtLineas_Descripcion', valor: 'MiNuevaDescripciónLinea' }
    ],
    validarEditado: 'MiNuevaDescripciónLinea'
};

fixture `Prueba Lineas - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Líneas Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
