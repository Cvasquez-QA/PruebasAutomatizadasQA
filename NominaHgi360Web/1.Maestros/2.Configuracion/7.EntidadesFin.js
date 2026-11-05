import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Entidades Financieras - test.hgi360.com (Nómina > Maestros > Configuración). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'EntidadesFin',
    grid: 'gridEntidadesFinancieras',
    guardar: 'BtnActualizarEntidadFinanciera_btn',
    campoCodigo: 'txtIdEntidad',
    codigo: 'mientidad123',
    crear: [
        { id: 'txtEntidadFinanciera_Descripcion', valor: 'midescentidadfin' },
        { id: 'txtEntidadFinanciera_CodigoAch', valor: 'miacn()' },
        { id: 'txtEntidadFinanciera_CodigoAch1', valor: 'miach#' }
    ],
    editar: [
        { id: 'txtEntidadFinanciera_Descripcion', valor: 'minuevadesc' }
    ],
    validarEditado: 'minuevadesc'
};

fixture `Prueba 7.EntidadesFin Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba EntidadesFin CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
