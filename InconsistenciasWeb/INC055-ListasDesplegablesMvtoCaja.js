import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { hgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC055 - En el Punto de Venta, Retiro parcial: con Enter en la forma de pago la lista no debe quedarse
 * desplegada y el foco debe pasar al siguiente campo. Solo tiene ambiente de producción (hgi360.com).
 */

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirPuntoDeVenta360(t, config.caja);
    await t
        .click(Selector('#BtnPuntoDeVenta_RetiroParcial').filterVisible().with({ timeout: 15000 }))
        .wait(2000)
        .pressKey('enter')
        .wait(1000)
        .expect(Selector('.dx-overlay-content .dx-list').filterVisible().exists).notOk('La lista de forma de pago se quedó desplegada con Enter')
        .expect(Selector('tr.dx-data-row td').nth(1).focused).ok('No se desplazó al segundo campo, por lo que se desplegó o hubo un error con la lista')
        .click(Selector('#BtnCancelarRetiroCajaMov_puntoVenta').filterVisible());
    await salirPuntoDeVenta360(t);
    await cerrarSesion360(t);
}

fixture `Prueba INC055 mipos POS`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC055 validar desplegable en PV con Enter mipos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
