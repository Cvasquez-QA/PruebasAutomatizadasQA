import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Conceptos de nómina - test.hgi360.com (Nómina > Maestros > Configuración). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. Un concepto de tipo Deducción necesita
// un código DIAN de deducción (en legacy se corregía después del primer guardado).
const MAESTRO = {
    maestro: 'Conceptos',
    grid: 'gridConceptosNom',
    guardar: 'BtnGuardarConceptosNom_btn',
    campoCodigo: 'txtConceptosNom_StrIdConcepto',
    codigo: 'CodigoConceptoNom',
    crear: [
        { id: 'txtConceptosNom_StrDescripcion', valor: 'DescConc' },
        { id: 'txtConceptosNom_StrCodigoDian', tipo: 'lookup', filtro: 'Anticipo', opcion: /^\s*Anticipo - Anticipos de N/ },
        { id: 'txtConceptosNom_IntFormaLiquida', tipo: 'lookup', opcion: 'Salario Básico' },
        { id: 'txt_lista_ConceptosNomTipoConcepto', tipo: 'lookup', opcion: 'Deducción' },
        { id: 'txtConceptosNom_IntPeriodicidad', valor: '1' },
        { id: 'txtConceptosNom_IntPrioridad', valor: '1' },
        { id: 'txtConceptosNom_StrPeriodicidad', tipo: 'lookup', opcion: 'Mensual' },
        { id: 'txtConceptosNom_IntGrupo', tipo: 'lookup', opcion: 'Aportes Salud' },
        { id: 'txtConceptosNom_IntTipoAusentismo', tipo: 'lookup', opcion: 'Enfermedad' },
        { id: 'txtConceptosNom_IntRestaHorasBase', tipo: 'check' }
    ],
    editar: [
        { id: 'txtConceptosNom_StrDescripcion', valor: 'NuevaDescConc' }
    ],
    validarEditado: 'NuevaDescConc'
};

fixture `Prueba 5.Conceptos Nom Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Conceptos Nom CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
