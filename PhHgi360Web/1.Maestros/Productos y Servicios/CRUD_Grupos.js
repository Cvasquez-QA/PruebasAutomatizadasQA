import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Grupos - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Grupos',
    grupo: 'productos',
    grid: 'gridGrupos',
    guardar: 'BtnGuardarGrupos_btn',
    campoCodigo: 'txtIdGrupo',
    codigo: 'QAGRU1',
    crear: [
        { id: 'txtGrupo_Descripcion', valor: 'MiDescripciónGrupo' },
        { id: 'txtGrupo_Producto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' },
        { id: 'txtGrupo_TipoGrupo', valor: '2' },
        { id: 'txtGrupo_StrConcepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' },
        { id: 'txtGrupo_IntPrioridad', valor: '10' }
    ],
    editar: [
        { id: 'txtGrupo_Descripcion', valor: 'MiNuevaDescripciónGrupo' }
    ],
    validarEditado: 'MiNuevaDescripciónGrupo'
};

fixture `Prueba Grupos - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Grupos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
