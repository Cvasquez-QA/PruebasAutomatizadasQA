import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Cajas - test.hgi360.com, módulo POS (Maestros > productos).
// Selectores validados en el navegador. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Cajas',
    grupo: 'productos',
    grid: 'gridCajas',
    guardar: 'BtnGuardarCajas_btn',
    campoCodigo: 'txtCajas_StrIdCaja',
    codigo: 'QACJ1',
    crear: [
        { id: 'txtCajas_StrDescripcion', valor: 'descCajaPos' },
        { id: 'txtCajas_IntTopeRetiro', valor: '5000000' },
        { id: 'txtCajas_IntValorTope', valor: '5000000' },
        { id: 'txtCajas_IntActiva', tipo: 'check' },
        { id: 'txtCajas_StrPlacaCaja', valor: 'miPlaca1' },
        { id: 'txtCajas_StrUbicacionCaja', valor: 'miUbicacion1' },
        { id: 'txtCajas_StrTipoCaja', valor: 'miTipo1' }
    ],
    editar: [
        { id: 'txtCajas_StrDescripcion', valor: 'nuevaDesc' },
        { id: 'txtCajas_IntTopeRetiro', valor: '8000000' },
        { id: 'txtCajas_IntValorTope', valor: '4000000' }
    ],
    validarEditado: 'nuevaDesc'
};

fixture `Prueba Cajas testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Cajas TestErp - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
