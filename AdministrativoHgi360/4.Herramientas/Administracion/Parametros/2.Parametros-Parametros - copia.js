import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../../ParametrosPruebas/Hgi360Admin8888.js';

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

async function ejecutarPrueba2ParametrosParametroscopia(t, config) {
    await ingresarAplicacion(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .wait(3000)
            .click('#tabs_parametros_Params')
            .click(Selector('#BtnEditar div').withText('Editar'))
            //.click(Selector('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-texteditor-container'))
        //Terceros
            //texto
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato0 .dx-texteditor-input', TERCERO_DATO_0)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato1 .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato2 .dx-texteditor-input', TERCERO_DATO_2)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato3 .dx-texteditor-input', TERCERO_DATO_3)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato4 .dx-texteditor-input', TERCERO_DATO_4)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato5 .dx-texteditor-input', TERCERO_DATO_5)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato6 .dx-texteditor-input', TERCERO_DATO_6)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDato7 .dx-texteditor-input', TERCERO_DATO_7)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDatoN1 .dx-texteditor-input', TERCERO_DATO_N1)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroDatoN2 .dx-texteditor-input', TERCERO_DATO_N2)
            //ancho
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato0 .dx-texteditor-input', TERCERO_DATO_0)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato1 .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato2 .dx-texteditor-input', TERCERO_DATO_2)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato3 .dx-texteditor-input', TERCERO_DATO_3)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato4 .dx-texteditor-input', TERCERO_DATO_4)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato5 .dx-texteditor-input', TERCERO_DATO_5)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato6 .dx-texteditor-input', TERCERO_DATO_6)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDato7 .dx-texteditor-input', TERCERO_DATO_7)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1 .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2 .dx-texteditor-input', TERCERO_DATO_2)
            //
            .typeText('#TxtParametrosGenerales_Params_StrNombreContactoTecnico1 .dx-texteditor-input', TERCERO_CONTACTO_8)
            .typeText('#TxtParametrosGenerales_Params_StrNombreContactoTecnico2 .dx-texteditor-input', TERCERO_CONTACTO_9)
            .typeText('#TxtParametrosGenerales_Params_StrNombreContactoTecnico3 .dx-texteditor-input', TERCERO_CONTACTO_10)
            .typeText('#TxtParametrosGenerales_Params_StrNombreContactoTecnico4 .dx-texteditor-input', TERCERO_CONTACTO_11)
            .typeText('#TxtParametrosGenerales_Params_StrNombreContactoTecnico5 .dx-texteditor-input', TERCERO_CONTACTO_12)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroParametro1 .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroParametro2 .dx-texteditor-input', TERCERO_DATO_2)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroParametro3 .dx-texteditor-input', TERCERO_DATO_3)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroParametro4 .dx-texteditor-input', TERCERO_DATO_4)
            .typeText('#TxtParametrosGenerales_Params_StrTerceroParametro5 .dx-texteditor-input', TERCERO_DATO_5)
        //Productos
            .typeText('#TxtParametrosGenerales_Params_StrParam1Producto .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_StrParam2Producto .dx-texteditor-input', TERCERO_DATO_2)
            .typeText('#TxtParametrosGenerales_Params_StrParam3Producto .dx-texteditor-input', TERCERO_DATO_3)
            .typeText('#TxtParametrosGenerales_Params_StrParam4Producto .dx-texteditor-input', TERCERO_DATO_4)
            .typeText('#TxtParametrosGenerales_Params_StrParam5Producto .dx-texteditor-input', TERCERO_DATO_5)
            .typeText('#TxtParametrosGenerales_Params_StrParam6Producto .dx-texteditor-input', TERCERO_DATO_6)
            .typeText('#TxtParametrosGenerales_Params_StrParam7Producto .dx-texteditor-input', TERCERO_DATO_7)
            .typeText('#TxtParametrosGenerales_Params_StrParam8Producto .dx-texteditor-input', TERCERO_CONTACTO_8)
            .typeText('#TxtParametrosGenerales_Params_StrParam9Producto .dx-texteditor-input', TERCERO_CONTACTO_9)
            .typeText('#TxtParametrosGenerales_Params_IntParam1ProductoAncho .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_IntParam2ProductoAncho .dx-texteditor-input', TERCERO_DATO_2)
            .typeText('#TxtParametrosGenerales_Params_IntParam3ProductoAncho .dx-texteditor-input', TERCERO_DATO_3)
            .typeText('#TxtParametrosGenerales_Params_IntParam4ProductoAncho .dx-texteditor-input', TERCERO_DATO_4)
            .typeText('#TxtParametrosGenerales_Params_IntParam5ProductoAncho .dx-texteditor-input', TERCERO_DATO_5)
            .typeText('#TxtParametrosGenerales_Params_IntParam6ProductoAncho .dx-texteditor-input', TERCERO_DATO_6)
            .typeText('#TxtParametrosGenerales_Params_IntParam7ProductoAncho .dx-texteditor-input', TERCERO_DATO_7)
            .typeText('#TxtParametrosGenerales_Params_IntParam8ProductoAncho .dx-texteditor-input', TERCERO_CONTACTO_8)
            .typeText('#TxtParametrosGenerales_Params_IntParam9ProductoAncho .dx-texteditor-input', TERCERO_CONTACTO_9)
            .click('#column_parametros_prod .col-md-1')
            .click('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, NINGUNO);
    await t
            .click('#TxtParametrosGenerales_Params_IntLabel2Doc .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, NINGUNO);
    await t
            .click('#TxtParametrosGenerales_Params_IntLabel3Doc .dx-texteditor-input')
            ;
    await seleccionarOpcion(t, NINGUNO);
    await t
            .typeText('#TxtParametrosGenerales_Params_StrDocParametro1 .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input', TERCERO_DATO_1)
            .typeText('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input', TERCERO_DATO_2)
            .typeText('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input', TERCERO_DATO_3)
            .typeText('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input', TERCERO_DATO_4)
            .typeText('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input', TERCERO_DATO_5)
            .typeText('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input', TERCERO_DATO_6)
            .click('#TxtParametrosGenerales_Params_StrF4Dato1 .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, PRECIO_2);
    await t
            .click('#TxtParametrosGenerales_Params_StrF4Dato2 .dx-texteditor-input')
            ;
    await seleccionarOpcion(t, PRECIO_1);
    await t
            //.click('#TxtParametrosGenerales_Params_IntF4TodasListas .dx-checkbox-icon')
            .click('#TxtParametrosGenerales_Params_StrF8Dato1 .dx-dropdowneditor-icon')
            ;
    await seleccionarOpcion(t, COSTO);
    await t
            .click('#TxtParametrosGenerales_Params_StrF8Dato2 .dx-texteditor-input')
            ;
    await seleccionarOpcion(t, DATO_1);
    await t
            .click(Selector('#TxtParametrosGenerales_Params_IntF8SoloBodega span').withText('Solo Bodega'))
            //.click(Selector('#column_parametros_prod div').withText('Todas las listas de precio').nth(5))
            //.click('#TxtParametrosGenerales_Params_IntF6TodasListas .dx-checkbox-icon')
            .click('#TxtParametrosGenerales_Params_IntF6ProdutosSinSaldo .dx-checkbox-icon')
            .click(Selector('#BtnGuardar div').withText('Guardar'))
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000);
    //'Validar Prueba Parametros - Defecto'
            const mensajeValidacion = 'No se guard� el cambio'
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametros_Params')
            .click(Selector('#BtnEditar div').withText('Editar'))
            .wait(2000)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato0 .dx-texteditor-input').value).eql(TERCERO_DATO_0_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato1 .dx-texteditor-input').value).eql(TERCERO_DATO_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato2 .dx-texteditor-input').value).eql(TERCERO_DATO_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato3 .dx-texteditor-input').value).eql(TERCERO_DATO_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato4 .dx-texteditor-input').value).eql(TERCERO_DATO_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato5 .dx-texteditor-input').value).eql(TERCERO_DATO_5_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato6 .dx-texteditor-input').value).eql(TERCERO_DATO_6_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDato7 .dx-texteditor-input').value).eql(TERCERO_DATO_7_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDatoN1 .dx-texteditor-input').value).eql(TERCERO_DATO_N1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroDatoN2 .dx-texteditor-input').value).eql(TERCERO_DATO_N2_ESPERADO,mensajeValidacion)
            //ancho
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato0 .dx-texteditor-input').value).eql(TERCERO_ANCHO_0_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato1 .dx-texteditor-input').value).eql(TERCERO_ANCHO_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato2 .dx-texteditor-input').value).eql(TERCERO_ANCHO_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato3 .dx-texteditor-input').value).eql(TERCERO_ANCHO_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato4 .dx-texteditor-input').value).eql(TERCERO_ANCHO_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato5 .dx-texteditor-input').value).eql(TERCERO_ANCHO_5_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato6 .dx-texteditor-input').value).eql(TERCERO_ANCHO_6_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDato7 .dx-texteditor-input').value).eql(TERCERO_ANCHO_7_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1 .dx-texteditor-input').value).eql(TERCERO_ANCHO_N1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2 .dx-texteditor-input').value).eql(TERCERO_ANCHO_N2_ESPERADO,mensajeValidacion)
            //
            .expect(Selector('#TxtParametrosGenerales_Params_StrNombreContactoTecnico1 .dx-texteditor-input').value).eql(TERCERO_CONTACTO_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrNombreContactoTecnico2 .dx-texteditor-input').value).eql(TERCERO_CONTACTO_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrNombreContactoTecnico3 .dx-texteditor-input').value).eql(TERCERO_CONTACTO_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrNombreContactoTecnico4 .dx-texteditor-input').value).eql(TERCERO_CONTACTO_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrNombreContactoTecnico5 .dx-texteditor-input').value).eql(TERCERO_CONTACTO_5_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroParametro1 .dx-texteditor-input').value).eql(TERCERO_PARAM_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroParametro2 .dx-texteditor-input').value).eql(TERCERO_PARAM_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroParametro3 .dx-texteditor-input').value).eql(TERCERO_PARAM_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroParametro4 .dx-texteditor-input').value).eql(TERCERO_PARAM_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrTerceroParametro5 .dx-texteditor-input').value).eql(TERCERO_PARAM_5_ESPERADO,mensajeValidacion)
        //Productos
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam1Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam2Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam3Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam4Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam5Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_5_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam6Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_6_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam7Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_7_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam8Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_8_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrParam9Producto .dx-texteditor-input').value).eql(PRODUCTO_DATO_9_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam1ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam2ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam3ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam4ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam5ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_5_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam6ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_6_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam7ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_7_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam8ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_8_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntParam9ProductoAncho .dx-texteditor-input').value).eql(PRODUCTO_ANCHO_9_ESPERADO,mensajeValidacion)
            ///.expect(Selector('#column_parametros_prod .col-md-1').checked).ok()
            .expect(Selector('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-texteditor-input').value).eql(NINGUNO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntLabel2Doc .dx-texteditor-input').value).eql(NINGUNO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_IntLabel3Doc .dx-texteditor-input').value).eql(NINGUNO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrDocParametro1 .dx-texteditor-input').value).eql(DOC_PARAM_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input').value).eql(PRODUCTO_PARAM_1_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input').value).eql(PRODUCTO_PARAM_2_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input').value).eql(PRODUCTO_PARAM_3_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input').value).eql(PRODUCTO_PARAM_4_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input').value).eql(PRODUCTO_PARAM_5_ESPERADO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input').value).eql(PRODUCTO_PARAM_6_ESPERADO,mensajeValidacion)
            //.expect(Selector('#TxtParametrosGenerales_Params_IntLabel1Doc .dx-texteditor-input').value).eql(NINGUNO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrF4Dato1 .dx-texteditor-input').value).eql(PRECIO_2,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrF4Dato2 .dx-texteditor-input').value).eql(PRECIO_1,mensajeValidacion)
            //.expect(Selector('#TxtParametrosGenerales_Params_IntF4TodasListas .dx-checkbox-icon').checked).ok()
            .expect(Selector('#TxtParametrosGenerales_Params_StrF8Dato1 .dx-texteditor-input').value).eql(COSTO,mensajeValidacion)
            .expect(Selector('#TxtParametrosGenerales_Params_StrF8Dato2 .dx-texteditor-input').value).eql(DATO_1,mensajeValidacion)
            //.expect(Selector('#TxtParametrosGenerales_Params_IntF8SoloBodega .dx-checkbox-icon').checked).ok()
            //.expect(Selector('#TxtParametrosGenerales_Params_IntF6TodasListas .dx-checkbox-icon').checked).ok()
            //.expect(Selector('#TxtParametrosGenerales_Params_IntF6ProdutosSinSaldo .dx-checkbox-icon').checked).ok()
    //'Restaurar Parametros - Defecto'
            //Terceros
            //texto
            .wait(9000)
            .click('#TxtParametrosGenerales_Params_StrTerceroDato0 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato1 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato2 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato3 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato4 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato5 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato6 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDato7 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDatoN1 .dx-texteditor-input')
    		.pressKey('backspace')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroDatoN2 .dx-texteditor-input')
    		.pressKey('backspace')
            .pressKey('backspace')
            //ancho
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato0 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato1 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato2 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato3 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato4 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato5 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato6 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDato7 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN1 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntTerceroAnchoDatoN2 .dx-texteditor-input')
    		.pressKey('backspace')
            //
            .click('#TxtParametrosGenerales_Params_StrNombreContactoTecnico1 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrNombreContactoTecnico2 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrNombreContactoTecnico3 .dx-texteditor-input')
    		.pressKey('backspace')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrNombreContactoTecnico4 .dx-texteditor-input')
    		.pressKey('backspace')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrNombreContactoTecnico5 .dx-texteditor-input')
    		.pressKey('backspace')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroParametro1 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroParametro2 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroParametro3 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroParametro4 .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrTerceroParametro5 .dx-texteditor-input')
    		.pressKey('backspace')
        //Productos
            .click('#TxtParametrosGenerales_Params_StrParam1Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam2Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam3Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam4Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam5Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam6Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam7Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam8Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrParam9Producto .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam1ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam2ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam3ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam4ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam5ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam6ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam7ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam8ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_IntParam9ProductoAncho .dx-texteditor-input')
    		.pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrDocParametro1 .dx-texteditor-input')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input')
            .pressKey('backspace')
            .click('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input')
            .pressKey('backspace')
            .click(Selector('#BtnGuardar div').withText('Guardar'))
            .click(Selector('button').withText('Aceptar').nth(1))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `2.Parametros-Parametros - copia - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Parametros ERP POS - Test Hgi360', async t => {
    await ejecutarPrueba2ParametrosParametroscopia(t, testAdminConfig);
});

fixture `2.Parametros-Parametros - copia - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Parametros ERP POS - Hgi360 Admin', async t => {
    await ejecutarPrueba2ParametrosParametroscopia(t, hgiAdminConfig);
});
