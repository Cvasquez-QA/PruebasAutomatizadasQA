import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// ParamDoc11 - test.hgi360.com, módulo POS (Maestros > localizacion).
// Selectores validados en el navegador. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// En POS el parámetro de documentos 1 se llama ParamDoc11 en el menú.
const MAESTRO = {
    maestro: 'ParamDoc11',
    grupo: 'localizacion',
    grid: 'gridDocParametro1',
    guardar: 'BtnGuardarDocParametro1_btn',
    campoCodigo: 'txtDocParametro1_StrIdCodigo',
    codigo: 'QAPD1',
    crear: [
        { id: 'txtDocParametro1_StrDescripcion', valor: 'descParametro1' }
    ],
    editar: [
        { id: 'txtDocParametro1_StrDescripcion', valor: 'NuevaDescParametro1' }
    ],
    validarEditado: 'NuevaDescParametro1'
};

fixture `Prueba ParametroDoc1 testerp Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba ParametroDoc1 CRUD miErp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
