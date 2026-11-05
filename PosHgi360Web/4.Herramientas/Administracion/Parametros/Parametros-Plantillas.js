import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametrosPos360.js';
import {
    abrirPestanaParametros360,
    editarParametros360,
    validarColumnasGrid360,
    agregarFilaGrid360,
    editarFilaGrid360,
    escribirCampoPopupParametros,
    elegirOpcionLibrePopupParametros,
    guardarPopupParametros,
    eliminarFilaGridParametros360,
    eliminarFilaSiExisteParametros360,
    filaGridParametros,
    textosColumnaGrid360
} from '../../../../Funciones/HelpersParametros360.js';
import { GRIDS_PARAMETROS } from '../../../../Funciones/InventarioParametros360.js';

// Herramientas > Parámetros > Plantillas: CRUD del grid #gridParametrosGeneralesPlantillas.
// test.hgi360.com, AutPos, 8902. Revisado en el navegador el 29-oct-2026.
// - El popup "Plantillas de parámetros" tiene Plantilla (Nómina, Extracto), Título y Mensaje (textarea).
// - Solo puede haber una plantilla por tipo; si se repite sale "Código '...' Ya existe un registro con el código
//   ingresado". La prueba usa el tipo libre; antes borra la que haya dejado una corrida anterior (título TITULO o
//   "pruebaNomina", que dejaba la prueba vieja). El 29-oct-2026 se borró esa "pruebaNomina" y Nómina quedó libre.

const GRID = GRIDS_PARAMETROS.Plantillas;
const TITULO = 'QA Plantilla';
const TITULOS_DE_PRUEBA = [TITULO, 'pruebaNomina'];
const MENSAJE = 'Mensaje QA plantilla';
const MENSAJE_EDITADO = 'Mensaje QA plantilla editado';

fixture `Parámetros - Plantillas - Pos Web - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Plantillas - CRUD de plantillas - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await editarParametros360(t);
        await abrirPestanaParametros360(t, GRID.pestana);
        await validarColumnasGrid360(t, GRID.grid, GRID.columnas);
        for (const titulo of TITULOS_DE_PRUEBA) {
            await eliminarFilaSiExisteParametros360(t, GRID.grid, titulo);
        }

        // Tipo de plantilla libre
        const usados = await textosColumnaGrid360(GRID.grid, 1);
        await agregarFilaGrid360(t, GRID.grid);
        const tipo = await elegirOpcionLibrePopupParametros(t, usados);
        await t.expect(tipo).ok(`Ya existe una plantilla de cada tipo (${usados.join(', ')}): no se puede crear una de prueba`);

        // Crear (el tipo ya quedó elegido)
        await escribirCampoPopupParametros(t, 'StrTitulo', TITULO);
        await escribirCampoPopupParametros(t, 'StrMensaje', MENSAJE);
        await guardarPopupParametros(t);
        const fila = filaGridParametros(GRID.grid, TITULO);
        await t
            .expect(fila.with({ timeout: 15000 }).exists).ok('No aparece la plantilla creada')
            .expect(fila.find('td').withExactText(tipo).exists).ok(`La plantilla no quedó con el tipo ${tipo}`)
            .expect(fila.find('td').withExactText(MENSAJE).exists).ok('La plantilla no quedó con el mensaje');

        // Editar
        await editarFilaGrid360(t, GRID.grid, TITULO);
        await escribirCampoPopupParametros(t, 'StrMensaje', MENSAJE_EDITADO);
        await guardarPopupParametros(t);
        await t.expect(filaGridParametros(GRID.grid, TITULO).find('td').withExactText(MENSAJE_EDITADO).with({ timeout: 15000 }).exists)
            .ok('No se guardó el mensaje editado');

        // Eliminar
        await eliminarFilaGridParametros360(t, GRID.grid, TITULO);
    });
});
