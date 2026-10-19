import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// PT11 - test.hgi360.com, módulo POS (Maestros > terceros).
// Selectores validados en el navegador. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// En POS el Subsector es el parámetro de terceros 1 (menú PT11).
const MAESTRO = {
    maestro: 'PT11',
    grupo: 'terceros',
    grid: 'gridTerParametro1',
    guardar: 'BtnGuardarTerParametro1_btn',
    campoCodigo: 'txtTerParametro1_StrIdParametro',
    codigo: 'QASUB1',
    crear: [
        { id: 'txtTerParametro1_StrDescripcion', valor: 'descSubsector' }
    ],
    editar: [
        { id: 'txtTerParametro1_StrDescripcion', valor: 'nuevaDescSubsector' }
    ],
    validarEditado: 'nuevaDescSubsector'
};

fixture `Prueba Subsector testHgi360 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba CRUD Subsector testHgi360', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
