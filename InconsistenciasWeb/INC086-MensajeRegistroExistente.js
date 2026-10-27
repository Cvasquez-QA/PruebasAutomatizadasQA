import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC086 - Al crear un tercero o un producto con un código que ya existe, el ERP avisa al salir del campo:
 * "Ya existe un tercero con la identificación" / "Ya existe un producto con el código". No se guarda nada.
 */

const aviso = texto => Selector('.erp-toast, .swal2-popup, .erp-form-error__text').filterVisible().withText(texto);

async function cancelar(t, maestro) {
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    const btn = Selector(`[id^="BtnCancelar${maestro}"]`).filterVisible();
    if (await btn.exists) {
        await t.click(btn.nth(0));
    }
    await cerrarPestana360(t);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);

    await abrirMaestros360(t, 'Terceros', 'terceros');
    await nuevoRegistroGrid360(t, 'gridTerceros');
    const idTercero = Selector('#txtTercero_Id .dx-texteditor-input');
    await t
        .typeText(idTercero.with({ timeout: 15000 }), '0', { replace: true })
        .pressKey('enter')
        .pressKey('tab');
    const avisoTercero = await aviso(/Ya existe un tercero con la identificaci[oó]n/i).with({ timeout: 10000 }).exists;
    await cancelar(t, 'Tercero');

    await abrirMaestros360(t, 'Productos', 'productos');
    await nuevoRegistroGrid360(t, 'gridProductos');
    const idProducto = Selector('#txtIdProducto .dx-texteditor-input, #txtStrIdProducto, #txtProducto_StrIdProducto .dx-texteditor-input').filterVisible();
    await t
        .expect(idProducto.with({ timeout: 15000 }).exists).ok('No se encontró el campo Código del producto')
        .typeText(idProducto.nth(0), '01', { replace: true })
        .pressKey('enter')
        .pressKey('tab');
    const avisoProducto = await aviso(/Ya existe un producto con el c[oó]digo/i).with({ timeout: 10000 }).exists;
    await cancelar(t, 'Producto');

    const faltantes = [
        avisoTercero ? '' : '"Ya existe un tercero con la identificación" con el tercero 0',
        avisoProducto ? '' : '"Ya existe un producto con el código" con el producto 01'
    ].filter(Boolean);
    await t.expect(faltantes.join('; ')).eql('', `No salió: ${faltantes.join('; ')}`);
    await cerrarSesion360(t);
}

fixture `Prueba Mensaje registro ya existe Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Mensaje registro ya existe Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
