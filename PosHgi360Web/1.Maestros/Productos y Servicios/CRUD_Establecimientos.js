import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Establecimientos - test.hgi360.com, módulo POS (Maestros > productos).
// Selectores validados en el navegador. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
// OJO: en el módulo POS de test.hgi360 este maestro no aparece en el menú (sí en Administrativo).
const MAESTRO = {
    maestro: 'Establecimientos',
    grupo: 'productos',
    grid: 'gridEstablecimientos',
    guardar: 'BtnGuardarEstablecimientosPV_btn',
    campoCodigo: 'txtIdEstablecimientoPV',
    codigo: '9871',
    crear: [
        { id: 'txtEstablecimientosPV_Descripcion', valor: 'descEstablecimiento' },
        { id: 'txtEstablecimientosPV_ListaPrecio', tipo: 'lookup', opcion: 'Precio 1' }
    ],
    editar: [
        { id: 'txtEstablecimientosPV_Descripcion', valor: 'nuevaDescEstablecimiento' }
    ],
    validarEditado: 'nuevaDescEstablecimiento'
};

fixture `Prueba Establecimientos testErp POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba CRUD Establecimientos', async t => {
    await ejecutarCrudMaestro(t, testPosWebConfig, MAESTRO);
});
