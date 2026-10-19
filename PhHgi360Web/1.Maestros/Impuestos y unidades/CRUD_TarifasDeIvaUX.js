import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tarifas de Iva - test.hgi360.com (Maestros > impuestos).
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

fixture `Prueba Tarifas de IVA - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Tarifas de IVA CRUD Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
