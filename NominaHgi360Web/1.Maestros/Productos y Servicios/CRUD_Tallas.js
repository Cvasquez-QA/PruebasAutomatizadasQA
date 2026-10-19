import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tallas - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tallas',
    grupo: 'productos',
    grid: 'gridTallas',
    guardar: 'BtnGuardarTallas_btn',
    campoCodigo: 'txtTallas_StrIdTalla',
    codigo: 'QATAL1',
    crear: [
        { id: 'txtTallas_StrDescripcion', valor: 'descTalla' },
        { id: 'txtTallas_IntOrden', valor: '87' }
    ],
    editar: [
        { id: 'txtTallas_StrDescripcion', valor: 'nuevaDescTalla' },
        { id: 'txtTallas_IntOrden', valor: '5' }
    ],
    validarEditado: 'nuevaDescTalla'
};

fixture `CRUD_Tallas - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Tallas mierp - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
