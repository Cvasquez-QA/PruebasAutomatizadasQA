import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Característica - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Característica',
    grupo: 'productos',
    grid: 'gridCaracteristicas',
    guardar: 'BtnGuardarCaracteristicas_btn',
    campoCodigo: 'txtCaracteristicas_StrIdCaracteristica',
    codigo: 'QACAR1',
    crear: [
        { id: 'txtCaracteristicas_StrDescripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtCaracteristicas_StrLinea', tipo: 'lookup', opcion: '0 - GENERAL' },
        { id: 'txtCaracteristicas_IntCaracteristica', tipo: 'lookup', opcion: '1 - Característica 1' }
    ],
    editar: [
        { id: 'txtCaracteristicas_StrDescripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `CRUD_Caracteristica - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CARACTERÍSTICA testerp CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
