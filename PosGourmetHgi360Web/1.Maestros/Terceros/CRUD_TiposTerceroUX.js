import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testGourmetConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tipos Tercero - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Tipos Tercero',
    grupo: 'terceros',
    grid: 'gridTiposTerceros',
    guardar: 'BtnGuardarTipoTerceros_btn',
    campoCodigo: 'txtIntIdTipoTercero',
    codigo: 'QATT1',
    crear: [
        { id: 'txtTipoTerceros_Descripcion', valor: 'descTipoTercero' },
        { id: 'txtTiposTerceros_IntPrecio', tipo: 'lookup', opcion: '1 - Precio 1' }
    ],
    editar: [
        { id: 'txtTipoTerceros_Descripcion', valor: 'NuevaDescripciónTipoTerceros' }
    ],
    validarEditado: 'NuevaDescripciónTipoTerceros'
};

fixture `Prueba Tipo Terceros - Test Hgi360`
    .page(testGourmetConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testGourmetConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Tipo Tercero Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testGourmetConfig, MAESTRO);
});
