import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tipos Tercero - test.hgi360.com (POS > Maestros > terceros).
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

fixture `Prueba Tipo Terceros testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Tipo Tercero testERP', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
