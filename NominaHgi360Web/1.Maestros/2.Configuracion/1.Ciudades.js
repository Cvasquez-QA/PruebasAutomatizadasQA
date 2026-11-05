import { ejecutarCrudMaestro, prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Ciudades - test.hgi360.com (Nómina > Maestros > Configuración). Datos de NominaHgi360Legacy.
// Ids del formulario tomados en el navegador el 03-nov-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js. La aplicación no deja guardar una ciudad sin zona.
const MAESTRO = {
    maestro: 'Ciudades',
    grid: 'gridCiudades',
    guardar: 'BtnGuardarCiudad_btn',
    campoCodigo: 'txtCiudad_Id',
    codigo: 'MICIUDAD',
    crear: [
        { id: 'txtCiudad_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtCiudad_Zonas', tipo: 'lookup', filtro: 'GENERAL', opcion: /GENERAL/ },
        { id: 'txtCiudad_Dane_Ciudad', tipo: 'lookup', filtro: 'AGUADAS', opcion: /AGUADAS/ },
        { id: 'txtCiudad_Dane_Pais', valor: 'MIPAIS' },
        { id: 'txtCiudad_Dane_PaisIso', tipo: 'lookup', filtro: 'Alemania', opcion: /Alemania/ }
    ],
    editar: [
        { id: 'txtCiudad_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

fixture `Prueba 1.Ciudades Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Ciudades CRUD', async t => {
    await ejecutarCrudMaestro(t, testNominaConfig, MAESTRO);
});
