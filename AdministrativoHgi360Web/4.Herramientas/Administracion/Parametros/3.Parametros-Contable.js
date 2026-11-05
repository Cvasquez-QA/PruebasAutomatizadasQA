import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametros360.js';
import { validarPestanaParametros360, cambiarGuardarYRestaurar360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros > Contable (test.hgi360.com, AutAdmin, 8902). Revisado en el navegador el 29-oct-2026.
// 1) Nombres de los 20 parámetros, solo lectura sin Editar y clic en cada uno en modo edición sin dejar cambios.
// 2) Cambia Parámetro 1 de Activos Fijos, Decimales y "Pasa Valor Cero", guarda, valida y restaura los valores
//    que había (se leen antes de cambiar; ya no se restauran valores fijos).

fixture `Parámetros - Contable - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Contable - nombres y parámetros clickeables - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Contable');
    });
});

test('Parámetros Contable - guardar y restaurar - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await cambiarGuardarYRestaurar360(t, 'Contable', null, [
            { id: 'TxtParametrosGenerales_Params_StrNombreActParametro1', tipo: 'texto', valor: 'ParamQA', alterno: 'ParamQA2' },
            { id: 'TxtPrm_Contable_IntDecimalesCon', tipo: 'texto', valor: '3', alterno: '2' },
            { id: 'TxtPrm_Contable_IntPasaValorCero', tipo: 'check' }
        ]);
    });
});
