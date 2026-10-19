import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tarifas de Iva - test.hgi360.com (POS > Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tarifas de Iva',
    grupo: 'impuestos',
    grid: 'gridTarifasIva',
    guardar: 'BtnGuardarTarifaIva_btn',
    campoCodigo: 'txtTarifaIva_Id',
    codigo: 'QAIVA1',
    crear: [
        { id: 'txtTarifaIva_Descripcion', valor: 'MiDescTarifaIva123' },
        { id: 'txtTarifaIva_Porcentaje', valor: '40' },
        { id: 'txtTarifaIva_Porcentaje2', valor: '1' }
    ],
    editar: [
        { id: 'txtTarifaIva_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtTarifaIva_Porcentaje2', valor: '8' }
    ],
    validarEditado: 'minuevadescripcion'
};

fixture `Prueba Tarifas de IVA testerp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Tarifas de IVA CRUD mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
