import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// ReteFte - test.hgi360.com (Nómina > Maestros > Parafiscales). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'ReteFte',
    grid: 'gridNomReteFte',
    guardar: 'BtnGuardarNomReteFte_btn',
    campoCodigo: 'txtReteFte_Codigo',
    codigo: 'MiReteFte',
    crear: [
        { id: 'txtReteFte_Descripcion', valor: 'DescripcionReteFte' },
        { id: 'txtReteFte_DesdeUvt', valor: '1' },
        { id: 'txtReteFte_HastaUvt', valor: '95' },
        { id: 'txtReteFte_Porcentaje', valor: '10' },
        { id: 'txtReteFte_UvtsSumados', valor: '2' },
        { id: 'txtReteFte_UvtsRestados', valor: '3' }
    ],
    editar: [
        { id: 'txtReteFte_Descripcion', valor: 'MINUEVADESCRIPCIONRETEFTE' }
    ],
    validarEditado: 'MINUEVADESCRIPCIONRETEFTE'
};

fixture `Prueba ReteFte Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba ReteFte CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
