import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Colores - test.hgi360.com (POS > Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// OJO: el color se escribe en el campo (#FF0000); si el ColorBox no acepta texto, usar el selector de paleta.
const MAESTRO = {
    maestro: 'Colores',
    grupo: 'productos',
    grid: 'gridColores',
    guardar: 'BtnGuardarColores_btn',
    campoCodigo: 'txtColores_StrIdColor',
    codigo: 'QACOL1',
    crear: [
        { id: 'txtColores_StrDescripcion', valor: 'descColor' },
        { id: 'txtColores_Color', valor: '#FF0000' },
        { id: 'txtColores_IntOrden', valor: '87' }
    ],
    editar: [
        { id: 'txtColores_StrDescripcion', valor: 'nuevaDescColor' },
        { id: 'txtColores_IntOrden', valor: '4' }
    ],
    validarEditado: 'nuevaDescColor'
};

fixture `Prueba Colors testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba CRUD Colors mierp', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
