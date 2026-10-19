import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Colores - test.hgi360.com (Maestros > productos).
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

fixture `CRUD_Colores - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Colors mierp - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
