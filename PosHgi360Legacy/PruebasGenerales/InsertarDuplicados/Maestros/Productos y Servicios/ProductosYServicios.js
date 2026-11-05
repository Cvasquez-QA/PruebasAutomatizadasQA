import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_CERO = '0';
const DESCRIPCION_CLASE = 'MiDescripcionClase';
const TIPO_PRODUCTOS = '2 - Productos';
const DESCRIPCION_GRUPO = 'MiDescripciónGrupo';
const DESCRIPCION_LINEA = 'MiDescripciónLinea';
const UVT = '5000';
const DESCRIPCION_TIPO = 'MiDescripcionTipo';
const DESCRIPCION_PRODUCTO = 'MIDESCRIPCION';
const PRECIO_VENTA_1 = '1';
const PRECIO_VENTA_2 = '2';
const PRECIO_VENTA_3 = '3';
const PRECIO_VENTA_4 = '4';
const PRECIO_VENTA_5 = '5';
const PRECIO_VENTA_6 = '6';
const PRECIO_VENTA_7 = '7';
const PRECIO_VENTA_8 = '8';
const IMP_CONSUMO = '12';
const PRECIO_COMPRA = '21';
const AIU = 'Imprevistos';

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inserción Duplicados - PRODUCTOS Y SERVICIOS - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
        ///PRUEBA CLASES
        //Se ingresa al maestro de Clases

        await abrirMaestros360(t, 'Clases', 'productos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#gridClases .dx-icon.dx-icon-add')
        //Se procede a crear la Clase
        .typeText(Selector('#txtStrIdClase .dx-texteditor-input'), CODIGO_CERO)
        .wait(100)
        .click('#txtClase_Descripcion .dx-texteditor-input')
        .typeText('#txtClase_Descripcion .dx-texteditor-input', DESCRIPCION_CLASE)
        //.click(Selector('#txtClases_StrConcepto .dx-lookup-field'))
        //El sistema permite la creación de una clase sin tener un concepto asociado
        .click(Selector('#txtClases_IntTipo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_PRODUCTOS);
    await t
        .click(Selector('#BtnActualizarClases span').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA GRUPOS
 ///Se ingresa al maestro de Grupos

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Grupos', 'productos');
    //Se procede a crear el Grupo
        await t
        .click('#gridGrupos .dx-icon.dx-icon-add')
        .typeText('#txtStrIdGrupo', CODIGO_CERO)
        .wait(100)
        //El sistema permite cualquier caracter para el còdigo del grupo
        .typeText('#txtGrupo_Descripcion .dx-texteditor-input', DESCRIPCION_GRUPO)
        .click(Selector('#BtnGuardarGrupos div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA LINEAS
     //Se ingresa al maestro de líneas

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Lineas', 'productos');
    //Se procede a crear la línea
        await t
        .click('#gridLineas .dx-icon.dx-icon-add')
        .typeText('#txtStrIdLinea', CODIGO_CERO)
        .wait(100)
        //El sistema permite cualquier caracter para el còdigo de la lìnea
        .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION_LINEA)
        .typeText('#txtLineas_UVT .dx-texteditor-input', UVT)
        //El sistema permite escribir %&E/ Pero a la hora de guardar se borra el campo, sólo permite números
        .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TIPOS
   //Se ingresa al maestro de Tipos

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tipos', 'productos');
    await t
        .click('#gridTipos .dx-icon.dx-icon-add')
    //Se procede a crear el Tipo
        .typeText('#txtStrIdTipo', CODIGO_CERO)
        .wait(100)
        .typeText('#txtTipo_Descripcion .dx-texteditor-input', DESCRIPCION_TIPO)
        .click(Selector('#BtnGuardarTipo span').withText('Guardar'))
        //.click(Selector('#txtMaestroTipo_Concepto .dx-lookup-field'))
        //El sistema permite la creación de un Tipo sin tener un concepto asociado
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA PRODUCTOS
        //Se ingresa al maestro de productos

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .click(Selector('#gridProductos .dx-icon.dx-icon-add'))
    //Se inicia inserción de producto
        .typeText('#txtStrIdProducto', CODIGO_CERO)
        .wait(100)
        .typeText('#txtProducto_Descripcion .dx-texteditor-input', DESCRIPCION_PRODUCTO)
        /*
        .click(Selector('#txtProductos_StrLinea div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '01 - LINEA');
    await t
        .click(Selector('#txtProductos_StrGrupo div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '01 - GRUPOS');
    await t
        .click(Selector('#txtMaestroProductos_Clase div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '01 - PRODUCTOS GRAVADOS');
    await t
        .click(Selector('#txtMaestroProductos_Tipo div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '0 - GENERAL');
    await t
        .click(Selector('#txtMaestroProductos_Unidad div').withText('Unidad').nth(1))
        ;
    await seleccionarOpcion(t, 'Und - Unidad');
    await t
        .click(Selector('#txtMaestroProductos_UnidadCompra div').withText('Unidad').nth(1))
        ;
    await seleccionarOpcion(t, '0 - GENERAL');
    await t
        .click(Selector('#txtMaestroProductos_TarifaIva div').withText('Sin Iva').nth(1))
        ;
    await seleccionarOpcion(t, '0 - Sin Iva');
    await t
        .click(Selector('#txtMaestroProductos_TarifasRteFte div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '0 - GENERAL');
    await t
        .click(Selector('#txtMaestroProductos_TarifasImpuesto1 div').withText('No Impuesto').nth(1))
        ;
    await seleccionarOpcion(t, '0 - No Impuesto');
    await t
        .click(Selector('#txtMaestroProductos_TarifasImpuesto2 div').withText('No Impuesto').nth(1))
        ;
    await seleccionarOpcion(t, '1 - Impuesto al consumo');
    await t
        .typeText('#txtMaestroProductos_EAN .dx-texteditor-input', '!"#$%&')
        .click('#txtMaestroProductos_CodigoAlterno .dx-texteditor-input')
        .click('#txtMaestroProductos_Orden .dx-texteditor-input')
        */
        .typeText('#txtMaestroProductos_PrecioVenta .dx-texteditor-input', PRECIO_VENTA_1)
        .typeText('#txtMaestroProductos_PrecioVenta2 .dx-texteditor-input', PRECIO_VENTA_2)
        .typeText('#txtMaestroProductos_PrecioVenta3 .dx-texteditor-input', PRECIO_VENTA_3)
        .typeText('#txtMaestroProductos_PrecioVenta4 .dx-texteditor-input', PRECIO_VENTA_4)
        .typeText('#txtMaestroProductos_PrecioVenta5 .dx-texteditor-input', PRECIO_VENTA_5)
        .typeText('#txtMaestroProductos_PrecioVenta6 .dx-texteditor-input', PRECIO_VENTA_6)
        .typeText('#txtMaestroProductos_PrecioVenta7 .dx-texteditor-input', PRECIO_VENTA_7)
        .typeText('#txtMaestroProductos_PrecioVenta8 .dx-texteditor-input', PRECIO_VENTA_8)
        .typeText('#txtMaestroProductos_ImpConsumo .dx-texteditor-input', IMP_CONSUMO)
        .typeText('#txtMaestroProductos_PrecioCompra .dx-texteditor-input', PRECIO_COMPRA)
        .click(Selector('#txtMaestroProductos_AIU div').withText('Ninguno').nth(1))
        ;
    await seleccionarOpcion(t, AIU);
    await t
        .click('#txtMaestroProductos_Vigente .dx-checkbox-icon')
        .click(Selector('#BtnGuardarProducto span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Duplicados Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inserción Duplicados - PRODUCTOS Y SERVICIOS - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
        ///PRUEBA CLASES
        //Se ingresa al maestro de Clases

        await abrirMaestros360(t, 'Clases', 'productos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#gridClases .dx-icon.dx-icon-add')
        //Se procede a crear la Clase
        .typeText(Selector('#txtStrIdClase .dx-texteditor-input'), CODIGO_CERO)
        .wait(100)
        .click('#txtClase_Descripcion .dx-texteditor-input')
        .typeText('#txtClase_Descripcion .dx-texteditor-input', DESCRIPCION_CLASE)
        //.click(Selector('#txtClases_StrConcepto .dx-lookup-field'))
        //El sistema permite la creación de una clase sin tener un concepto asociado
        .click(Selector('#txtClases_IntTipo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_PRODUCTOS);
    await t
        .click(Selector('#BtnActualizarClases span').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA GRUPOS
 ///Se ingresa al maestro de Grupos

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Grupos', 'productos');
    //Se procede a crear el Grupo
        await t
        .click('#gridGrupos .dx-icon.dx-icon-add')
        .typeText('#txtStrIdGrupo', CODIGO_CERO)
        .wait(100)
        //El sistema permite cualquier caracter para el còdigo del grupo
        .typeText('#txtGrupo_Descripcion .dx-texteditor-input', DESCRIPCION_GRUPO)
        .click(Selector('#BtnGuardarGrupos div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA LINEAS
     //Se ingresa al maestro de líneas

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Lineas', 'productos');
    //Se procede a crear la línea
        await t
        .click('#gridLineas .dx-icon.dx-icon-add')
        .typeText('#txtStrIdLinea', CODIGO_CERO)
        .wait(100)
        //El sistema permite cualquier caracter para el còdigo de la lìnea
        .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION_LINEA)
        .typeText('#txtLineas_UVT .dx-texteditor-input', UVT)
        //El sistema permite escribir %&E/ Pero a la hora de guardar se borra el campo, sólo permite números
        .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TIPOS
   //Se ingresa al maestro de Tipos

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tipos', 'productos');
    await t
        .click('#gridTipos .dx-icon.dx-icon-add')
    //Se procede a crear el Tipo
        .typeText('#txtStrIdTipo', CODIGO_CERO)
        .wait(100)
        .typeText('#txtTipo_Descripcion .dx-texteditor-input', DESCRIPCION_TIPO)
        .click(Selector('#BtnGuardarTipo span').withText('Guardar'))
        //.click(Selector('#txtMaestroTipo_Concepto .dx-lookup-field'))
        //El sistema permite la creación de un Tipo sin tener un concepto asociado
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA PRODUCTOS
        //Se ingresa al maestro de productos

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .click(Selector('#gridProductos .dx-icon.dx-icon-add'))
    //Se inicia inserción de producto
        .typeText('#txtStrIdProducto', CODIGO_CERO)
        .wait(100)
        .typeText('#txtProducto_Descripcion .dx-texteditor-input', DESCRIPCION_PRODUCTO)
        /*
        .click(Selector('#txtProductos_StrLinea div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '01 - LINEA');
    await t
        .click(Selector('#txtProductos_StrGrupo div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '01 - GRUPOS');
    await t
        .click(Selector('#txtMaestroProductos_Clase div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '01 - PRODUCTOS GRAVADOS');
    await t
        .click(Selector('#txtMaestroProductos_Tipo div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '0 - GENERAL');
    await t
        .click(Selector('#txtMaestroProductos_Unidad div').withText('Unidad').nth(1))
        ;
    await seleccionarOpcion(t, 'Und - Unidad');
    await t
        .click(Selector('#txtMaestroProductos_UnidadCompra div').withText('Unidad').nth(1))
        ;
    await seleccionarOpcion(t, '0 - GENERAL');
    await t
        .click(Selector('#txtMaestroProductos_TarifaIva div').withText('Sin Iva').nth(1))
        ;
    await seleccionarOpcion(t, '0 - Sin Iva');
    await t
        .click(Selector('#txtMaestroProductos_TarifasRteFte div').withText('GENERAL').nth(1))
        ;
    await seleccionarOpcion(t, '0 - GENERAL');
    await t
        .click(Selector('#txtMaestroProductos_TarifasImpuesto1 div').withText('No Impuesto').nth(1))
        ;
    await seleccionarOpcion(t, '0 - No Impuesto');
    await t
        .click(Selector('#txtMaestroProductos_TarifasImpuesto2 div').withText('No Impuesto').nth(1))
        ;
    await seleccionarOpcion(t, '1 - Impuesto al consumo');
    await t
        .typeText('#txtMaestroProductos_EAN .dx-texteditor-input', '!"#$%&')
        .click('#txtMaestroProductos_CodigoAlterno .dx-texteditor-input')
        .click('#txtMaestroProductos_Orden .dx-texteditor-input')
        */
        .typeText('#txtMaestroProductos_PrecioVenta .dx-texteditor-input', PRECIO_VENTA_1)
        .typeText('#txtMaestroProductos_PrecioVenta2 .dx-texteditor-input', PRECIO_VENTA_2)
        .typeText('#txtMaestroProductos_PrecioVenta3 .dx-texteditor-input', PRECIO_VENTA_3)
        .typeText('#txtMaestroProductos_PrecioVenta4 .dx-texteditor-input', PRECIO_VENTA_4)
        .typeText('#txtMaestroProductos_PrecioVenta5 .dx-texteditor-input', PRECIO_VENTA_5)
        .typeText('#txtMaestroProductos_PrecioVenta6 .dx-texteditor-input', PRECIO_VENTA_6)
        .typeText('#txtMaestroProductos_PrecioVenta7 .dx-texteditor-input', PRECIO_VENTA_7)
        .typeText('#txtMaestroProductos_PrecioVenta8 .dx-texteditor-input', PRECIO_VENTA_8)
        .typeText('#txtMaestroProductos_ImpConsumo .dx-texteditor-input', IMP_CONSUMO)
        .typeText('#txtMaestroProductos_PrecioCompra .dx-texteditor-input', PRECIO_COMPRA)
        .click(Selector('#txtMaestroProductos_AIU div').withText('Ninguno').nth(1))
        ;
    await seleccionarOpcion(t, AIU);
    await t
        .click('#txtMaestroProductos_Vigente .dx-checkbox-icon')
        .click(Selector('#BtnGuardarProducto span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
