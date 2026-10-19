import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Conceptos Pago - test.hgi360.com (POS > Maestros > impuestos).
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

fixture `Prueba Concepto de Pago testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Concepto de pago CRUD mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
