import { ClientFunction, Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { abrirPuntoDeVenta360, agregarProductoPV, elegirTransaccionPV, limpiarTemporalPV, salirPuntoDeVenta360 } from '../Funciones/HelpersPos360.js';
import { hgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC042 - Con varias líneas en el Punto de Venta, el grid de productos debe mostrar la barra de
 * desplazamiento vertical. Solo tiene ambiente de producción (hgi360.com); en test se valida con INC043/INC044.
 */

const medirGridProductosPV = ClientFunction(() => {
    const grid = document.querySelector('#PuntoDeVenta_GridProductosConsulta');
    if (!grid) {
        return null;
    }
    const contenedor = grid.querySelector('.dx-datagrid-rowsview .dx-scrollable-container') || grid.querySelector('.dx-scrollable-container');
    const barra = grid.querySelector('.dx-datagrid-rowsview .dx-scrollable-scroll') || grid.querySelector('.dx-scrollable-scroll');
    return {
        contenido: contenedor ? contenedor.scrollHeight : 0,
        visible: contenedor ? contenedor.clientHeight : 0,
        barraOculta: barra ? barra.classList.contains('dx-state-invisible') || getComputedStyle(barra).display === 'none' : true,
        filas: grid.querySelectorAll('tr.dx-data-row').length
    };
});

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirPuntoDeVenta360(t, config.caja);
    await elegirTransaccionPV(t, '01PV', '01PV - PRUEBA FACTURA PVQA');
    await limpiarTemporalPV(t);

    try {
        for (let i = 0; i < 4; i++) {
            await agregarProductoPV(t, '01', '1');
        }
        const salirPantallaCompleta = Selector('#PuntoDeVenta_BtnSalirFullPantalla').filterVisible();
        if (await salirPantallaCompleta.exists) {
            await t.click(salirPantallaCompleta).wait(2000);
        }
        const medida = await medirGridProductosPV();
        await t
            .expect(medida).ok('No se encontró el grid de productos del Punto de Venta')
            .expect(medida.contenido > medida.visible && !medida.barraOculta)
            .ok(`No se encontró la barra de desplazamiento vertical (filas: ${medida.filas})`);
    } finally {
        await limpiarTemporalPV(t);
        await salirPuntoDeVenta360(t);
    }
    await cerrarSesion360(t);
}

fixture `Prueba INC042 mipos POS`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC042 validar barra desplazamiento detalles PV mipos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
