import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - LOCALIZACION (test.hgi360.com, AutPos).
// Por cada maestro: crea el registro de prueba, intenta crearlo de nuevo con el mismo código,
// valida el rechazo ("Ya existe un registro...") y borra el registro.
// Las definiciones son las mismas de las pruebas CRUD de 1.Maestros (selectores validados).
// No incluidos: Barrios, Centro de Costo, Sectores, Subcentro de Costo, Sucursales (no están en el menú de Maestros del módulo POS).

const BODEGASUX = {
    maestro: 'Bodegas',
    grupo: 'localizacion',
    grid: 'gridBodegas',
    guardar: 'BtnActualizarBodega_btn',
    campoCodigo: 'txtIdBodega',
    codigo: 'QABOD1',
    crear: [
        { id: 'txtBodega_Descripcion', valor: 'descripcionmibodega' },
        { id: 'txtBodega_Direccion', valor: 'direcciónmibidega123' },
        { id: 'txtBodega_Telefono', valor: '1623456' },
        { id: 'txtBodega_Responsable', valor: 'no sé' },
        { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 1' }
    ],
    editar: [
        { id: 'txtBodega_Descripcion', valor: 'nueva descripcion bodega' },
        { id: 'txtBodega_Responsable', valor: 'nuevoresponsablebodega' },
        { id: 'txtBodega_ListaPrecios', tipo: 'lookup', opcion: 'Precio 2' }
    ],
    validarEditado: 'nueva descripcion bodega'
};

const CIUDADESUX = {
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

const ZONASUX = {
    maestro: 'Zonas',
    grupo: 'localizacion',
    grid: 'gridZonas',
    guardar: 'BtnActualizarZona_btn',
    campoCodigo: 'txtZona_Codigo',
    codigo: 'QAZONA',
    crear: [
        { id: 'txtZona_Descripcion', valor: 'DescripcionMiZona' }
    ],
    editar: [
        { id: 'txtZona_Descripcion', valor: 'NuevaDescripcionZona' }
    ],
    validarEditado: 'NuevaDescripcionZona'
};

const MAESTROS = [BODEGASUX, CIUDADESUX, ZONASUX];

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - LOCALIZACION - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro);
    }
    await cerrarSesion360(t);
});
