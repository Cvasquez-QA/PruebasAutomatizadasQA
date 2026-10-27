import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    cargarDocumento360,
    eliminarDocumentoSiExiste360,
    elegirTransaccionDocumento,
    esperarTotalDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC088 - Igual que INC087 pero escribiendo el número del pedido en el campo Pedido de la factura antes de
 * descargarlo: sin gestión avisa "El Pedido aún no ha sido gestionado"; gestionado, la factura queda con total.
 * La factura y el pedido se eliminan.
 */

const PEDIDO = ['087P', /^\s*(INC)?087P -/i];
const FACTURA = ['087F', /^\s*(INC)?087F -/i];
const confirmar = Selector('button.swal2-confirm').filterVisible();

async function descargarPedido(t, numero) {
    const campoPedido = Selector('#Documento_Pedido .dx-texteditor-input');
    if (await campoPedido.exists && !await campoPedido.hasAttribute('disabled')) {
        await t.typeText(campoPedido, String(numero), { replace: true }).pressKey('enter').wait(1500);
    }
    const fila = Selector('[data-testid="gridPedidos_documentos"] tr.dx-data-row td').filterVisible().withExactText(String(numero)).parent('tr');
    const buscar = Selector('.dx-overlay-content').filterVisible().find('input[placeholder="Buscar..."], .dx-datagrid-search-panel input.dx-texteditor-input');
    await t
        .click('#Documento_Descargar_Pedido')
        .click(Selector('.dx-overlay-content .dx-list-item').filterVisible().withText('Cargar un solo Pedido'));
    if (await buscar.with({ timeout: 10000 }).exists) {
        await t.typeText(buscar.nth(0), String(numero), { replace: true }).wait(2000);
    }
    await t
        .expect(fila.with({ timeout: 15000 }).exists).ok(`No aparece el pedido ${numero} para descargar`)
        .click(fila.find('.dx-checkbox, .dx-select-checkbox').nth(0))
        .click('#btnCargarPedidos_documentos_btn')
        .wait(2000);
    const aviso = Selector('.swal2-popup, .erp-toast').filterVisible();
    let texto = '';
    if (await aviso.with({ timeout: 8000 }).exists) {
        texto = (await aviso.nth(0).innerText).replace(/\s+/g, ' ').trim();
    }
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    return texto;
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, PEDIDO[0], PEDIDO[1]);
    const pedido = await guardarDocumento360(t);
    let factura = null;
    try {
        await agregarLineaDocumento(t, '010203', { cantidad: 1, valor: 100 });

        await nuevoDocumento360(t, FACTURA[0], FACTURA[1], { abrir: false });
        factura = await guardarDocumento360(t);
        const sinGestion = await descargarPedido(t, pedido);
        await t.expect(sinGestion).match(/El Pedido a[uú]n no ha sido gestionado/i,
            `Sin gestionar, la descarga del pedido no avisó "El Pedido aún no ha sido gestionado" (aviso: "${sinGestion}")`);

        await elegirTransaccionDocumento(t, PEDIDO[0], PEDIDO[1]);
        await cargarDocumento360(t, pedido);
        await t
            .click(Selector('#BtnGestionPedidoDocumento_btn, #BtnGestionPedidoDocumento').filterVisible().nth(0))
            .expect(Selector('.erp-toast, .swal2-popup').filterVisible().withText(/El pedido ha sido gestionado/i).with({ timeout: 15000 }).exists)
            .ok('No salió "El pedido ha sido gestionado."');
        if (await confirmar.exists) {
            await t.click(confirmar);
        }

        await elegirTransaccionDocumento(t, FACTURA[0], FACTURA[1]);
        await cargarDocumento360(t, factura);
        const conGestion = await descargarPedido(t, pedido);
        await esperarTotalDocumento(t, total => total !== 0, `Después de gestionar, el pedido no se descargó en la factura (aviso: "${conGestion}")`);
    } finally {
        if (await confirmar.exists) {
            await t.click(confirmar);
        }
        if (factura) {
            await eliminarDocumentoSiExiste360(t, FACTURA[0], FACTURA[1], factura);
        }
        await eliminarDocumentoSiExiste360(t, PEDIDO[0], PEDIDO[1], pedido);
    }
    await cerrarSesion360(t);
}

fixture `Prueba Gestion Pedidos INC088 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Gestion Pedidos INC088 Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
