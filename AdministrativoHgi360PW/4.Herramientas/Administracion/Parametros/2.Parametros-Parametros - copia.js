import { test, expect } from '@playwright/test';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    escribir
} from '../../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../../ParametrosPruebas/ParametrosPruebas.js';

// Terceros - datos de entrada (compartidos con 2.Parametros-Parametros.js)

const TERCERO_DATO_0 = '0';
const TERCERO_DATO_1 = '1';
const TERCERO_DATO_2 = '2';
const TERCERO_DATO_3 = '3';
const TERCERO_DATO_4 = '4';
const TERCERO_DATO_5 = '5';
const TERCERO_DATO_6 = '6';
const TERCERO_DATO_7 = '7';
const TERCERO_DATO_N1 = 'n1';
const TERCERO_DATO_N2 = 'n2';
const TERCERO_CONTACTO_8 = '8';
const TERCERO_CONTACTO_9 = '9';
const TERCERO_CONTACTO_10 = '10';
const TERCERO_CONTACTO_11 = '11';
const TERCERO_CONTACTO_12 = '12';
const NINGUNO = 'Ninguno';
const PRECIO_2 = 'Precio 2';
const PRECIO_1 = 'Precio 1';
const COSTO = 'Costo';
const DATO_1 = 'Dato1';
// Validaci�n - terceros (valores por defecto del sistema)
const TERCERO_DATO_0_ESPERADO = 'Base Datos0';
const TERCERO_DATO_1_ESPERADO = 'Nom Ccial.1';
const TERCERO_DATO_2_ESPERADO = 'Cedula2';
const TERCERO_DATO_3_ESPERADO = 'Tel Cont3';
const TERCERO_DATO_4_ESPERADO = 'Tel Ccial4';
const TERCERO_DATO_5_ESPERADO = 'E Mail Cont5';
const TERCERO_DATO_6_ESPERADO = 'E Mail Ccial6';
const TERCERO_DATO_7_ESPERADO = 'Fuente7';
const TERCERO_DATO_N1_ESPERADO = 'N1n1';
const TERCERO_DATO_N2_ESPERADO = 'N2n2';
const TERCERO_ANCHO_0_ESPERADO = '1500';
const TERCERO_ANCHO_1_ESPERADO = '1501';
const TERCERO_ANCHO_2_ESPERADO = '1502';
const TERCERO_ANCHO_3_ESPERADO = '1503';
const TERCERO_ANCHO_4_ESPERADO = '1504';
const TERCERO_ANCHO_5_ESPERADO = '1505';
const TERCERO_ANCHO_6_ESPERADO = '1506';
const TERCERO_ANCHO_7_ESPERADO = '1507';
const TERCERO_ANCHO_N1_ESPERADO = '1';
const TERCERO_ANCHO_N2_ESPERADO = '2';
const TERCERO_CONTACTO_1_ESPERADO = 'D. Proyecto8';
const TERCERO_CONTACTO_2_ESPERADO = 'Contador9';
const TERCERO_CONTACTO_3_ESPERADO = 'Tecnico 310';
const TERCERO_CONTACTO_4_ESPERADO = 'Tecnico 411';
const TERCERO_CONTACTO_5_ESPERADO = 'Tecnico 512';
const TERCERO_PARAM_1_ESPERADO = 'ParametroTerc11';
const TERCERO_PARAM_2_ESPERADO = 'ParametroTerc22';
const TERCERO_PARAM_3_ESPERADO = 'ParametroTerc33';
const TERCERO_PARAM_4_ESPERADO = 'ParametroTerc44';
const TERCERO_PARAM_5_ESPERADO = 'ParametroTerc55';
// Validaci�n - productos
const PRODUCTO_DATO_1_ESPERADO = 'Proveedores1';
const PRODUCTO_DATO_2_ESPERADO = 'Marca2';
const PRODUCTO_DATO_3_ESPERADO = 'Tesis3';
const PRODUCTO_DATO_4_ESPERADO = '4';
const PRODUCTO_DATO_5_ESPERADO = '5';
const PRODUCTO_DATO_6_ESPERADO = '6';
const PRODUCTO_DATO_7_ESPERADO = '7';
const PRODUCTO_DATO_8_ESPERADO = '8';
const PRODUCTO_DATO_9_ESPERADO = '9';
const PRODUCTO_ANCHO_1_ESPERADO = '1501';
const PRODUCTO_ANCHO_2_ESPERADO = '1502';
const PRODUCTO_ANCHO_3_ESPERADO = '1503';
const PRODUCTO_ANCHO_4_ESPERADO = '4';
const PRODUCTO_ANCHO_5_ESPERADO = '5';
const PRODUCTO_ANCHO_6_ESPERADO = '6';
const PRODUCTO_ANCHO_7_ESPERADO = '7';
const PRODUCTO_ANCHO_8_ESPERADO = '8';
const PRODUCTO_ANCHO_9_ESPERADO = '9';
const DOC_PARAM_1_ESPERADO = 'ParametroDoc11';
const PRODUCTO_PARAM_1_ESPERADO = 'ParametroProd11';
const PRODUCTO_PARAM_2_ESPERADO = 'ParametroProd22';
const PRODUCTO_PARAM_3_ESPERADO = 'ParametroProd33';
const PRODUCTO_PARAM_4_ESPERADO = 'ParametroProd44';
const PRODUCTO_PARAM_5_ESPERADO = 'ParametroProd55';
const PRODUCTO_PARAM_6_ESPERADO = 'ParametroProd66';

async function ejecutarPrueba2ParametrosParametroscopia(page, config) {
    await ingresarAplicacion(page, config);
        await abrirHerramientas360(page, 'Parámetros');
        const frame = page.frameLocator('iframe[id^="iframe_tab_"]');
        await page.waitForTimeout(1500);
        await page.waitForTimeout(3000);
        await frame.locator('#tabs_parametros_Params').first().click();
        await frame.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
            //await frame.locator('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-texteditor-container').first().click();
        //Terceros
            //texto
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato0 .dx-texteditor-input'), TERCERO_DATO_0, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato1 .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato2 .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato3 .dx-texteditor-input'), TERCERO_DATO_3, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato4 .dx-texteditor-input'), TERCERO_DATO_4, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato5 .dx-texteditor-input'), TERCERO_DATO_5, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato6 .dx-texteditor-input'), TERCERO_DATO_6, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDato7 .dx-texteditor-input'), TERCERO_DATO_7, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDatoN1 .dx-texteditor-input'), TERCERO_DATO_N1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroDatoN2 .dx-texteditor-input'), TERCERO_DATO_N2, { reemplazar: false });
            //ancho
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato0 .dx-texteditor-input'), TERCERO_DATO_0, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato1 .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato2 .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato3 .dx-texteditor-input'), TERCERO_DATO_3, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato4 .dx-texteditor-input'), TERCERO_DATO_4, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato5 .dx-texteditor-input'), TERCERO_DATO_5, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato6 .dx-texteditor-input'), TERCERO_DATO_6, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato7 .dx-texteditor-input'), TERCERO_DATO_7, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1 .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2 .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
            //
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico1 .dx-texteditor-input'), TERCERO_CONTACTO_8, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico2 .dx-texteditor-input'), TERCERO_CONTACTO_9, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico3 .dx-texteditor-input'), TERCERO_CONTACTO_10, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico4 .dx-texteditor-input'), TERCERO_CONTACTO_11, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico5 .dx-texteditor-input'), TERCERO_CONTACTO_12, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroParametro1 .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroParametro2 .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroParametro3 .dx-texteditor-input'), TERCERO_DATO_3, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroParametro4 .dx-texteditor-input'), TERCERO_DATO_4, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrTerceroParametro5 .dx-texteditor-input'), TERCERO_DATO_5, { reemplazar: false });
        //Productos
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam1Producto .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam2Producto .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam3Producto .dx-texteditor-input'), TERCERO_DATO_3, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam4Producto .dx-texteditor-input'), TERCERO_DATO_4, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam5Producto .dx-texteditor-input'), TERCERO_DATO_5, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam6Producto .dx-texteditor-input'), TERCERO_DATO_6, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam7Producto .dx-texteditor-input'), TERCERO_DATO_7, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam8Producto .dx-texteditor-input'), TERCERO_CONTACTO_8, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrParam9Producto .dx-texteditor-input'), TERCERO_CONTACTO_9, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam1ProductoAncho .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam2ProductoAncho .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam3ProductoAncho .dx-texteditor-input'), TERCERO_DATO_3, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam4ProductoAncho .dx-texteditor-input'), TERCERO_DATO_4, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam5ProductoAncho .dx-texteditor-input'), TERCERO_DATO_5, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam6ProductoAncho .dx-texteditor-input'), TERCERO_DATO_6, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam7ProductoAncho .dx-texteditor-input'), TERCERO_DATO_7, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam8ProductoAncho .dx-texteditor-input'), TERCERO_CONTACTO_8, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_IntParam9ProductoAncho .dx-texteditor-input'), TERCERO_CONTACTO_9, { reemplazar: false });
        await frame.locator('#column_parametros_prod .col-md-1').first().click();
        await frame.locator('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcion(frame, NINGUNO);
        await frame.locator('#TxtParametrosGenerales_Params_IntLabel2Doc .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcion(frame, NINGUNO);
        await frame.locator('#TxtParametrosGenerales_Params_IntLabel3Doc .dx-texteditor-input').first().click();
    await seleccionarOpcion(frame, NINGUNO);
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrDocParametro1 .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input'), TERCERO_DATO_1, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input'), TERCERO_DATO_2, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input'), TERCERO_DATO_3, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input'), TERCERO_DATO_4, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input'), TERCERO_DATO_5, { reemplazar: false });
        await escribir(frame.locator('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input'), TERCERO_DATO_6, { reemplazar: false });
        await frame.locator('#TxtParametrosGenerales_Params_StrF4Dato1 .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcion(frame, PRECIO_2);
        await frame.locator('#TxtParametrosGenerales_Params_StrF4Dato2 .dx-texteditor-input').first().click();
    await seleccionarOpcion(frame, PRECIO_1);
            //await frame.locator('#TxtParametrosGenerales_Params_IntF4TodasListas .dx-checkbox-icon').first().click();
        await frame.locator('#TxtParametrosGenerales_Params_StrF8Dato1 .dx-dropdowneditor-icon').first().click();
    await seleccionarOpcion(frame, COSTO);
        await frame.locator('#TxtParametrosGenerales_Params_StrF8Dato2 .dx-texteditor-input').first().click();
    await seleccionarOpcion(frame, DATO_1);
        await frame.locator('#TxtParametrosGenerales_Params_IntF8SoloBodega span').filter({ hasText: 'Solo Bodega' }).first().click();
            //await frame.locator('#column_parametros_prod div').filter({ hasText: 'Todas las listas de precio' }).nth(5).click();
            //await frame.locator('#TxtParametrosGenerales_Params_IntF6TodasListas .dx-checkbox-icon').first().click();
        await frame.locator('#TxtParametrosGenerales_Params_IntF6ProdutosSinSaldo .dx-checkbox-icon').first().click();
        await frame.locator('#BtnGuardar div').filter({ hasText: 'Guardar' }).first().click();
        await frame.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
        await page.waitForTimeout(2000);
    //'Validar Prueba Parametros - Defecto'
            const mensajeValidacion = 'No se guard� el cambio'
        await cerrarPestana360(page);
        await abrirHerramientas360(page, 'Parámetros');
        await page.locator('#tabs_parametros_Params').first().click();
        await page.locator('#BtnEditar div').filter({ hasText: 'Editar' }).first().click();
        await page.waitForTimeout(2000);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato0 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_0_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato3 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato4 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato5 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_5_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato6 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_6_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDato7 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_7_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDatoN1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_N1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroDatoN2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_DATO_N2_ESPERADO);
            //ancho
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato0 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_0_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato3 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato4 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato5 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_5_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato6 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_6_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato7 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_7_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_N1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_ANCHO_N2_ESPERADO);
            //
        await expect(page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_CONTACTO_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_CONTACTO_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico3 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_CONTACTO_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico4 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_CONTACTO_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico5 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_CONTACTO_5_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_PARAM_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_PARAM_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro3 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_PARAM_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro4 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_PARAM_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro5 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(TERCERO_PARAM_5_ESPERADO);
        //Productos
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam1Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam2Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam3Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam4Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam5Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_5_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam6Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_6_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam7Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_7_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam8Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_8_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrParam9Producto .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_DATO_9_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam1ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam2ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam3ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam4ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam5ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_5_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam6ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_6_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam7ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_7_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam8ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_8_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntParam9ProductoAncho .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_ANCHO_9_ESPERADO);
            ///await expect(page.locator('#column_parametros_prod .col-md-1').first()).toBeChecked();
        await expect(page.locator('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(NINGUNO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntLabel2Doc .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(NINGUNO);
        await expect(page.locator('#TxtParametrosGenerales_Params_IntLabel3Doc .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(NINGUNO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrDocParametro1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(DOC_PARAM_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_PARAM_1_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_PARAM_2_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_PARAM_3_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_PARAM_4_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_PARAM_5_ESPERADO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRODUCTO_PARAM_6_ESPERADO);
            //await expect(page.locator('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(NINGUNO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrF4Dato1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRECIO_2);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrF4Dato2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(PRECIO_1);
            //await expect(page.locator('#TxtParametrosGenerales_Params_IntF4TodasListas .dx-checkbox-icon').first()).toBeChecked();
        await expect(page.locator('#TxtParametrosGenerales_Params_StrF8Dato1 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(COSTO);
        await expect(page.locator('#TxtParametrosGenerales_Params_StrF8Dato2 .dx-texteditor-input').first(), mensajeValidacion).toHaveValue(DATO_1);
            //await expect(page.locator('#TxtParametrosGenerales_Params_IntF8SoloBodega .dx-checkbox-icon').first()).toBeChecked();
            //await expect(page.locator('#TxtParametrosGenerales_Params_IntF6TodasListas .dx-checkbox-icon').first()).toBeChecked();
            //await expect(page.locator('#TxtParametrosGenerales_Params_IntF6ProdutosSinSaldo .dx-checkbox-icon').first()).toBeChecked();
    //'Restaurar Parametros - Defecto'
            //Terceros
            //texto
        await page.waitForTimeout(9000);
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato0 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato3 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato4 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato5 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato6 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDato7 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDatoN1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroDatoN2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
            //ancho
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato0 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato3 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato4 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato5 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato6 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDato7 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
            //
        await page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico3 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico4 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrNombreContactoTecnico5 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro3 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro4 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrTerceroParametro5 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        //Productos
        await page.locator('#TxtParametrosGenerales_Params_StrParam1Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam2Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam3Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam4Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam5Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam6Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam7Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam8Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrParam9Producto .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam1ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam2ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam3ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam4ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam5ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam6ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam7ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam8ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_IntParam9ProductoAncho .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrDocParametro1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input').first().click();
        await page.keyboard.press('Backspace');
        await page.locator('#BtnGuardar div').filter({ hasText: 'Guardar' }).first().click();
        await page.locator('button').filter({ hasText: 'Aceptar' }).nth(1).click();
        await page.waitForTimeout(2000);
        await cerrarPestana360(page);
        await cerrarSesion360(page);
}

test.describe('2.Parametros-Parametros - copia - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Parametros ERP POS - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba2ParametrosParametroscopia(page, testAdminConfig);
    });
});

test.describe('2.Parametros-Parametros - copia - Hgi360 Admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(hgiAdminConfig.pagina);
    });

    test('Prueba Parametros ERP POS - Hgi360 Admin', async ({ page }) => {
        await ejecutarPrueba2ParametrosParametroscopia(page, hgiAdminConfig);
    });
});
