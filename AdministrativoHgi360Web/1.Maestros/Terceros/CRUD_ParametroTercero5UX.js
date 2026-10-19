import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// PT55 - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// El nombre del menú (PT55) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'PT55',
    grupo: 'terceros',
    grid: 'gridTerParametro5',
    guardar: 'BtnGuardarTerParametro5_btn',
    campoCodigo: 'txtTerParametro5_StrIdParametro',
    codigo: 'QAPT5',
    crear: [
        { id: 'txtTerParametro5_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtTerParametro5_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba CRUD_ParametroTercero5UX`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD_ParametroTercero5UX - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
