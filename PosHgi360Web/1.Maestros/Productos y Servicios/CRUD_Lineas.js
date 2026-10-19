import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Lineas - test.hgi360.com (POS > Maestros > productos).
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

fixture `Prueba Lineas testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Líneas miErp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
