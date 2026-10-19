import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - TERCEROS (test.hgi360.com, AutPos).
// Por cada maestro: crea el registro de prueba, intenta crearlo de nuevo con el mismo código,
// valida el rechazo ("Ya existe un registro...") y borra el registro.
// Las definiciones son las mismas de las pruebas CRUD de 1.Maestros (selectores validados).

const TIPOSTERCEROUX = {
    maestro: 'Tipos Tercero',
    grupo: 'terceros',
    grid: 'gridTiposTerceros',
    guardar: 'BtnGuardarTipoTerceros_btn',
    campoCodigo: 'txtIntIdTipoTercero',
    codigo: 'QATT1',
    crear: [
        { id: 'txtTipoTerceros_Descripcion', valor: 'descTipoTercero' },
        { id: 'txtTiposTerceros_IntPrecio', tipo: 'lookup', opcion: '1 - Precio 1' }
    ],
    editar: [
        { id: 'txtTipoTerceros_Descripcion', valor: 'NuevaDescripciónTipoTerceros' }
    ],
    validarEditado: 'NuevaDescripciónTipoTerceros'
};

const VENDEDORESUX = {
    maestro: 'Vendedores',
    grupo: 'terceros',
    grid: 'gridVendedores',
    guardar: 'BtnGuardarVendedor_btn',
    campoCodigo: 'txtVendedor_Codigo',
    codigo: 'QAVEN1',
    crear: [
        { id: 'txtVendedores_Nombre', valor: 'VENDEDORCITO' },
        { id: 'txtVendedores_ReporteA', tipo: 'lookup', filtro: 'General', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_Sucursal', tipo: 'lookup', filtro: 'General', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_Activo', tipo: 'check' }
    ],
    editar: [
        { id: 'txtVendedores_Nombre', valor: 'Vendedor Pérez' }
    ],
    validarEditado: 'Vendedor Pérez'
};

const ACTIVIDADESECO = {
    maestro: 'Actividades Eco',
    grupo: 'terceros',
    grid: 'gridActividadesEconomicas',
    guardar: 'BtnGuardarActividadEconomica_btn',
    campoCodigo: 'txtActividadEconomica_Id',
    codigo: 'QAACT1',
    crear: [
        { id: 'txtActividadEconomica_Descripcion', valor: 'descActividadEco' }
    ],
    editar: [
        { id: 'txtActividadEconomica_Descripcion', valor: 'nuevaDescActividadEco' }
    ],
    validarEditado: 'nuevaDescActividadEco'
};

const TERCEROSUX = {
    maestro: 'Terceros',
    grupo: 'terceros',
    grid: 'gridTerceros',
    guardar: 'BtnGuardarTercero_btn',
    campoCodigo: 'txtTercero_Id',
    codigo: '1010101010',
    crear: [
        { id: 'txtTercero_Tipo_Id', tipo: 'lookup', opcion: 'CC - Cedula de Ciudadania' },
        { id: 'txtTercero_Tipo_Persona', tipo: 'lookup', opcion: '1 - Natural' },
        { id: 'txtTercero_PApellido', valor: 'Monsalve' },
        { id: 'txtTercero_SApellido', valor: 'QA' },
        { id: 'txtTercero_PNombre', valor: 'Yesica' },
        { id: 'txtTercero_Direccion', valor: 'la Casa De Yesica' },
        { id: 'txtTercero_Email', valor: 'correo@gmail.com' },
        { id: 'txtTercero_Telefono', valor: '123123123' },
        { id: 'txtTercero_TipoTercero', tipo: 'lookup', opcion: '2 - Clientes' }
    ],
    editar: [
        { id: 'txtTercero_Telefono', valor: '654321' }
    ],
    validarEditado: '654321'
};

const MAESTROS = [TIPOSTERCEROUX, VENDEDORESUX, ACTIVIDADESECO, TERCEROSUX];

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - TERCEROS - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro);
    }
    await cerrarSesion360(t);
});
