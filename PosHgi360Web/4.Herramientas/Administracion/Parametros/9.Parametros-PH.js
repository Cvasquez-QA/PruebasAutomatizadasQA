import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametrosPos360.js';
import { validarPestanaParametros360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros > PH (Propiedad Horizontal; prueba nueva, 29-oct-2026). test.hgi360.com, AutPos, 8902.
// Valida los 16 parámetros (Ph, Documentos, Incentivos y Decimales): nombres, solo lectura sin Editar y clic en
// modo edición sin dejar cambios.

fixture `Parámetros - PH - Pos Web - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros PH - nombres y parámetros clickeables - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'PH');
    });
});
