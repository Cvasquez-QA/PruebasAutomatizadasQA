import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// PT44 - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// El nombre del menú (PT44) es el configurado en Herramientas > Parámetros > Parámetros.
const MAESTRO = {
    maestro: 'PT44',
    grupo: 'terceros',
    grid: 'gridTerParametro4',
    guardar: 'BtnGuardarTerParametro4_btn',
    campoCodigo: 'txtTerParametro4_StrIdParametro',
    codigo: 'QAPT4',
    crear: [
        { id: 'txtTerParametro4_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtTerParametro4_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba CRUD_ParametroTercero4UX`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD_ParametroTercero4UX - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
