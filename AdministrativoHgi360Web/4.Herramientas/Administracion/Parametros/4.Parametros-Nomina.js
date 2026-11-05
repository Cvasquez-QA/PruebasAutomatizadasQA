import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametros360.js';
import {
    validarPestanaParametros360,
    cambiarGuardarYRestaurar360,
    abrirPestanaParametros360,
    editarParametros360,
    validarColumnasGrid360,
    agregarFilaGrid360,
    editarFilaGrid360,
    escribirCampoPopupParametros,
    elegirLookupPopupParametros,
    guardarPopupParametros,
    eliminarFilaGridParametros360,
    eliminarFilaSiExisteParametros360,
    filaGridParametros
} from '../../../../Funciones/HelpersParametros360.js';
import { GRIDS_PARAMETROS } from '../../../../Funciones/InventarioParametros360.js';

// Herramientas > Parámetros > Nómina (General, Conceptos, Dispositivos). test.hgi360.com, AutAdmin, 8902.
// Revisado en el navegador el 29-oct-2026.
// Dispositivos: CRUD del grid (popup "Dispositivos de nómina"). El 29-oct-2026, al guardar un dispositivo nuevo,
// AutAdmin recibió "El usuario no tiene permisos para la ejecución": si sigue así, esa prueba falla con ese mensaje
// (es un tema de permisos del usuario o del ERP, no de la prueba).

const GRID = GRIDS_PARAMETROS.NominaDispositivos;
const CODIGO = 'QADSP';
const DESCRIPCION = 'Dispositivo QA';
const DESCRIPCION_EDITADA = 'Dispositivo QA editado';

fixture `Parámetros - Nómina - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Nómina (General y Conceptos) - nombres y parámetros clickeables - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Nomina');
    });
});

test('Parámetros Nómina - guardar y restaurar - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Nomina', 'tabs_parametrosNom_General', [
            { id: 'TxtPrm_Nomina_StrFormatoValorN', tipo: 'texto', valor: 'n1', alterno: 'n3' },
            { id: 'TxtPrm_Nomina_StrCondicionEspecial', tipo: 'texto', valor: 'CondQA', alterno: 'CondQA2' },
            { id: 'TxtPrm_Nomina_IntDestajo', tipo: 'check' }
        ]);
    });
});

test('Parámetros Nómina > Dispositivos - CRUD del grid - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        // "Agregar una fila" solo aparece en modo edición (01-nov-2026)
        await editarParametros360(t);
        await abrirPestanaParametros360(t, GRID.pestana, GRID.subpestana);
        await validarColumnasGrid360(t, GRID.grid, GRID.columnas);
        await eliminarFilaSiExisteParametros360(t, GRID.grid, CODIGO);

        // Crear
        await agregarFilaGrid360(t, GRID.grid);
        await escribirCampoPopupParametros(t, 'StrIdDispositivo', CODIGO);
        await escribirCampoPopupParametros(t, 'StrDescripcion', DESCRIPCION);
        await escribirCampoPopupParametros(t, 'StrIp', '10.0.0.250');
        await elegirLookupPopupParametros(t, 'ZK');
        await guardarPopupParametros(t);
        await t.expect(filaGridParametros(GRID.grid, CODIGO).with({ timeout: 15000 }).exists).ok('No aparece el dispositivo creado');

        // Editar
        await editarFilaGrid360(t, GRID.grid, CODIGO);
        await escribirCampoPopupParametros(t, 'StrDescripcion', DESCRIPCION_EDITADA);
        await guardarPopupParametros(t);
        await t.expect(filaGridParametros(GRID.grid, DESCRIPCION_EDITADA).with({ timeout: 15000 }).exists).ok('No se guardó la descripción editada');

        // Eliminar
        await eliminarFilaGridParametros360(t, GRID.grid, CODIGO);
    });
});
