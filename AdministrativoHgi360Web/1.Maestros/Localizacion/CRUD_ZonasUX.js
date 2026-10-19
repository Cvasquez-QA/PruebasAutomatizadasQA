import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Zonas - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Zonas',
    grupo: 'localizacion',
    grid: 'gridZonas',
    guardar: 'BtnActualizarZona_btn',
    campoCodigo: 'txtZona_Codigo',
    codigo: 'QAZONA',
    crear: [
        { id: 'txtZona_Descripcion', valor: 'DescripcionMiZona' }
    ],
    editar: [
        { id: 'txtZona_Descripcion', valor: 'NuevaDescripcionZona' }
    ],
    validarEditado: 'NuevaDescripcionZona'
};

fixture `Prueba Zonas - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Zonas Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
