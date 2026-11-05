import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Bancos - test.hgi360.com (Nómina > Maestros > Configuración). Datos de NominaHgi360Legacy:
// se crea con código y descripción y al editar se llenan consecutivo, tipo y número de cuenta,
// entidad financiera y formato. Ids del formulario tomados en el navegador el 03-nov-2026.
// No se usa el código legacy miBanco123: en 8902 quedó un banco con ese código que la aplicación no deja
// borrar ("tiene movimientos asociados").
const MAESTRO = {
    maestro: 'Bancos',
    grid: 'gridBancos',
    guardar: 'BtnActualizarBanco_btn',
    campoCodigo: 'txtBancos_Codigo',
    codigo: 'QABancoNom',
    crear: [
        { id: 'txtBancos_Descripcion', valor: 'midescripcion' }
    ],
    editar: [
        { id: 'txtBancos_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtBancos_Consecutivo', valor: '1212' },
        { id: 'txtBancos_Tipo', tipo: 'lookup', opcion: 'Ahorros' },
        { id: 'txtBancos_NroCuenta', valor: '24006124298' },
        { id: 'txtMaestroBancos_EntidadFin', tipo: 'lookup', filtro: 'BANCOLOMBIA', opcion: /BANCOLOMBIA/ },
        { id: 'txtBancos_Formato', tipo: 'lookup', opcion: 'BancolombiaPAB' }
    ],
    validarEditado: 'minuevadescripcion'
};

fixture `Prueba 2.Bancos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Bancos CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
