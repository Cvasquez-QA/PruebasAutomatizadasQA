import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Categoria Puntos - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Categoria Puntos',
    grupo: 'terceros',
    grid: 'gridCategoriaPuntos',
    guardar: 'BtnGuardarCategoriaPuntos_btn',
    campoCodigo: 'txtCategoriaPuntos_StrIdCategoriaPuntos',
    codigo: 'QACPT1',
    crear: [
        { id: 'txtCategoriaPuntos_StrDescripcion', valor: 'MIDESCRIPCION' }
    ],
    editar: [
        { id: 'txtCategoriaPuntos_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `CRUD_CategoriaPuntosUX - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CATEGORIA PUNTOS testerp CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
