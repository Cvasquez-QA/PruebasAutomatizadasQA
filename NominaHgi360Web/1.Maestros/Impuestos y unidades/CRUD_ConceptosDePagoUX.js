import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Conceptos Pago - test.hgi360.com (Maestros > impuestos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Conceptos Pago',
    grupo: 'impuestos',
    grid: 'gridConceptosPago',
    guardar: 'BtnActualizarConceptosPago_btn',
    campoCodigo: 'txtStrIdConceptoPago',
    codigo: 'QACPG1',
    crear: [
        { id: 'txtConceptoPago_Descripcion', valor: 'midescripcionconceptopago' },
        { id: 'txtConceptoPago_Tipo', tipo: 'lookup', opcion: 'Pago' },
        { id: 'txtConceptoPago_Valor', valor: '100000' },
        { id: 'txtMaestroConceptosPago_CuentaPCGA', tipo: 'lookup', filtro: 'ACTIVO', opcion: '1 - ACTIVO PCGA' },
        { id: 'txtMaestroConceptosPago_CuentaNIIF', tipo: 'lookup', filtro: 'ACTIVO', opcion: '1 - ACTIVO NIIF' },
        { id: 'txtConceptosPago_ActualizaValor', tipo: 'check' },
        { id: 'txtConceptosPago_IntCartera', tipo: 'check' },
        { id: 'txtConceptosPago_ValidaSaldoCartera', tipo: 'check' }
    ],
    editar: [
        { id: 'txtConceptoPago_Descripcion', valor: 'miNUEVAdescripcionconceptopago' },
        { id: 'txtConceptoPago_Tipo', tipo: 'lookup', opcion: 'Deducción' },
        { id: 'txtConceptosPago_IntCartera', tipo: 'check' },
        { id: 'txtConceptosPago_ActualizaValor', tipo: 'check' }
    ],
    validarEditado: 'miNUEVAdescripcionconceptopago'
};

fixture `Prueba Conceptos Pago - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Conceptos Pago Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
