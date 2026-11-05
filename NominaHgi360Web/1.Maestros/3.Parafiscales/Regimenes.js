import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Regímenes - test.hgi360.com (Nómina > Maestros > Parafiscales). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Regímenes',
    grid: 'gridNomRegimenes',
    guardar: 'BtnGuardarNomRegimenes_btn',
    campoCodigo: 'txtRegimenLab_Codigo',
    codigo: '98',
    crear: [
        { id: 'txtRegimenLab_Descripcion', valor: 'DescripcionRegimen' },
        { id: 'numRegimenLab_DiasCesantias', valor: '360' },
        { id: 'numRegimenLab_DiasPrima', valor: '180' },
        { id: 'numRegimenLab_DiasVacaciones', valor: '15' },
        { id: 'numRegimenLab_DiasPrimaVacaciones', valor: '15' },
        { id: 'chkRegimenLab_Cesantias', tipo: 'check' },
        { id: 'chkRegimenLab_PrimaServicios', tipo: 'check' },
        { id: 'chkRegimenLab_Vacaciones', tipo: 'check' },
        { id: 'chkRegimenLab_PrimaVacaciones', tipo: 'check' },
        { id: 'chkRegimenLab_SabadosFestivos', tipo: 'check' },
        { id: 'chkRegimenLab_LiquidaSalario', tipo: 'check' }
    ],
    editar: [
        { id: 'txtRegimenLab_Descripcion', valor: 'MINUEVADESCRIPCIONREGIMEN' }
    ],
    validarEditado: 'MINUEVADESCRIPCIONREGIMEN'
};

fixture `Prueba Regimenes Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Regimenes CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
