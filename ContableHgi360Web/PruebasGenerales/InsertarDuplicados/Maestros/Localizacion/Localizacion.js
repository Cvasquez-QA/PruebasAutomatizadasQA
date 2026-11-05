import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - LOCALIZACIÓN (test.hgi360.com, AutContable).
// Por cada maestro: crea el registro de prueba, intenta crearlo de nuevo con el mismo código,
// valida el rechazo ("Ya existe un registro...") y borra el registro.
// Ids del formulario tomados en el navegador el 03-nov-2026 con AutContable.
// No incluidos: Barrios, Bodegas, Sectores y Zonas (no están en el menú Maestros del módulo Contable).

const CENTROCOSTO = {
    maestro: 'Centro de Costo',
    grid: 'gridCentrosCostos',
    guardar: 'BtnActualizarCentroCosto_btn',
    campoCodigo: 'txtCentroCosto_Codigo',
    codigo: 'QADUPCC',
    crear: [
        { id: 'txtCentroCosto_Descripcion', valor: 'MIDESCRIPCIONCC' },
        { id: 'txtCentroCosto_Estado', tipo: 'check' }
    ]
};

const CIUDADES = {
    maestro: 'Ciudades',
    grid: 'gridCiudades',
    guardar: 'BtnGuardarCiudad_btn',
    campoCodigo: 'txtCiudad_Id',
    codigo: 'QADUPCIU',
    crear: [
        { id: 'txtCiudad_Descripcion', valor: 'MIDESCRIPCIONCIUDAD' },
        { id: 'txtCiudad_Zonas', tipo: 'lookup', filtro: 'GENERAL', opcion: /GENERAL/ },
        { id: 'txtCiudad_Dane_Ciudad', tipo: 'lookup', filtro: 'AGUADAS', opcion: /AGUADAS/ },
        { id: 'txtCiudad_Dane_Pais', valor: 'MIPAIS' },
        { id: 'txtCiudad_Dane_PaisIso', tipo: 'lookup', filtro: 'Alemania', opcion: /Alemania/ }
    ]
};

const SUBCENTROCOSTO = {
    maestro: 'SubCentro de Costo',
    grid: 'gridSubCentrosCostos',
    guardar: 'BtnActualizarSubCentroCosto_btn',
    campoCodigo: 'txtSubCentroCosto_Codigo',
    codigo: 'QADUPSCC',
    crear: [
        { id: 'txtSubCentroCosto_Descripcion', valor: 'MIDESCRIPCIONSUBCC' },
        { id: 'txtSubCentroCosto_Estado', tipo: 'check' }
    ]
};

const SUCURSALES = {
    maestro: 'Sucursales',
    grid: 'gridSucursales',
    guardar: 'BtnActualizarSucursal_btn',
    campoCodigo: 'txtStrIdSucursal',
    codigo: 'QADUPSUC',
    crear: [
        { id: 'txtSucursales_Descripcion', valor: 'MIDESCRIPCIONSUC' },
        { id: 'txtSucursales_IntEstado', tipo: 'check' }
    ]
};

const MAESTROS = [CENTROCOSTO, CIUDADES, SUBCENTROCOSTO, SUCURSALES];

fixture `Prueba Duplicados Contable - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - LOCALIZACION - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro, testContableConfig);
    }
    await cerrarSesion360(t);
});
