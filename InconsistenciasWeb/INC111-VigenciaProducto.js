import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cancelarMaestro360,
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta
} from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC111 - Vigencia del producto: 10PPE1 no permite quitar la vigencia ("El producto debe estar vigente");
 * 10PPAL sí la permite y se vuelve a marcar al final.
 */

const PRODUCTO_VIGENTE_OBLIGATORIO = '10PPE1';
const PRODUCTO_VIGENCIA_EDITABLE = '10PPAL';
const CHECK_VIGENTE = '#txtMaestroProductos_Vigente';
const MSG_VIGENTE_OBLIGATORIO = /El producto debe estar vigente/;

async function editarProducto(t, codigo) {
    await abrirMaestros360(t, 'Productos', 'productos');
    await buscarEnGrid360(t, 'gridProductos', codigo);
    await t.wait(1500);
    await accionFilaGrid360(t, 'gridProductos', codigo, 'Editar');
    await t.expect(Selector(CHECK_VIGENTE).with({ timeout: 15000 }).exists).ok(`No abrió la edición del producto ${codigo}`);
}

async function validarProductoNoPermiteQuitarVigencia(t) {
    await editarProducto(t, PRODUCTO_VIGENTE_OBLIGATORIO);
    await desmarcarCheckboxSiEsta(t, CHECK_VIGENTE);
    await t.click(Selector('#BtnGuardarProducto_btn, #BtnGuardarProducto').filterVisible().nth(0));
    const aviso = Selector('.swal2-popup, .erp-toast, .erp-form-error__text').filterVisible().withText(MSG_VIGENTE_OBLIGATORIO);
    const avisado = await aviso.with({ timeout: 10000 }).exists;
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.exists) {
        await t.click(confirmar);
    }
    if (!avisado) {
        // Si el ERP lo guardó sin vigencia, se deja como estaba
        await editarProducto(t, PRODUCTO_VIGENTE_OBLIGATORIO);
        await marcarCheckboxSiNoEsta(t, CHECK_VIGENTE);
        await guardarMaestro360(t, 'Producto');
        await cerrarPestana360(t);
    } else {
        await cancelarMaestro360(t, 'Producto');
    }
    await t.expect(avisado).ok(`El producto ${PRODUCTO_VIGENTE_OBLIGATORIO} permitió quitar la vigencia (se esperaba "El producto debe estar vigente")`);
}

async function validarProductoPermiteEditarVigencia(t) {
    await editarProducto(t, PRODUCTO_VIGENCIA_EDITABLE);
    await desmarcarCheckboxSiEsta(t, CHECK_VIGENTE);
    await guardarMaestro360(t, 'Producto');
    await cerrarPestana360(t);
    await editarProducto(t, PRODUCTO_VIGENCIA_EDITABLE);
    await marcarCheckboxSiNoEsta(t, CHECK_VIGENTE);
    await guardarMaestro360(t, 'Producto');
    await cerrarPestana360(t);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await validarProductoNoPermiteQuitarVigencia(t);
    await validarProductoPermiteEditarVigencia(t);
    await cerrarSesion360(t);
}

fixture `INC111 Vigencia producto - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC111 Vigencia producto - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC111 Vigencia producto - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC111 Vigencia producto - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
