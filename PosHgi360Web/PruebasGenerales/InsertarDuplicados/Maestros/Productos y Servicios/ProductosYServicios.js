import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - PRODUCTOS Y SERVICIOS (test.hgi360.com, AutPos).
// Por cada maestro: crea el registro de prueba, intenta crearlo de nuevo con el mismo código,
// valida el rechazo ("Ya existe un registro...") y borra el registro.
// Las definiciones son las mismas de las pruebas CRUD de 1.Maestros (selectores validados).

const CLASES = {
    maestro: 'Clases',
    grupo: 'productos',
    grid: 'gridClases',
    guardar: 'BtnActualizarClases_btn',
    campoCodigo: 'txtStrIdClase',
    codigo: 'QACLA1',
    crear: [
        { id: 'txtClase_Descripcion', valor: 'MiDescripcionClase' },
        { id: 'txtClases_IntTipo', tipo: 'lookup', opcion: 'Productos' },
        { id: 'txtClases_StrConcepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' }
    ],
    editar: [
        { id: 'txtClase_Descripcion', valor: 'MiNuevaDescripciónClase' }
    ],
    validarEditado: 'MiNuevaDescripciónClase'
};

const GRUPOS = {
    maestro: 'Grupos',
    grupo: 'productos',
    grid: 'gridGrupos',
    guardar: 'BtnGuardarGrupos_btn',
    campoCodigo: 'txtIdGrupo',
    codigo: 'QAGRU1',
    crear: [
        { id: 'txtGrupo_Descripcion', valor: 'MiDescripciónGrupo' },
        { id: 'txtGrupo_Producto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' },
        { id: 'txtGrupo_TipoGrupo', valor: '2' },
        { id: 'txtGrupo_StrConcepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' },
        { id: 'txtGrupo_IntPrioridad', valor: '10' }
    ],
    editar: [
        { id: 'txtGrupo_Descripcion', valor: 'MiNuevaDescripciónGrupo' }
    ],
    validarEditado: 'MiNuevaDescripciónGrupo'
};

const LINEAS = {
    maestro: 'Lineas',
    grupo: 'productos',
    grid: 'gridLineas',
    guardar: 'BtnGuardarLinea_btn',
    campoCodigo: 'txtIdLinea',
    codigo: 'QALIN1',
    crear: [
        { id: 'txtLineas_Descripcion', valor: 'MiDescripciónLinea' }
    ],
    editar: [
        { id: 'txtLineas_Descripcion', valor: 'MiNuevaDescripciónLinea' }
    ],
    validarEditado: 'MiNuevaDescripciónLinea'
};

const TIPOS = {
    maestro: 'Tipos',
    grupo: 'productos',
    grid: 'gridTipos',
    guardar: 'BtnGuardarTipo_btn',
    campoCodigo: 'txtIdTipo',
    codigo: 'QATIP1',
    crear: [
        { id: 'txtTipo_Descripcion', valor: 'MiDescripcionTipo' }
    ],
    editar: [
        { id: 'txtTipo_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtMaestroTipo_Concepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' }
    ],
    validarEditado: 'minuevadescripcion'
};

const PRODUCTOS = {
    maestro: 'Productos',
    grupo: 'productos',
    grid: 'gridProductos',
    guardar: 'BtnGuardarProducto_btn',
    campoCodigo: 'txtIdProducto',
    codigo: '141517',
    crear: [
        { id: 'txtProducto_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtMaestroProductos_PrecioVenta', valor: '1000' },
        { id: 'txtMaestroProductos_PrecioVenta2', valor: '2000' },
        { id: 'txtMaestroProductos_PrecioVenta3', valor: '3000' },
        { id: 'txtMaestroProductos_PrecioVenta4', valor: '4000' },
        { id: 'txtMaestroProductos_PrecioVenta5', valor: '5000' },
        { id: 'txtMaestroProductos_PrecioVenta6', valor: '6000' },
        { id: 'txtMaestroProductos_PrecioVenta7', valor: '7000' },
        { id: 'txtMaestroProductos_PrecioVenta8', valor: '8000' },
        { id: 'txtMaestroProductos_Descuento1', valor: '10' },
        { id: 'txtMaestroProductos_Descuento2', valor: '20' },
        { id: 'txtMaestroProductos_Descuento3', valor: '30' },
        { id: 'txtMaestroProductos_Descuento4', valor: '40' },
        { id: 'txtMaestroProductos_Kardex', tipo: 'check' },
        { id: 'txtMaestroProductos_Movil', tipo: 'check' },
        { id: 'txtMaestroProductos_Vigente', tipo: 'check' },
        { id: 'txtMaestroProductos_ManejaLote', tipo: 'check' },
        { id: 'txtMaestroProductos_ImpPlastico', tipo: 'check' },
        { id: 'txtMaestroProductos_Excluido', tipo: 'check' }
    ],
    editar: [
        { id: 'txtProducto_Descripcion', valor: 'MINUEVADESCRIPCION' },
        { id: 'txtMaestroProductos_TarifasImpuesto1', tipo: 'lookup', opcion: 'No Aplica' },
        { id: 'txtMaestroProductos_TarifasImpuesto2', tipo: 'lookup', opcion: 'No Aplica' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

const MAESTROS = [CLASES, GRUPOS, LINEAS, TIPOS, PRODUCTOS];

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - PRODUCTOS Y SERVICIOS - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro, testPosWebConfig);
    }
    await cerrarSesion360(t);
});
