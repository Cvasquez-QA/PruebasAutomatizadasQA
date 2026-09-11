import { Selector } from 'testcafe';
import {
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = '141516';
const DESCRIPCION = 'MIDESCRIPCION';
const PRECIO_VENTA = '1000';
const PRECIO_VENTA2 = '2000';
const PRECIO_VENTA3 = '3000';
const PRECIO_VENTA4 = '4000';
const PRECIO_VENTA5 = '5000';
const PRECIO_VENTA6 = '6000';
const PRECIO_VENTA7 = '7000';
const PRECIO_VENTA8 = '8000';
const DESCUENTO1 = '10';
const DESCUENTO2 = '20';
const DESCUENTO3 = '30';
const DESCUENTO4 = '40';
const TARIFA_IMPUESTO_EDIT = '0 - No Impuesto';

async function ejecutarPruebaProductos(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Productos', 'productos');
        await eliminarRegistroSiExiste(t, '#gridProductos', CODIGO);
        await t
            .click(Selector('#gridProductos .dx-icon.dx-icon-add'))
        //Se inicia inserción de producto
            .typeText('#txtStrIdProducto', CODIGO)
            .typeText('#txtProducto_Descripcion .dx-texteditor-input', DESCRIPCION)

            .typeText('#txtMaestroProductos_PrecioVenta .dx-texteditor-input', PRECIO_VENTA)
            .typeText('#txtMaestroProductos_PrecioVenta2 .dx-texteditor-input', PRECIO_VENTA2)
            .typeText('#txtMaestroProductos_PrecioVenta3 .dx-texteditor-input', PRECIO_VENTA3)
            .typeText('#txtMaestroProductos_PrecioVenta4 .dx-texteditor-input', PRECIO_VENTA4)
            .typeText('#txtMaestroProductos_PrecioVenta5 .dx-texteditor-input', PRECIO_VENTA5)
            .typeText('#txtMaestroProductos_PrecioVenta6 .dx-texteditor-input', PRECIO_VENTA6)
            .typeText('#txtMaestroProductos_PrecioVenta7 .dx-texteditor-input', PRECIO_VENTA7)
            .typeText('#txtMaestroProductos_PrecioVenta8 .dx-texteditor-input', PRECIO_VENTA8)

            .typeText('#txtMaestroProductos_Descuento1 .dx-texteditor-input', DESCUENTO1)
            .typeText('#txtMaestroProductos_Descuento2 .dx-texteditor-input', DESCUENTO2)
            .typeText('#txtMaestroProductos_Descuento3 .dx-texteditor-input', DESCUENTO3)
            .typeText('#txtMaestroProductos_Descuento4 .dx-texteditor-input', DESCUENTO4)

            .click('#txtMaestroProductos_Kardex .dx-checkbox-icon')
            .click('#txtMaestroProductos_Movil .dx-checkbox-icon')
            .click('#txtMaestroProductos_Vigente .dx-checkbox-icon')
            .click('#txtMaestroProductos_ManejaLote .dx-checkbox-icon')
            .click('#txtMaestroProductos_ImpPlastico .dx-checkbox-icon')
            .click('#txtMaestroProductos_Excluido .dx-checkbox-icon')

            .click(Selector('#BtnGuardarProducto span').withText('Guardar'))
            .wait(2000);
            await cerrarPestana360(t);
            await abrirMaestros360(t, 'Productos', 'productos');
            await t
            .typeText(Selector('#gridProductos .dx-texteditor-input'), CODIGO)
            .wait(2000)
        //Se valida la creación del producto
            .expect(Selector('td').withText(CODIGO).exists).ok()
        //Se edita el Producto
            .wait(1000)
            .click(Selector('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click(Selector('#txtMaestroProductos_TarifasImpuesto1 div'))
            ;
    await seleccionarOpcion(t, TARIFA_IMPUESTO_EDIT);
    await t
            .click(Selector('#txtMaestroProductos_TarifasImpuesto2 div'))
            ;
    await seleccionarOpcion(t, TARIFA_IMPUESTO_EDIT);
    await t
            .click(Selector('#BtnGuardarProducto div').withText('Guardar'))
            .wait(3000)
            /*
            .click(Selector('a').withText('Maestros'))
            .click(Selector('span').withText('PRODUCTOS'))
            */
        //Se elimina el Producto
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridProductos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_ProductosUX - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Productos testerp - Test Hgi360', async t => {
    await ejecutarPruebaProductos(t, testAdminConfig);
});

fixture `CRUD_ProductosUX - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Productos Hgi360 Admin - Hgi360 Admin', async t => {
    await ejecutarPruebaProductos(t, hgiAdminConfig);
});
