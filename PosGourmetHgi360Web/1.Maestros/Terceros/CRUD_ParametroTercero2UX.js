import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// PT22 - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// El nombre del menú (PT22) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'PT22',
    grupo: 'terceros',
    grid: 'gridTerParametro2',
    guardar: 'BtnGuardarTerParametro2_btn',
    campoCodigo: 'txtTerParametro2_StrIdParametro',
    codigo: 'QAPT2',
    crear: [
        { id: 'txtTerParametro2_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtTerParametro2_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba CRUD_ParametroTercero2UX`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD_ParametroTercero2UX - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
