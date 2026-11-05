import {
    CONFIG_PARAMETROS,
    conParametros360,
    antesDeCadaParametros,
    despuesDeCadaParametros
} from '../../../../Funciones/FlujoParametrosPos360.js';
import { validarPestanaParametros360 } from '../../../../Funciones/HelpersParametros360.js';

// Herramientas > Parámetros > Móvil / Servicios (prueba nueva, 29-oct-2026). test.hgi360.com, AutPos, 8902.
// Valida los 8 parámetros (Campos Visibles Producto, Tiempo Sincronización GPS, saldos cero, estado del pedido y
// Tiempo de Servicios Web): nombres, solo lectura sin Editar y clic en modo edición sin dejar cambios.

fixture `Parámetros - Móvil y Servicios - Pos Web - Test Hgi360`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros)
    .afterEach(despuesDeCadaParametros);

test('Parámetros Móvil / Servicios - nombres y parámetros clickeables - Pos Web - Test Hgi360', async t => {
    await conParametros360(t, async () => {
        await validarPestanaParametros360(t, 'Movil');
    });
});
