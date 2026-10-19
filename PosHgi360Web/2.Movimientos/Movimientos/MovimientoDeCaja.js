import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarPestana360,
    cerrarSesion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    abrirMovimientosDeCaja360,
    leerMovimientoCaja360,
    venderEnPuntoDeVenta360,
    CAJA_PV
} from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos de Caja (test.hgi360.com, AutPos, caja 10):
// 1) Saldo = Base + Ventas - Retiros
// 2) Se hace una venta en el Punto de Venta (transacción 0101, producto 010203)
// 3) El saldo de la caja aumenta en el valor del documento
const TOLERANCIA = 1; // redondeo de decimales en el grid

async function ejecutarPruebaMovimientoCaja(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientosDeCaja360(t, CAJA_PV);

    const antes = await leerMovimientoCaja360(t);
    await t
        .expect(Math.abs(antes.saldo - (antes.base + antes.ventas - antes.retiros)))
        .lte(TOLERANCIA, `El saldo no es Base + Ventas - Retiros (${JSON.stringify(antes.texto)})`);
    await cerrarPestana360(t);

    const valorDocumento = await venderEnPuntoDeVenta360(t, { caja: CAJA_PV });

    await abrirMovimientosDeCaja360(t, CAJA_PV);
    const despues = await leerMovimientoCaja360(t);
    await t
        .expect(Math.abs(despues.saldo - (antes.saldo + valorDocumento)))
        .lte(TOLERANCIA, `El saldo debería aumentar en ${valorDocumento} (antes ${antes.saldo}, después ${despues.saldo})`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}


// Cierre de caja: Movimientos de Caja > Cierre de caja > Cerrar Caja, con la caja cuadrada en
// denominaciones (1 x total de la caja). Si quedan documentos temporales de la caja, la app avisa
// "Los siguientes documentos temporales se encuentran..."; hay que borrarlos en
// Utilitarios > Gestión Temporales antes de cerrar.
// PENDIENTE: el popup de cierre de la versión React no se pudo recorrer en el navegador; los ids son
// los de la versión anterior (#BtnCerrarCajaMov, #BtnConfirmarCerrarCajaMov). Por eso la prueba
// está en skip: quitar el .skip después de validarla. Al ejecutarse deja la caja 10 cerrada.
const MSG_DOCS_TEMPORALES = 'documentos temporales';
const MSG_CAJA_CERRADA = 'Caja cerrada exitosamente';

async function ejecutarPruebaCierreCaja(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientosDeCaja360(t, CAJA_PV);

    const { saldo } = await leerMovimientoCaja360(t);
    await t.click(Selector('#BtnCerrarCajaMov').filterVisible());

    const aviso = Selector('.swal2-popup').filterVisible();
    if (await aviso.withText(MSG_DOCS_TEMPORALES).with({ timeout: 4000 }).exists) {
        await t.expect(false).ok('La caja tiene documentos temporales: elimínelos en Utilitarios > Gestión Temporales y vuelva a ejecutar');
    }

    // Denominaciones: primera fila con cantidad 1 y valor igual al saldo de la caja
    const filaDenominacion = Selector('.dx-popup-wrapper tr.dx-data-row').filterVisible().nth(0);
    if (await filaDenominacion.with({ timeout: 5000 }).exists) {
        await t
            .click(filaDenominacion.find('td').nth(1))
            .pressKey('ctrl+a')
            .typeText(filaDenominacion.find('td').nth(1), '1')
            .pressKey('tab')
            .pressKey('ctrl+a')
            .typeText(filaDenominacion.find('td').nth(2), String(Math.round(saldo)))
            .pressKey('enter');
    }

    await t.click(Selector('#BtnConfirmarCerrarCajaMov').filterVisible().with({ timeout: 10000 }));
    if (await Selector('button.swal2-confirm').filterVisible().with({ timeout: 4000 }).exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }
    await t.expect(Selector('.swal2-popup, .erp-toast').filterVisible().withText(MSG_CAJA_CERRADA).with({ timeout: 20000 }).exists)
        .ok('No apareció el mensaje de caja cerrada');
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Movimiento de Caja testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba valores luego de un documento testerp - Test Hgi360', async t => {
    await ejecutarPruebaMovimientoCaja(t, testPosWebConfig);
});

test.skip('Prueba cierre de caja testerp - Test Hgi360', async t => {
    await ejecutarPruebaCierreCaja(t, testPosWebConfig);
});
