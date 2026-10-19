import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Sectores - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Sectores',
    grupo: 'localizacion',
    grid: 'gridSectores',
    guardar: 'BtnActualizarSector_btn',
    campoCodigo: 'txtSector_Codigo',
    codigo: 'QASEC1',
    crear: [
        { id: 'txtSector_Descripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtSector_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba Sectores - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Sectores Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
