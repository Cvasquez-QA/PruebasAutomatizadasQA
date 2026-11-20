import { Selector } from 'testcafe';
import {
    ejecutarCrudMaestro,
    prepararNavegador360,
    limpiarCache360,
    llenarCampos,
    elegirOpcion
} from '../../../Funciones/HelpersMaestros360.js';
import {
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPopup360,
    eliminarFilaGrid360,
    escribirCampoPopup360,
    filaGrid360,
    guardarPopup360,
    popupEdicion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/*
 * Terceros - test.hgi360.com (Maestros > terceros). Selectores validados en el navegador el 17-nov-2026.
 *
 * Crear:  diligencia todos los campos de Datos Generales, Condiciones comerciales, Información Tributaria y
 *         Parámetros (las pestañas que tiene el formulario nuevo).
 * Editar: cambia campos de varias pestañas y diligencia Puntos (pestaña que solo aparece en edición).
 * Grids:  solo existen en edición. Se crean los registros, se cierra el tercero, se vuelve a abrir en edición
 *         y ahí se editan y se eliminan:
 *           Información Tributaria: Otras Responsabilidades, Otras Actividades Económicas
 *           Contactos: Contactos, Cargos del contacto, Referencias del contacto
 *           Precios: Precios del tercero
 *           Otros: Terceros vinculados (dependencias), Teléfonos
 *         Movimiento y Puntos son de consulta: se valida que carguen.
 * Pendiente: no se encontró en la aplicación una opción de impresión de Habeas Data (ni en el formulario, ni al
 *            marcar las casillas, ni al guardar, ni en "Ver"); solo se diligencian las casillas.
 */

const CODIGO = '1010101099';
const DIRECCION_EDIT = 'Calle 1 QA Edit';
const OPCION_CERO = /^\s*0 - /; // listas de terceros y parámetros: se elige el registro 0

const pestana = id => ({ id, tipo: 'pestana' });

const GENERAL = [
    pestana('tabs_tercero_General'),
    { id: 'txtTercero_Tipo_Id', tipo: 'lookup', opcion: 'CC - Cedula de Ciudadania' },
    { id: 'txtTercero_Tipo_Persona', tipo: 'lookup', opcion: '1 - Natural' },
    { id: 'txtTercero_PApellido', valor: 'PruebaQA' },
    { id: 'txtTercero_SApellido', valor: 'Automatica' },
    { id: 'txtTercero_PNombre', valor: 'Tercero' },
    { id: 'txtTercero_SNombre', valor: 'QA' },
    { id: 'txtTercero_NombreComercial', valor: 'Comercial QA' },
    { id: 'txtTercero_FechaIng', valor: '2026-11-17' },
    { id: 'txtTercero_CodigoAux', valor: 'AUXQA1' },
    { id: 'txtTercero_Celular', valor: '3001112233' },
    { id: 'txtTercero_Email', valor: 'terceroqa@gmail.com' },
    { id: 'txtTercero_Telefono', valor: '6041234567' },
    { id: 'txtTercero_Fax', valor: '6047654321' },
    { id: 'txtTercero_EmailFE', valor: 'facturaqa@gmail.com' },
    { id: 'txtTercero_Web', valor: 'www.terceroqa.com' },
    { id: 'txtTercero_TipoTercero', tipo: 'lookup', opcion: '2 - Clientes' },
    { id: 'txtTercero_Direccion', valor: 'Calle 1 QA' },
    { id: 'txtTercero_Ciudad', tipo: 'lookup', opcion: '01 - MEDELLIN' },
    { id: 'txtTercero_Sector', tipo: 'lookup', opcion: '01 - INDUSTRIAL' },
    { id: 'txtTercero_Sucursal', tipo: 'lookup', opcion: '01 - MEDELLIN' },
    { id: 'txtTercero_Barrio', tipo: 'lookup', opcion: '0 - GENERAL' },
    { id: 'txtTercero_Vendedor', tipo: 'lookup', opcion: '0 - GENERAL' },
    { id: 'txtTercero_LineaNegocio', valor: 'Linea QA' },
    { id: 'txtTercero_CodigoPostalDIAN', tipo: 'lookup', opcion: '050001' },
    { id: 'txtTercero_Direccion2', valor: 'Carrera 2 QA' },
    { id: 'txtTercero_Estado', tipo: 'lookup', opcion: '1 - Activo' },
    { id: 'txtTercero_Marcado', tipo: 'check' },
    // Habeas Data
    { id: 'txtTercero_SmsHabeasData', tipo: 'check' },
    { id: 'txtTercero_EmailHabeasData', tipo: 'check' },
    { id: 'txtTercero_TelefonoHabeasData', tipo: 'check' },
    { id: 'txtTercero_DireccionHabeasData', tipo: 'check' }
];

const CONDICIONES = [
    pestana('tabs_tercero_Condiciones'),
    { id: 'txtTercero_Descuento', valor: '5' },
    { id: 'txtTercero_DocumentoAuxiliar', valor: '1' },
    { id: 'txtTercero_Plazo', valor: '30' },
    { id: 'txtTercero_DiasGracia', valor: '5' },
    { id: 'txtTercero_Cupo', valor: '1000000' },
    { id: 'txtTercero_BloqueaCupo', tipo: 'check' }
];

const TRIBUTARIA = [
    pestana('tabs_tercero_Tributaria'),
    { id: 'txtTercero_Regimen_Ventas', tipo: 'lookup', opcion: '2 - 48 - Impuesto sobre las ventas - IVA' },
    { id: 'txtTercero_Resp05', tipo: 'check' },
    { id: 'txtTercero_Resp07', tipo: 'check' },
    { id: 'txtTercero_Resp09', tipo: 'check' },
    { id: 'txtTercero_Resp13', tipo: 'check' },
    { id: 'txtTercero_Resp15', tipo: 'check' },
    { id: 'txtTercero_Resp35', tipo: 'check' },
    { id: 'txtTercero_Actividad_Economica', tipo: 'lookup', opcion: '01 - General' },
    { id: 'txtTercero_RetenedorIca', tipo: 'check' },
    { id: 'txtTercero_NoManejaBaseReteIva', tipo: 'check' },
    { id: 'txtTercero_NoManejaBaseReteFte', tipo: 'check' },
    { id: 'txtTercero_ContratoEstabilidadJuridica', tipo: 'check' },
    { id: 'txtTercero_ImpuestoSaludable', tipo: 'check' },
    { id: 'txtTercero_TipoContrato', tipo: 'lookup', opcion: '0 - Ninguno' }
];

const PARAMETROS = [
    pestana('tabs_tercero_Parametros'),
    { id: 'txtTercero_Cuenta', valor: '123456789' },
    { id: 'txtTipo', tipo: 'lookup', opcion: '2 - Ahorros' },
    { id: 'txtTercero_Entidad', tipo: 'lookup', opcion: '02 - BANCOLOMBIA' },
    { id: 'txtTercero_CiudadBanco', tipo: 'lookup', opcion: '01 - MEDELLIN' },
    { id: 'txtTercero_CodigoBanco', valor: '07' },
    { id: 'TxtTerceros_Observaciones', valor: 'Observacion tercero QA', tipo: 'area' },
    { id: 'TxtTerceros_StrDato0', valor: 'Dato0 QA' },
    { id: 'TxtTerceros_StrDato1', valor: 'Dato1 QA' },
    { id: 'TxtTerceros_StrDato2', valor: 'Dato2 QA' },
    { id: 'TxtTerceros_StrDato3', valor: 'Dato3 QA' },
    { id: 'TxtTerceros_StrDato4', valor: 'Dato4 QA' },
    { id: 'TxtTerceros_StrDato5', valor: 'dato5qa@gmail.com' },
    { id: 'TxtTerceros_StrDato6', valor: 'dato6qa@gmail.com' },
    { id: 'TxtTerceros_StrDato7', valor: 'Dato7 QA' },
    { id: 'TxtTerceros_StrContactoTecnico1', valor: 'Contacto1 QA' },
    { id: 'TxtTerceros_StrContactoTecnico2', valor: 'Contacto2 QA' },
    { id: 'TxtTerceros_StrRepLegal', valor: 'Tecnico3 QA' },
    { id: 'TxtTerceros_StrContactoComercal', valor: 'Tecnico4 QA' },
    { id: 'TxtTerceros_StrContactoCartera', valor: 'Tecnico5 QA' },
    { id: 'TxtTerceros_StrEan', valor: '7701234567890' },
    { id: 'TxtTerceros_IntDato1', valor: '1' },
    { id: 'TxtTerceros_IntDato2', valor: '2' },
    { id: 'txtTercero_StrRepresentante', tipo: 'lookup', opcion: OPCION_CERO },
    { id: 'txtTercero_StrProvTecnologico', tipo: 'lookup', opcion: OPCION_CERO },
    { id: 'txtTercero_StrParametro1', tipo: 'lookup', opcion: OPCION_CERO },
    { id: 'txtTercero_StrParametro2', tipo: 'lookup', opcion: OPCION_CERO },
    { id: 'txtTercero_StrParametro3', tipo: 'lookup', opcion: OPCION_CERO },
    { id: 'txtTercero_StrParametro4', tipo: 'lookup', opcion: OPCION_CERO },
    { id: 'txtTercero_StrParametro5', tipo: 'lookup', opcion: OPCION_CERO }
];

const MAESTRO = {
    maestro: 'Terceros',
    grupo: 'terceros',
    grid: 'gridTerceros',
    guardar: 'BtnGuardarTercero_btn',
    campoCodigo: 'txtTercero_Id',
    codigo: CODIGO,
    crear: [...GENERAL, ...CONDICIONES, ...TRIBUTARIA, ...PARAMETROS],
    editar: [
        pestana('tabs_tercero_General'),
        { id: 'txtTercero_Direccion', valor: DIRECCION_EDIT },
        { id: 'txtTercero_CodigoAux', valor: 'AUXQA2' },
        pestana('tabs_tercero_Condiciones'),
        { id: 'txtTercero_Plazo', valor: '45' },
        pestana('tabs_tercero_Tributaria'),
        { id: 'txtTercero_ImpuestoSaludable', tipo: 'check' }, // se desmarca
        pestana('tabs_tercero_Puntos'),
        { id: 'txtTercero_StrCategoriaPuntos', tipo: 'lookup', opcion: '0 - GENERAL' }
    ],
    validarEditado: DIRECCION_EDIT,
    // Al guardar la edición de un tercero la aplicación no muestra "Registro actualizado" (17-nov-2026)
    editarSinAviso: true,
    antesDeEliminar: crudGridsTercero
};

/* ---------------------------------------------------------------------------
 * Grids de la edición del tercero (popup "Edit form")
 * -------------------------------------------------------------------------*/

const GRID = {
    responsabilidades: 'gridTercerosResponsabilidades',
    actividades: 'gridTercerosActividadesEco',
    contactos: 'gridContactos',
    cargos: 'gridContactosCargo',
    referencias: 'gridContactosReferencia',
    precios: 'gridTercerosPrecios',
    vinculados: 'gridTercerosVinculados',
    telefonos: 'gridTercerosTelefonos'
};

const RESPONSABILIDAD = '02 - Gravamen a los movimientos financieros';
const RESPONSABILIDAD_EDIT = '03 - Impuesto al patrimonio';
const ACTIVIDAD = '0111 - Cultivo de cereales (excepto arroz), legumbres y semillas oleaginosas';
const ACTIVIDAD_EDIT = '0112 - Cultivo de arroz';
const CONTACTO = 'QACON1';
const CONTACTO_NOMBRE_EDIT = 'NombreQAEdit';
const CARGO = '1 - DP Administrativo';
const REFERENCIA = '1 - HGI Administrativo';
const PRECIO_EN_GRID = '5000,00';
const PRECIO_EDIT_EN_GRID = '6000,00';
const VINCULADO = 'DependenciaQA';
const VINCULADO_EDIT = 'DependenciaQAEdit';
const TELEFONO = '3001234567';
const TELEFONO_EDIT = '3007654321';

const formTercero = Selector('#BtnGuardarTercero_btn').filterVisible();
const toastVisible = Selector('.erp-toast').filterVisible();
// Capa "Cargando datos…" que la app pone sobre los grids al cambiar de pestaña o recargar; tapa los botones
const cargandoDatos = Selector('.erp-page-skeleton-bone').filterVisible();
const lookupPopup = campo => popupEdicion360.find(`.dx-lookup-field[id$="_${campo}"]`);
const celda = (grid, filaTexto, texto) => filaGrid360(grid, filaTexto).find('td').withExactText(String(texto));

/** El aviso verde de la aplicación puede tapar el Guardar del popup: se espera a que desaparezca. */
const esperarSinAvisos = async t => {
    await t.expect(toastVisible.exists).notOk('El aviso de la aplicación no desapareció', { timeout: 15000 });
};

const esperarCarga = async t => {
    await t.expect(cargandoDatos.exists).notOk('La pantalla no terminó de cargar ("Cargando datos…")', { timeout: 30000 });
};

const abrirPestana = async (t, id) => {
    await llenarCampos(t, [pestana(id)]);
    await esperarCarga(t);
};

const nuevoEnGrid = async (t, grid) => {
    const agregar = Selector(`#${grid} [aria-label="Agregar una fila"]`).filterVisible();
    await t.expect(agregar.with({ timeout: 10000 }).exists).ok(`No apareció "Agregar una fila" en ${grid}`);
    // Si el clic cae mientras el grid se recarga no abre nada: se reintenta
    for (let intento = 0; intento < 3 && !await popupEdicion360.exists; intento++) {
        await esperarCarga(t);
        await t.click(agregar);
        await popupEdicion360.with({ timeout: 5000 }).exists;
    }
    await t.expect(popupEdicion360.with({ timeout: 5000 }).exists).ok(`No se abrió el popup de ${grid}`);
};

const editarEnGrid = async (t, grid, texto) => {
    await esperarCarga(t);
    await accionFilaGrid360(t, grid, texto, 'Editar');
    await t.expect(popupEdicion360.with({ timeout: 10000 }).exists).ok(`No se abrió el popup para editar "${texto}" en ${grid}`);
};

const elegirEnPopup = async (t, campo, opcion) => {
    await t.click(lookupPopup(campo));
    await elegirOpcion(t, opcion);
};

const guardarEnGrid = async (t, grid, texto) => {
    await esperarSinAvisos(t);
    await guardarPopup360(t);
    await esperarCarga(t);
    await t.expect(filaGrid360(grid, texto).with({ timeout: 15000 }).exists)
        .ok(`No se ve "${texto}" en ${grid} después de guardar`);
};

const eliminarEnGrid = async (t, grid, texto) => {
    await esperarSinAvisos(t);
    await esperarCarga(t);
    await eliminarFilaGrid360(t, grid, texto);
};

/** Fecha de hoy desde el calendario del DateBox del popup (formato dd/MM/yyyy, HH:mm). */
const fechaHoyPopup = async (t, campo) => {
    const input = popupEdicion360.find(`input[id$="_${campo}"]`);
    const hoy = Selector('.dx-calendar').filterVisible().find('.dx-calendar-today');
    const ok = Selector('.dx-overlay-content .dx-button').filterVisible().withText(/^\s*(OK|Aceptar|Listo)\s*$/i);
    await t
        .click(input.parent('.dx-datebox').find('.dx-dropdowneditor-button'))
        .expect(hoy.with({ timeout: 5000 }).exists).ok(`No se abrió el calendario de ${campo}`)
        .click(hoy);
    if (await ok.with({ timeout: 1500 }).exists) {
        await t.click(ok);
    }
    await t.expect(input.value).notEql('', `No quedó fecha en ${campo}`);
};

const abrirTercero = async (t, m) => {
    await buscarEnGrid360(t, m.grid, m.codigo);
    await accionFilaGrid360(t, m.grid, m.codigo, 'Editar');
    await t.expect(formTercero.with({ timeout: 15000 }).exists).ok('No se abrió la edición del tercero');
    await esperarCarga(t);
};

const cerrarTercero = async t => {
    await t
        .click(Selector('#BtnCancelarTercero_btn').filterVisible())
        .expect(formTercero.with({ timeout: 10000 }).exists).notOk('No se cerró el formulario del tercero');
};

async function crearRegistrosGrids(t) {
    // Información Tributaria
    await abrirPestana(t, 'tabs_tercero_Tributaria');
    await nuevoEnGrid(t, GRID.responsabilidades);
    await elegirEnPopup(t, 'StrResponsabilidad', RESPONSABILIDAD);
    await guardarEnGrid(t, GRID.responsabilidades, RESPONSABILIDAD);

    await nuevoEnGrid(t, GRID.actividades);
    await elegirEnPopup(t, 'StrActividad', ACTIVIDAD);
    await guardarEnGrid(t, GRID.actividades, ACTIVIDAD);

    // Contactos (los grids de cargos y referencias se habilitan al seleccionar el contacto)
    await abrirPestana(t, 'tabs_tercero_Contactos');
    await nuevoEnGrid(t, GRID.contactos);
    await escribirCampoPopup360(t, 'StrIdContacto', CONTACTO);
    await escribirCampoPopup360(t, 'StrApellidos', 'ApellidoQA');
    await escribirCampoPopup360(t, 'StrNombres', 'NombreQA');
    await escribirCampoPopup360(t, 'StrDireccion', 'Calle 3 QA');
    await escribirCampoPopup360(t, 'StrTelefono', '6040001111');
    await escribirCampoPopup360(t, 'StrCelular', '3000001111');
    await escribirCampoPopup360(t, 'StrMail', 'contactoqa@gmail.com');
    await guardarEnGrid(t, GRID.contactos, CONTACTO);

    await esperarCarga(t);
    await t.click(filaGrid360(GRID.contactos, CONTACTO).find('td').withExactText('ApellidoQA'));
    await esperarCarga(t);
    await nuevoEnGrid(t, GRID.cargos);
    await elegirEnPopup(t, 'StrCargo', CARGO);
    await guardarEnGrid(t, GRID.cargos, CARGO);

    await nuevoEnGrid(t, GRID.referencias);
    await elegirEnPopup(t, 'StrReferencia', REFERENCIA);
    await escribirCampoPopup360(t, 'IntChequeo1', '1');
    await fechaHoyPopup(t, 'DatFecha1');
    await t.click(popupEdicion360.find('input[id$="_IntChequeo2"]')); // Perfil (SelectBox)
    await elegirOpcion(t, 'Ninguno');
    await guardarEnGrid(t, GRID.referencias, REFERENCIA);

    // Precios
    await abrirPestana(t, 'tabs_tercero_Precios');
    await nuevoEnGrid(t, GRID.precios);
    await elegirEnPopup(t, 'StrLinea', '* - Todos');
    await elegirEnPopup(t, 'StrGrupo', '* - Todos');
    await elegirEnPopup(t, 'StrProducto', '1 - PR BALANZA');
    await elegirEnPopup(t, 'StrVinculado', '0 - Dependencia');
    await escribirCampoPopup360(t, 'IntPrecio', '5000');
    await escribirCampoPopup360(t, 'IntLista', '1');
    await guardarEnGrid(t, GRID.precios, PRECIO_EN_GRID);

    // Otros
    await abrirPestana(t, 'tabs_tercero_Otros');
    await nuevoEnGrid(t, GRID.vinculados);
    await escribirCampoPopup360(t, 'IntIdVinculado', '1');
    await escribirCampoPopup360(t, 'StrNombre', VINCULADO);
    await escribirCampoPopup360(t, 'StrDireccion', 'Calle 2 QA');
    await escribirCampoPopup360(t, 'StrMail', 'dependenciaqa@gmail.com');
    await escribirCampoPopup360(t, 'StrContacto', 'Contacto dependencia');
    await escribirCampoPopup360(t, 'StrTelefono', '6042223333');
    await guardarEnGrid(t, GRID.vinculados, VINCULADO);

    await nuevoEnGrid(t, GRID.telefonos);
    await escribirCampoPopup360(t, 'StrTelefono', TELEFONO);
    await guardarEnGrid(t, GRID.telefonos, TELEFONO);

    // Pestañas de consulta
    await abrirPestana(t, 'tabs_tercero_Mvto');
    await t.expect(Selector('#tabs_tercero_content_Mvto .dx-datagrid').filterVisible().with({ timeout: 10000 }).exists)
        .ok('No cargó la pestaña Movimiento');
    await abrirPestana(t, 'tabs_tercero_Puntos');
    await t.expect(Selector('#txtTercero_PuntosDisponibles').filterVisible().with({ timeout: 10000 }).exists)
        .ok('No cargó la pestaña Puntos');
}

async function editarYEliminarRegistrosGrids(t) {
    // Información Tributaria
    await abrirPestana(t, 'tabs_tercero_Tributaria');
    await editarEnGrid(t, GRID.responsabilidades, RESPONSABILIDAD);
    await elegirEnPopup(t, 'StrResponsabilidad', RESPONSABILIDAD_EDIT);
    await guardarEnGrid(t, GRID.responsabilidades, RESPONSABILIDAD_EDIT);
    await eliminarEnGrid(t, GRID.responsabilidades, RESPONSABILIDAD_EDIT);

    await editarEnGrid(t, GRID.actividades, ACTIVIDAD);
    await elegirEnPopup(t, 'StrActividad', ACTIVIDAD_EDIT);
    await guardarEnGrid(t, GRID.actividades, ACTIVIDAD_EDIT);
    await eliminarEnGrid(t, GRID.actividades, ACTIVIDAD_EDIT);

    // Contactos: primero cargos y referencias del contacto, luego el contacto
    await abrirPestana(t, 'tabs_tercero_Contactos');
    await esperarCarga(t);
    await t.click(filaGrid360(GRID.contactos, CONTACTO).find('td').withExactText('ApellidoQA'));
    await esperarCarga(t);

    // El cargo es la llave del registro: en edición queda bloqueado, se valida y se cierra sin cambios
    await editarEnGrid(t, GRID.cargos, CARGO);
    await t.expect(lookupPopup('StrCargo').withText(CARGO).exists).ok('El popup del cargo no muestra el cargo');
    await cerrarPopup360(t);
    await eliminarEnGrid(t, GRID.cargos, CARGO);

    await editarEnGrid(t, GRID.referencias, REFERENCIA);
    await escribirCampoPopup360(t, 'IntChequeo1', '2');
    await esperarSinAvisos(t);
    await guardarPopup360(t);
    await t.expect(celda(GRID.referencias, REFERENCIA, '2').with({ timeout: 15000 }).exists)
        .ok('No se ve el Cap editado en las referencias del contacto');
    await eliminarEnGrid(t, GRID.referencias, REFERENCIA);

    await editarEnGrid(t, GRID.contactos, CONTACTO);
    await escribirCampoPopup360(t, 'StrNombres', CONTACTO_NOMBRE_EDIT);
    await esperarSinAvisos(t);
    await guardarPopup360(t);
    await t.expect(celda(GRID.contactos, CONTACTO, CONTACTO_NOMBRE_EDIT).with({ timeout: 15000 }).exists)
        .ok('No se ve el nombre editado del contacto');
    await eliminarEnGrid(t, GRID.contactos, CONTACTO);

    // Precios (línea, grupo y producto quedan bloqueados en edición)
    await abrirPestana(t, 'tabs_tercero_Precios');
    await editarEnGrid(t, GRID.precios, PRECIO_EN_GRID);
    await escribirCampoPopup360(t, 'IntPrecio', '6000');
    await guardarEnGrid(t, GRID.precios, PRECIO_EDIT_EN_GRID);
    await eliminarEnGrid(t, GRID.precios, PRECIO_EDIT_EN_GRID);

    // Otros
    await abrirPestana(t, 'tabs_tercero_Otros');
    await editarEnGrid(t, GRID.vinculados, VINCULADO);
    await escribirCampoPopup360(t, 'StrNombre', VINCULADO_EDIT);
    await guardarEnGrid(t, GRID.vinculados, VINCULADO_EDIT);
    await eliminarEnGrid(t, GRID.vinculados, VINCULADO_EDIT);

    await editarEnGrid(t, GRID.telefonos, TELEFONO);
    await escribirCampoPopup360(t, 'StrTelefono', TELEFONO_EDIT);
    await guardarEnGrid(t, GRID.telefonos, TELEFONO_EDIT);
    await eliminarEnGrid(t, GRID.telefonos, TELEFONO_EDIT);
}

/** Crea los registros de los grids, cierra el tercero y en una nueva edición los edita y los elimina. */
async function crudGridsTercero(t, m) {
    await abrirTercero(t, m);
    await crearRegistrosGrids(t);
    await cerrarTercero(t);

    await abrirTercero(t, m);
    await editarYEliminarRegistrosGrids(t);
    await cerrarTercero(t);
}

fixture `Prueba Terceros - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Terceros CRUD con pestañas y grids - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
