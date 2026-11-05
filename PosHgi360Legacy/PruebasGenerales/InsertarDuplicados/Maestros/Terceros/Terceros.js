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
const CODIGO = '01';
const DESCRIPCION_TIPO_TERCERO = '123321';
const NOMBRE_VENDEDOR = 'VENDEDORCITO';
const SUCURSAL = '0 - GENERAL';
const DESCRIPCION_ACTIVIDAD = 'MiDescripciónActividadEco';
const TERCERO_ID = '0';
const TIPO_ID = 'CE - Cedula de Extranjería';
const P_APELLIDO = 'Monsalve';
const S_APELLIDO = 'QA';
const P_NOMBRE = 'Yesica';
const CAUSA_RETIRO = '1 - RETIRADO';
const FECHA_RETIRO = '2024-10-27';

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inserción Duplicados - TERCEROS - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
        ///PRUEBA TIPO TERCEROS
 //Se ingresa al maestro de tipo terceros

        await abrirMaestros360(t, 'Tipos Tercero', 'terceros');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#gridTiposTerceros .dx-button-content').nth(1))
    //Se comienza con la inserción de datos para la creación del TIPO tercero
        .typeText('#txtIntIdTipoTercerofoco', CODIGO_CERO)
        .wait(100)
        .typeText('#txtTipoTerceros_Descripcion .dx-texteditor-input', DESCRIPCION_TIPO_TERCERO)
        //.click(Selector('#txtTiposTerceros_IntPrecio div').withText('[Vacío]').nth(1))
        .click(Selector('#BtnActualizarTipoTerceros div').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA VENDEDORES
      //Se ingresa al maestro de VENDEDORES

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Vendedores', 'terceros');
    await t
        .click(Selector('#gridVendedores .dx-icon.dx-icon-add'))
    //Se comienza con la inserción de datos para la creación del VENDEDOR
        .typeText('#txtVendedor_Codigo', CODIGO_CERO)
        .wait(100)
        .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE_VENDEDOR)
        .click('#txtVendedores_ReporteA .dx-lookup-field')
        .click('#txtVendedores_Sucursal .dx-lookup-field')
        ;
    await seleccionarOpcion(t, SUCURSAL);
    await t
        .click('#txtVendedores_Activo .dx-checkbox-icon')
        .click(Selector('#BtnActualizarVendedor div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA ACTIVIDADES ECO
   //Se ingresa al maestro de Actividades Eco

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Actividades Eco', 'terceros');
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        await t
        .click('#gridActividadesEconomicas .dx-icon.dx-icon-add')
        .typeText('#txtStrIdActividadEco', CODIGO)
        .wait(100)
        .typeText('#txtActividadEconomica_Descripcion .dx-texteditor-input', DESCRIPCION_ACTIVIDAD)
        .click(Selector('#BtnGuardarActividadEconomica div').withText('Guardar'))
        //.click(Selector('#txtMaestroTipo_Concepto .dx-lookup-field'))
        //El sistema permite la creación de un Tipo sin tener un concepto asociado
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA TERCEROS
        //Se ingresa al maestro de terceros

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .click(Selector('#gridTerceros .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación del tercero
        .typeText('#txtTercero_Id .dx-texteditor-input', TERCERO_ID)
        .wait(100)
        .pressKey('enter')
        .click(Selector('#txtTercero_Tipo_Id .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_ID);
    await t//Cédula de ciudadanía
        //.click(Selector('#txt_lista_TipoPersonaTercero div').withText('Natural').nth(1))
        .typeText('#txtTercero_PApellido .dx-texteditor-input', P_APELLIDO)
        .typeText('#txtTercero_SApellido .dx-texteditor-input', S_APELLIDO)
        .typeText('#txtTercero_PNombre .dx-texteditor-input', P_NOMBRE)
        /*
        .typeText('#txtTercero_Direccion .dx-texteditor-input', 'la Casa De Yesica')
        .typeText('#txtTercero_Celular .dx-texteditor-input', '2.3')
        .typeText('#txtTercero_Email .dx-texteditor-input', 'correo@gmail.com')
        .typeText('#txtTercero_Telefono .dx-texteditor-input','123123123')
            //.typeText('#txtTercero_Telefono .dx-texteditor-input', '!"#$#$%&/')
             //No permite el ingreso de letras pero si de caracteres como #$%
            //Cuando se ingresa "." seguido de un número, permite guardar el tercero como decimal y lo mismo ocurre con ","
            //a la hora de ingresar "." o ",", seguido de un entero, y luego otra vez "." o "," el sistema borra los números después de este
             //El sistema permite el grabado de un tercero ingresando cualquier caracter
        .typeText('#txtTercero_Fax .dx-texteditor-input','.,qwerty')
        .doubleClick(Selector('#txtTercero_EmailFE .dx-texteditor-input'))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtTercero_EmailFE .dx-texteditor-input', 'correoFE@gmail.com')
        //No permite guardarlo sin el formato de correo ni caracteres especiales
        .typeText('#txtTercero_Web .dx-texteditor-input', 'notiene')
        //El sistema está permitiendo el guardado del tercero con un sitio web inválido o sin el formato correcto
        .click(Selector('#txtTercero_TipoTercero .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '01 - CLIENTE');
    await t
        .click(Selector('#txtTercero_Ciudad .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '05004 - ABRIAQUÍ');
    await t
        .click(Selector('#txtTercero_Sector .dx-lookup-field'))
       ;
    await seleccionarOpcion(t, '528 - espacios');
    await t
        .click(Selector('#txtTercero_Barrio .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '0 - preuba espacios');
    await t
        .click(Selector('#txtTercero_Vendedor .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '01 - VENDEDOR');
    await t
        .typeText('#txtTercero_LineaNegocio .dx-texteditor-input','MiLineaNegocio')
        .click(Selector('#txtTercero_CodigoPostalDIAN .dx-lookup-field-wrapper'))
        ;
    await seleccionarOpcion(t, '050005 - 050005');
    await t
        .typeText('#txtTercero_Direccion2 .dx-texteditor-input','otra casa de yesica')
        .click(Selector('#txtTercero_Estado .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '0 - Inactivo');
    await t
        */
        .click(Selector('#txtTercero_CausaRetiro .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CAUSA_RETIRO);
    await t
        .typeText('#txtTercero_FechaRetiro',FECHA_RETIRO)
        //El sistema permite guardar un tercero activo con fecha de retiro
        .click(Selector('#BtnGuardarTercero div').withText('Guardar'))
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

test('Prueba Inserción Duplicados - TERCEROS - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
        ///PRUEBA TIPO TERCEROS
 //Se ingresa al maestro de tipo terceros

        await abrirMaestros360(t, 'Tipos Tercero', 'terceros');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#gridTiposTerceros .dx-button-content').nth(1))
    //Se comienza con la inserción de datos para la creación del TIPO tercero
        .typeText('#txtIntIdTipoTercerofoco', CODIGO_CERO)
        .wait(100)
        .typeText('#txtTipoTerceros_Descripcion .dx-texteditor-input', DESCRIPCION_TIPO_TERCERO)
        //.click(Selector('#txtTiposTerceros_IntPrecio div').withText('[Vacío]').nth(1))
        .click(Selector('#BtnActualizarTipoTerceros div').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA VENDEDORES
      //Se ingresa al maestro de VENDEDORES

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Vendedores', 'terceros');
    await t
        .click(Selector('#gridVendedores .dx-icon.dx-icon-add'))
    //Se comienza con la inserción de datos para la creación del VENDEDOR
        .typeText('#txtVendedor_Codigo', CODIGO_CERO)
        .wait(100)
        .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE_VENDEDOR)
        .click('#txtVendedores_ReporteA .dx-lookup-field')
        .click('#txtVendedores_Sucursal .dx-lookup-field')
        ;
    await seleccionarOpcion(t, SUCURSAL);
    await t
        .click('#txtVendedores_Activo .dx-checkbox-icon')
        .click(Selector('#BtnActualizarVendedor div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA ACTIVIDADES ECO
   //Se ingresa al maestro de Actividades Eco

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Actividades Eco', 'terceros');
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        await t
        .click('#gridActividadesEconomicas .dx-icon.dx-icon-add')
        .typeText('#txtStrIdActividadEco', CODIGO)
        .wait(100)
        .typeText('#txtActividadEconomica_Descripcion .dx-texteditor-input', DESCRIPCION_ACTIVIDAD)
        .click(Selector('#BtnGuardarActividadEconomica div').withText('Guardar'))
        //.click(Selector('#txtMaestroTipo_Concepto .dx-lookup-field'))
        //El sistema permite la creación de un Tipo sin tener un concepto asociado
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA TERCEROS
        //Se ingresa al maestro de terceros

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .click(Selector('#gridTerceros .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación del tercero
        .typeText('#txtTercero_Id .dx-texteditor-input', TERCERO_ID)
        .wait(100)
        .pressKey('enter')
        .click(Selector('#txtTercero_Tipo_Id .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_ID);
    await t//Cédula de ciudadanía
        //.click(Selector('#txt_lista_TipoPersonaTercero div').withText('Natural').nth(1))
        .typeText('#txtTercero_PApellido .dx-texteditor-input', P_APELLIDO)
        .typeText('#txtTercero_SApellido .dx-texteditor-input', S_APELLIDO)
        .typeText('#txtTercero_PNombre .dx-texteditor-input', P_NOMBRE)
        /*
        .typeText('#txtTercero_Direccion .dx-texteditor-input', 'la Casa De Yesica')
        .typeText('#txtTercero_Celular .dx-texteditor-input', '2.3')
        .typeText('#txtTercero_Email .dx-texteditor-input', 'correo@gmail.com')
        .typeText('#txtTercero_Telefono .dx-texteditor-input','123123123')
            //.typeText('#txtTercero_Telefono .dx-texteditor-input', '!"#$#$%&/')
             //No permite el ingreso de letras pero si de caracteres como #$%
            //Cuando se ingresa "." seguido de un número, permite guardar el tercero como decimal y lo mismo ocurre con ","
            //a la hora de ingresar "." o ",", seguido de un entero, y luego otra vez "." o "," el sistema borra los números después de este
             //El sistema permite el grabado de un tercero ingresando cualquier caracter
        .typeText('#txtTercero_Fax .dx-texteditor-input','.,qwerty')
        .doubleClick(Selector('#txtTercero_EmailFE .dx-texteditor-input'))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtTercero_EmailFE .dx-texteditor-input', 'correoFE@gmail.com')
        //No permite guardarlo sin el formato de correo ni caracteres especiales
        .typeText('#txtTercero_Web .dx-texteditor-input', 'notiene')
        //El sistema está permitiendo el guardado del tercero con un sitio web inválido o sin el formato correcto
        .click(Selector('#txtTercero_TipoTercero .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '01 - CLIENTE');
    await t
        .click(Selector('#txtTercero_Ciudad .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '05004 - ABRIAQUÍ');
    await t
        .click(Selector('#txtTercero_Sector .dx-lookup-field'))
       ;
    await seleccionarOpcion(t, '528 - espacios');
    await t
        .click(Selector('#txtTercero_Barrio .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '0 - preuba espacios');
    await t
        .click(Selector('#txtTercero_Vendedor .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '01 - VENDEDOR');
    await t
        .typeText('#txtTercero_LineaNegocio .dx-texteditor-input','MiLineaNegocio')
        .click(Selector('#txtTercero_CodigoPostalDIAN .dx-lookup-field-wrapper'))
        ;
    await seleccionarOpcion(t, '050005 - 050005');
    await t
        .typeText('#txtTercero_Direccion2 .dx-texteditor-input','otra casa de yesica')
        .click(Selector('#txtTercero_Estado .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, '0 - Inactivo');
    await t
        */
        .click(Selector('#txtTercero_CausaRetiro .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CAUSA_RETIRO);
    await t
        .typeText('#txtTercero_FechaRetiro',FECHA_RETIRO)
        //El sistema permite guardar un tercero activo con fecha de retiro
        .click(Selector('#BtnGuardarTercero div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
