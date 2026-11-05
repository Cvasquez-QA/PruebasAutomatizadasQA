import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - TERCEROS (test.hgi360.com, AutContable).
// Crea el tercero de prueba, intenta crearlo de nuevo con la misma identificación, valida el rechazo
// ("Ya existe un registro...") y borra el tercero. Ids tomados en el navegador el 03-nov-2026; el resto
// de campos (tipo de tercero, ciudad, sucursal...) se dejan con el valor por defecto del formulario.
// Solo Terceros: Tipos Tercero, Vendedores y Actividades Eco no están en el menú Maestros del módulo Contable.

const TERCEROS = {
    maestro: 'Terceros',
    grid: 'gridTerceros',
    guardar: 'BtnGuardarTercero_btn',
    campoCodigo: 'txtTercero_Id',
    codigo: '1010101011',
    crear: [
        { id: 'txtTercero_Tipo_Id', tipo: 'lookup', opcion: 'CC - Cedula de Ciudadania' },
        { id: 'txtTercero_Tipo_Persona', tipo: 'lookup', opcion: '1 - Natural' },
        { id: 'txtTercero_PApellido', valor: 'Prueba' },
        { id: 'txtTercero_SApellido', valor: 'QA' },
        { id: 'txtTercero_PNombre', valor: 'Contable' },
        { id: 'txtTercero_Direccion', valor: 'Direccion prueba QA' },
        { id: 'txtTercero_Email', valor: 'correo@gmail.com' },
        { id: 'txtTercero_Telefono', valor: '123123123' }
    ]
};

const MAESTROS = [TERCEROS];

fixture `Prueba Duplicados Contable - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - TERCEROS - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro, testContableConfig);
    }
    await cerrarSesion360(t);
});
