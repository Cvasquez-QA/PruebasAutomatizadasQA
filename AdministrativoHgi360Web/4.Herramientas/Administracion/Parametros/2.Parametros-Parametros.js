import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametros360.js';
import { validarPestanaParametros360, cambiarGuardarYRestaurar360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros > Parámetros (Terceros, Productos, Mostrar en documentos, Cargar con F4/F6).
// test.hgi360.com, AutAdmin, 8902. Revisado en el navegador el 29-oct-2026.
// Los nombres de "Dato 0..7", "Parámetro 1..5" y los de productos son los títulos que ven los usuarios en los
// maestros: la prueba los cambia, valida que se guarden y los deja como estaban.

fixture `Parámetros - Parámetros - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Parámetros - nombres y parámetros clickeables - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Params');
    });
});

test('Parámetros Parámetros - guardar y restaurar - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Params', null, [
            { id: 'TxtParametrosGenerales_Params_StrTerceroParametro1', tipo: 'texto', valor: 'TerParQA', alterno: 'TerParQA2' },
            { id: 'TxtParametrosGenerales_Params_StrProductoParametro1', tipo: 'texto', valor: 'ProdParQA', alterno: 'ProdParQA2' },
            { id: 'TxtParametrosGenerales_Params_StrDocParametro1', tipo: 'texto', valor: 'DocParQA', alterno: 'DocParQA2' },
            { id: 'TxtParametrosGenerales_Params_IntF8SoloBodega', tipo: 'check' }
        ]);
    });
});
