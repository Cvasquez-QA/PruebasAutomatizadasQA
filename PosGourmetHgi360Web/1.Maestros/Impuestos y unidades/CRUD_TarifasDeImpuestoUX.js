import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tarifas de Impuesto - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tarifas de Impuesto',
    grupo: 'impuestos',
    grid: 'gridTarifasImpto1',
    guardar: 'BtnGuardarTarifaImpto1_btn',
    campoCodigo: 'txtTarifaImpto1_Id',
    codigo: 'QATI1',
    crear: [
        { id: 'txtTarifaImpto1_Descripcion', valor: 'midectaridaimpuyesto' },
        { id: 'txtTarifaImpto1_Porcentaje', valor: '333' }
    ],
    editar: [
        { id: 'txtTarifaImpto1_Descripcion', valor: 'minuevadesc' },
        { id: 'txtTarifaImpto1_Porcentaje', valor: '12' }
    ],
    validarEditado: 'minuevadesc'
};

fixture `Prueba Tarifa de Impuesto - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Tarifa de Impuesto Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
