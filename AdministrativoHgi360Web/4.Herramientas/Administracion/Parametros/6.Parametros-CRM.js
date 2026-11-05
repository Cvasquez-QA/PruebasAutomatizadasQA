import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametros360.js';
import { validarPestanaParametros360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros > CRM (prueba nueva, 29-oct-2026). test.hgi360.com, AutAdmin, 8902.
// Valida los 24 parámetros (Oportunidades, Agenda, Casos y Parámetros por defecto): que existan con su nombre,
// que sin Editar estén en solo lectura y que en modo edición respondan al clic sin dejar cambios.
// Las descripciones de Fecha 1..4 no tienen etiqueta propia (van al lado de cada casilla Fecha N).

fixture `Parámetros - CRM - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros CRM - nombres y parámetros clickeables - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'CRM');
    });
});
