import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Bancos - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Bancos',
    grupo: 'impuestos',
    grid: 'gridBancos',
    guardar: 'BtnActualizarBanco_btn',
    campoCodigo: 'txtBancos_Codigo',
    codigo: 'QABAN1',
    crear: [
        { id: 'txtBancos_Descripcion', valor: 'midescripcion' },
        { id: 'txtBancos_Consecutivo', valor: '1212' },
        { id: 'txtBancos_Tipo', tipo: 'lookup', opcion: 'Ahorros' },
        { id: 'txtBancos_NroCuenta', valor: '24006124298' },
        { id: 'txtMaestroBancos_EntidadFin', tipo: 'lookup', filtro: '07', opcion: '07 - BANCOLOMBIA' },
        { id: 'txtBancos_Formato', tipo: 'lookup', opcion: 'BancolombiaSAP' }
    ],
    editar: [
        { id: 'txtBancos_Descripcion', valor: 'minuevadescripcion' }
    ],
    validarEditado: 'minuevadescripcion'
};

fixture `Prueba Banco - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Banco CRUD hgi360 test - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
