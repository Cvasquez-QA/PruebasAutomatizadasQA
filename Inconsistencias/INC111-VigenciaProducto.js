import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    mostrarMenu360,
    desmarcarCheckboxSiEsta,
    ingresarAplicacion,
    marcarCheckboxSiNoEsta,
} from '../../Funciones/HelpersHgi360.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const PRODUCTO_VIGENTE_OBLIGATORIO = '10PPE1';
const PRODUCTO_VIGENCIA_EDITABLE = '10PPAL';

const MSG_VIGENTE_OBLIGATORIO = 'No se pudo guardar. El producto debe estar vigente';
const MSG_GUARDADO_OK = 'Registro actualizado con Ã©xito.';

const btnEditarProducto = Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1);
const inputFiltroProductos = Selector('#gridProductos .dx-texteditor-input');

const abrirProductos = async t => {
    await abrirMaestros360(t, 'Productos', 'productos');
};

const filtrarProducto = async (t, codigo) => {
    await t
        .click(inputFiltroProductos)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(inputFiltroProductos, codigo)
        .wait(2000)
        .expect(Selector('#gridProductos td').withText(codigo).exists).ok(
            `No se encontrÃ³ el producto ${codigo} en el grid`
        );
};

const editarProductoFiltrado = async t => {
    await t
        .click(btnEditarProducto)
        .wait(2000);
};

const guardarProducto = async t => {
    await t.click(Selector('#BtnGuardarProducto span').withText('Guardar'));
};

const validarProductoNoPermiteQuitarVigencia = async t => {
    await abrirProductos(t);
    await filtrarProducto(t, PRODUCTO_VIGENTE_OBLIGATORIO);
    await editarProductoFiltrado(t);
    await desmarcarCheckboxSiEsta(t, '#txtMaestroProductos_Vigente');
    await guardarProducto(t);

    await t
        .expect(Selector('.swal2-content div').withText(MSG_VIGENTE_OBLIGATORIO).visible).ok(
            `Se esperaba el mensaje: ${MSG_VIGENTE_OBLIGATORIO}`
        )
        .click(Selector('button').withText('Aceptar'))
        .wait(1000);

    await cerrarPestana360(t);
};

const validarProductoPermiteEditarVigencia = async t => {
    await abrirProductos(t);
    await filtrarProducto(t, PRODUCTO_VIGENCIA_EDITABLE);
    await editarProductoFiltrado(t);
    await desmarcarCheckboxSiEsta(t, '#txtMaestroProductos_Vigente');
    await guardarProducto(t);

    await t
        .expect(
            Selector('[class^="dx-overlay-content dx-toast-success dx-toast-conte"] div')
                .withText(MSG_GUARDADO_OK)
                .visible
        ).ok(`Se esperaba guardar sin vigencia: ${MSG_GUARDADO_OK}`)
        .wait(2000);

    await editarProductoFiltrado(t);
    await marcarCheckboxSiNoEsta(t, '#txtMaestroProductos_Vigente');
    await guardarProducto(t);

    await t
        .expect(
            Selector('[class^="dx-overlay-content dx-toast-success dx-toast-conte"] div')
                .withText(MSG_GUARDADO_OK)
                .visible
        ).ok(`Se esperaba restaurar vigencia: ${MSG_GUARDADO_OK}`)
        .wait(2000);

    await cerrarPestana360(t);
};

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);
    await validarProductoNoPermiteQuitarVigencia(t);
    await t.wait(2000);
    await mostrarMenu360(t);
    await validarProductoPermiteEditarVigencia(t);
    await cerrarSesion360(t);
};

fixture `INC111 Vigencia producto - Test Hgi360 Admin`
    .page(testAdminConfig.pagina);

test('INC111 Vigencia producto - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC111 Vigencia producto - Hgi360 Admin`
    .page(hgi360AdminConfig.pagina);

test('INC111 Vigencia producto - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});
