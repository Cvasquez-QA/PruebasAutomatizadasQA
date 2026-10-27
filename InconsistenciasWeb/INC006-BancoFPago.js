import { Selector } from 'testcafe';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import {
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { guardarYConfirmar } from '../Funciones/HelpersMaestros360.js';
import { abrirMaestroConfig360 } from '../Funciones/MenuMaestros360.js';

/**
 * INC06 - Banco de la forma de pago (test.hgi360.com, POS > Maestros > Formas de Pago).
 * Cambia el banco de la forma de pago 1 Efectivo, valida que quedó guardado y deja el banco que tenía.
 */

const GRID = 'gridFormasPago';
const FORMA_PAGO = '1';
const BANCO_PRUEBA = '11 - BANCO CAJA SOCIAL';
const campoBanco = Selector('#FormasPago_Banco .dx-lookup-field');

async function editarFormaPago(t) {
    await abrirMaestroConfig360(t, testPosWebConfig, 'Formas de Pago', 'impuestos');
    await buscarEnGrid360(t, GRID, 'Efectivo');
    await accionFilaGrid360(t, GRID, FORMA_PAGO, 'Editar');
    await t.expect(campoBanco.with({ timeout: 15000 }).exists).ok('No se abrió el formulario de la forma de pago');
}

async function cambiarBanco(t, banco) {
    await elegirEnLookup360(t, '#FormasPago_Banco', banco, banco.split(' - ')[0]);
    await guardarYConfirmar(t, 'BtnGuardarFormaPago_btn', /actualizad/i, `Cambiar el banco de la forma de pago a ${banco}`);
}

fixture `Inconsistencias Erp Web`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC06 - BancoFPago', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await editarFormaPago(t);
    const bancoOriginal = (await campoBanco.innerText).trim();

    try {
        await cambiarBanco(t, BANCO_PRUEBA);
        await cerrarPestana360(t);

        await editarFormaPago(t);
        await t.expect(campoBanco.innerText).contains(BANCO_PRUEBA, 'No se almacenó el cambio de banco de la forma de pago');
    } finally {
        if (bancoOriginal && bancoOriginal !== BANCO_PRUEBA) {
            await cambiarBanco(t, bancoOriginal);
        }
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
