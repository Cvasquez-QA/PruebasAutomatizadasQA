import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametrosPos360.js';
import { validarPestanaParametros360, cambiarGuardarYRestaurar360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros > Defecto (valores por defecto de terceros, productos y pagos).
// test.hgi360.com, AutPos, 8902. Revisado en el navegador el 29-oct-2026.
// Los lookups ahora tienen ids txtPG_<Campo> (antes #txt_lista_PG_<Campo>, que ya no existen).

fixture `Parámetros - Defecto - Pos Web - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Defecto - nombres y parámetros clickeables - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Defecto');
    });
});

test('Parámetros Defecto - guardar y restaurar - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Defecto', null, [
            { id: 'PG_DireccionDef', tipo: 'texto', valor: 'CALLE QA 1', alterno: 'CALLE QA 2' },
            { id: 'PG_TelefonoDef', tipo: 'texto', valor: '6040000001', alterno: '6040000002' }
        ]);
    });
});
