import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = '141516';
const DESCRIPCION = 'MIDESCRIPCION';
const LINEA = '01 - ON PREMISE';
const LINEA_FILTRO = '01';
const GRUPO = '01 - ADMINISTRATIVO';
const CLASE = '01 - SOFTWARE';
const TIPO = '01 - LICENCIAMIENTO';
const UNIDAD = 'Und - Unidad';
const UNIDAD_FILTRO = 'unidad';
const TARIFA_IVA = '1 - EXENTO';
const TARIFA_IVA_FILTRO = '1';
const TARIFA_RTE_FTE = '1 - Compras';
const MONEDA = '01 - PESO';
const MONEDA_FILTRO = '01';
const PROVEEDOR = '811021438 - HGI S.A.S - HGI S.A.S';
const PROVEEDOR_FILTRO = '811021438';
const TARIFA_IMPUESTO1 = '01 - No Aplica';
const TARIFA_IMPUESTO2 = '0 - No Impuesto';
const TARIFA_IMPUESTO_EDIT = '0 - No Impuesto';
const EAN = '!"#$%&';
const CODIGO_ALTERNO = 'CodigoAlterno';
const ORDEN = 'Orden';
const PRECIO_VENTA = '1';
const PRECIO_VENTA2 = '2';
const PRECIO_VENTA3 = '3';
const PRECIO_VENTA4 = '4';
const PRECIO_VENTA5 = '5';
const PRECIO_VENTA6 = '6';
const PRECIO_VENTA7 = '7';
const PRECIO_VENTA8 = '8';
const IMP_CONSUMO = '12';
const PRECIO_COMPRA = '21';
const CAPTURA = '0 - Cantidad';
const AIU = '1 - AIU';
const DESCUENTO1 = '10';
const DESCUENTO2 = '20';
const DESCUENTO3 = '30';
const DESCUENTO4 = '40';
const PESO = '50';

fixture `Prueba Productos testERP ADMIN - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Productos testerp - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirMaestros360(t, 'Productos', 'productos');
    await eliminarRegistroSiExiste(t, '#gridProductos', CODIGO);
    await t
        .click(Selector('#gridProductos .dx-icon.dx-icon-add'))
    //Se inicia inserción de producto
        .typeText('#txtStrIdProducto', CODIGO)
        .typeText('#txtProducto_Descripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#txtProductos_StrLinea div').withText('GENERAL').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, LINEA);
    await t
        .click(Selector('#txtProductos_StrGrupo div').withText('GENERAL').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, GRUPO);
    await t
        .click(Selector('#txtMaestroProductos_Clase div'));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, CLASE);
    await t
        .click(Selector('#txtMaestroProductos_Tipo div').withText('GENERAL').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TIPO);
    await t
        .click(Selector('#txtMaestroProductos_Unidad div').withText('Unidad').nth(1));

        await filtrarPor(t, UNIDAD_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, UNIDAD);
    await t
        .click(Selector('#txtMaestroProductos_UnidadCompra div').withText('Unidad').nth(1));

        await filtrarPor(t, UNIDAD_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, UNIDAD);
    await t
        .click(Selector('#txtMaestroProductos_TarifaIva div').withText('EXCLUIDA').nth(1));

        await filtrarPor(t, TARIFA_IVA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TARIFA_IVA);
    await t
        .click(Selector('#txtMaestroProductos_TarifasRteFte div').withText('sin retencion').nth(1));

        await filtrarPor(t, TARIFA_IVA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TARIFA_RTE_FTE);
    await t
        .click(Selector('#txtMaestroProductos_Moneda div').withText('No Moneda').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, MONEDA);
    await t
        .click(Selector('#txtMaestroProductos_Proveedor div').withText('General General').nth(1));

        await filtrarPor(t, PROVEEDOR_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, PROVEEDOR);

        .click(Selector('#txtMaestroProductos_TarifasImpuesto1 div').withText('No Impuesto').nth(1))
        ;
    await seleccionarOpcion(t, TARIFA_IMPUESTO1);
        await seleccionarOpcion(t, TARIFA_IMPUESTO2);
    await t
        .typeText('#txtMaestroProductos_EAN .dx-texteditor-input', EAN)
        .typeText('#txtMaestroProductos_CodigoAlterno .dx-texteditor-input', CODIGO_ALTERNO)
        .typeText('#txtMaestroProductos_Orden .dx-texteditor-input' , ORDEN)

        .typeText('#txtMaestroProductos_PrecioVenta .dx-texteditor-input', PRECIO_VENTA)
        .typeText('#txtMaestroProductos_PrecioVenta2 .dx-texteditor-input', PRECIO_VENTA2)
        .typeText('#txtMaestroProductos_PrecioVenta3 .dx-texteditor-input', PRECIO_VENTA3)
        .typeText('#txtMaestroProductos_PrecioVenta4 .dx-texteditor-input', PRECIO_VENTA4)
        .typeText('#txtMaestroProductos_PrecioVenta5 .dx-texteditor-input', PRECIO_VENTA5)
        .typeText('#txtMaestroProductos_PrecioVenta6 .dx-texteditor-input', PRECIO_VENTA6)
        .typeText('#txtMaestroProductos_PrecioVenta7 .dx-texteditor-input', PRECIO_VENTA7)
        .typeText('#txtMaestroProductos_PrecioVenta8 .dx-texteditor-input', PRECIO_VENTA8)

        .typeText('#txtMaestroProductos_ImpConsumo .dx-texteditor-input', IMP_CONSUMO)
        .typeText('#txtMaestroProductos_PrecioCompra .dx-texteditor-input', PRECIO_COMPRA)
        .click(Selector('#txtMaestroProductos_Captura div').withText('Cantidad').nth(1))
        ;
    await seleccionarOpcion(t, CAPTURA);
    await t
        .click(Selector('#txtMaestroProductos_AIU div').withText('Ninguno').nth(1))
        ;
    await seleccionarOpcion(t, AIU);

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

        .click('#Tab_Maestro_Productos_Presentacion_link')
        .wait(2000)
        .typeText('#txtProductos_IntPeso .dx-texteditor-input', PESO)

        .click(Selector('#BtnGuardarProductospan').withText('Guardar'))
        .wait(2000);
    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .wait(4000)
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
        .typeText('#gridProductos .dx-texteditor-input', CODIGO)
        .wait(2000);
    await eliminarRegistroDesdeGrid(t, '#gridProductos');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Productos testERP ADMIN - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Productos testerp - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirMaestros360(t, 'Productos', 'productos');
    await eliminarRegistroSiExiste(t, '#gridProductos', CODIGO);
    await t
        .click(Selector('#gridProductos .dx-icon.dx-icon-add'))
    //Se inicia inserción de producto
        .typeText('#txtStrIdProducto', CODIGO)
        .typeText('#txtProducto_Descripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#txtProductos_StrLinea div').withText('GENERAL').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, LINEA);
    await t
        .click(Selector('#txtProductos_StrGrupo div').withText('GENERAL').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, GRUPO);
    await t
        .click(Selector('#txtMaestroProductos_Clase div'));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, CLASE);
    await t
        .click(Selector('#txtMaestroProductos_Tipo div').withText('GENERAL').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TIPO);
    await t
        .click(Selector('#txtMaestroProductos_Unidad div').withText('Unidad').nth(1));

        await filtrarPor(t, UNIDAD_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, UNIDAD);
    await t
        .click(Selector('#txtMaestroProductos_UnidadCompra div').withText('Unidad').nth(1));

        await filtrarPor(t, UNIDAD_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, UNIDAD);
    await t
        .click(Selector('#txtMaestroProductos_TarifaIva div').withText('EXCLUIDA').nth(1));

        await filtrarPor(t, TARIFA_IVA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TARIFA_IVA);
    await t
        .click(Selector('#txtMaestroProductos_TarifasRteFte div').withText('sin retencion').nth(1));

        await filtrarPor(t, TARIFA_IVA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, TARIFA_RTE_FTE);
    await t
        .click(Selector('#txtMaestroProductos_Moneda div').withText('No Moneda').nth(1));

        await filtrarPor(t, LINEA_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, MONEDA);
    await t
        .click(Selector('#txtMaestroProductos_Proveedor div').withText('General General').nth(1));

        await filtrarPor(t, PROVEEDOR_FILTRO);
        await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, PROVEEDOR);

        .click(Selector('#txtMaestroProductos_TarifasImpuesto1 div').withText('No Impuesto').nth(1))
        ;
    await seleccionarOpcion(t, TARIFA_IMPUESTO1);
        await seleccionarOpcion(t, TARIFA_IMPUESTO2);
    await t
        .typeText('#txtMaestroProductos_EAN .dx-texteditor-input', EAN)
        .typeText('#txtMaestroProductos_CodigoAlterno .dx-texteditor-input', CODIGO_ALTERNO)
        .typeText('#txtMaestroProductos_Orden .dx-texteditor-input' , ORDEN)

        .typeText('#txtMaestroProductos_PrecioVenta .dx-texteditor-input', PRECIO_VENTA)
        .typeText('#txtMaestroProductos_PrecioVenta2 .dx-texteditor-input', PRECIO_VENTA2)
        .typeText('#txtMaestroProductos_PrecioVenta3 .dx-texteditor-input', PRECIO_VENTA3)
        .typeText('#txtMaestroProductos_PrecioVenta4 .dx-texteditor-input', PRECIO_VENTA4)
        .typeText('#txtMaestroProductos_PrecioVenta5 .dx-texteditor-input', PRECIO_VENTA5)
        .typeText('#txtMaestroProductos_PrecioVenta6 .dx-texteditor-input', PRECIO_VENTA6)
        .typeText('#txtMaestroProductos_PrecioVenta7 .dx-texteditor-input', PRECIO_VENTA7)
        .typeText('#txtMaestroProductos_PrecioVenta8 .dx-texteditor-input', PRECIO_VENTA8)

        .typeText('#txtMaestroProductos_ImpConsumo .dx-texteditor-input', IMP_CONSUMO)
        .typeText('#txtMaestroProductos_PrecioCompra .dx-texteditor-input', PRECIO_COMPRA)
        .click(Selector('#txtMaestroProductos_Captura div').withText('Cantidad').nth(1))
        ;
    await seleccionarOpcion(t, CAPTURA);
    await t
        .click(Selector('#txtMaestroProductos_AIU div').withText('Ninguno').nth(1))
        ;
    await seleccionarOpcion(t, AIU);

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

        .click('#Tab_Maestro_Productos_Presentacion_link')
        .wait(2000)
        .typeText('#txtProductos_IntPeso .dx-texteditor-input', PESO)

        .click(Selector('#BtnGuardarProductospan').withText('Guardar'))
        .wait(2000);
    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .wait(4000)
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
        .typeText('#gridProductos .dx-texteditor-input', CODIGO)
        .wait(2000);
    await eliminarRegistroDesdeGrid(t, '#gridProductos');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
