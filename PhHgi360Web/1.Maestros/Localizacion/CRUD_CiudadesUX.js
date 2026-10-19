import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Ciudades - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Ciudades',
    grupo: 'localizacion',
    grid: 'gridCiudades',
    guardar: 'BtnGuardarCiudad_btn',
    campoCodigo: 'txtCiudad_Id',
    codigo: 'QACIU1',
    crear: [
        { id: 'txtCiudad_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtCiudad_Zonas', tipo: 'lookup', filtro: '05', opcion: '05 - ANTIOQUIA' },
        { id: 'txtCiudad_Dane_Ciudad', tipo: 'lookup', filtro: '05001', opcion: /^\s*05001 -/ },
        { id: 'txtCiudad_Dane_Pais', valor: 'MIPAIS' },
        { id: 'txtCiudad_Dane_PaisIso', tipo: 'lookup', filtro: 'AF', opcion: /^\s*AF -/ }
    ],
    editar: [
        { id: 'txtCiudad_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba Ciudades - Test Hgi360`
    .page(testPhConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPhConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Ciudades Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testPhConfig, MAESTRO);
});
