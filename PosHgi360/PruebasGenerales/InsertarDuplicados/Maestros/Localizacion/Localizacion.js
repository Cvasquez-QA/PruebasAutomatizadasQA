import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_CERO = '0';
const CODIGO = '01';
const DESCRIPCION_BARRIO = 'DescripcionMiBarrio';
const DESCRIPCION_BODEGA = 'descripcionmibodega';
const DIRECCION_BODEGA = 'direcciónmibidega123';
const TELEFONO_BODEGA = '1623456as';
const RESPONSABLE_BODEGA = 'nosé';
const DESCRIPCION_CENTRO_COSTO = 'DescripcionMiCentroCosto';
const DESCRIPCION_CIUDAD = 'MIDESCRIPCION';
const ZONA = '0 - GENERAL';
const DANE_CIUDAD = '13006 - ACHÍ';
const PAIS = 'MIPAIS';
const PAIS_ISO = 'AF - Afganistán';
const DESCRIPCION_SECTOR = 'DescripcionMiSector';
const DESCRIPCION_SUBCENTRO = 'DescripcionMiSubCentroCosto';
const DESCRIPCION_SUCURSAL = 'DescripcionMiSucursal';
const DESCRIPCION_ZONA = 'DescripcionMiZona';

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inserción Duplicados - LOCALIZACION - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
        ///PRUEBA BARRIOS
 //Se ingresa al maestro de Barrio

        await abrirMaestros360(t, 'Barrios', 'localizacion');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#gridBarrios .dx-button-content').nth(1))
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtBarrio_Codigofocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtBarrio_Descripcion .dx-texteditor-input', DESCRIPCION_BARRIO)
        .click(Selector('#BtnActualizarBarrio div').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA BODEGA
 //Se ingresa al maestro de Bodegas

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Bodegas', 'localizacion');
    await t
        .click('#gridBodegas .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtIdBodegafocus', CODIGO)
        .wait(1000)
        .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION_BODEGA)
        .typeText('#txtBodega_Direccion .dx-texteditor-input', DIRECCION_BODEGA)
        .typeText('#txtBodega_Telefono .dx-texteditor-input', TELEFONO_BODEGA)
        .click('#txtBodega_Responsable .dx-texteditor-input')
        .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE_BODEGA)
        .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
        //El sistema permite guardar una Bodega sin precio
        .click(Selector('#txtBodega_Estado .dx-radiobutton-icon').nth(2))
        .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA CENTRPO DE COSTOS
     //Se ingresa al maestro de CentroCosto

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Centro de Costo', 'localizacion');
    await t
        .click('#gridCentrosCostos .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtCentroCosto_Codigofocus', CODIGO)
        .wait(1000)
        .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_CENTRO_COSTO)
        .click('#txtCentroCosto_Estado .dx-checkbox-icon')
        .click(Selector('#BtnActualizarCentroCosto span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA CIUDADES
    //Se ingresa al maestro de Ciudades

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Ciudades', 'localizacion');
    await t
        .click('#gridCiudades .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación de la ciudad
        .typeText('#txtCiudad_Idfocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION_CIUDAD)
        .click(Selector('#txtCiudad_Zonas .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, ZONA);
    await t
        .click(Selector('#txtCiudad_Dane_Ciudad .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, DANE_CIUDAD);
    await t
        .typeText('#txtCiudad_Dane_Pais .dx-texteditor-input', PAIS)
        .click(Selector('#txtCiudad_Dane_PaisIso .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, PAIS_ISO);
    await t
        .click(Selector('#BtnGuardarCiudad span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA SECTORES
   //Se ingresa al maestro de Sector

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Sectores', 'localizacion');
    await t
        .click(Selector('#gridSectores .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtSector_Codigofocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtSector_Descripcion .dx-texteditor-input', DESCRIPCION_SECTOR)
        .click(Selector('#BtnActualizarSector div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA SUBCENTRO COSTOS
    //Se ingresa al maestro de SubCentroCosto

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Subcentro de Costo', 'localizacion');
    await t
        .click('#gridSubCentrosCostos .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación del subcentro de costo
        .typeText('#txtSubCentroCosto_Codigofocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_SUBCENTRO)
        .click('#txtSubCentroCosto_Estado .dx-checkbox-icon')
        .click(Selector('#BtnActualizarSubCentroCosto span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA SUCURSALES
    //Se ingresa al maestro de Sucursal

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Sucursales', 'localizacion');
    await t
        .click(Selector('#gridSucursales .dx-button-content').nth(1))
        .typeText('#txtStrIdSucursalfocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION_SUCURSAL)
        .click(Selector('#txtSucursales_IntEstado .dx-checkbox-icon'))
        .click(Selector('#BtnActualizarSucursal div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA ZONAS
         //Se ingresa al maestro de Zona

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Zonas', 'localizacion');
    await t
        .click(Selector('#gridZonas .dx-button-content').nth(1))
        .typeText('#txtZona_Codigofocus', CODIGO)
        .wait(1000)
        .typeText('#txtZona_Descripcion .dx-texteditor-input', DESCRIPCION_ZONA)
        .click(Selector('#BtnActualizarZona div').withText('Guardar'))
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

test('Prueba Inserción Duplicados - LOCALIZACION - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
        ///PRUEBA BARRIOS
 //Se ingresa al maestro de Barrio

        await abrirMaestros360(t, 'Barrios', 'localizacion');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click(Selector('#gridBarrios .dx-button-content').nth(1))
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtBarrio_Codigofocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtBarrio_Descripcion .dx-texteditor-input', DESCRIPCION_BARRIO)
        .click(Selector('#BtnActualizarBarrio div').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA BODEGA
 //Se ingresa al maestro de Bodegas

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Bodegas', 'localizacion');
    await t
        .click('#gridBodegas .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtIdBodegafocus', CODIGO)
        .wait(1000)
        .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION_BODEGA)
        .typeText('#txtBodega_Direccion .dx-texteditor-input', DIRECCION_BODEGA)
        .typeText('#txtBodega_Telefono .dx-texteditor-input', TELEFONO_BODEGA)
        .click('#txtBodega_Responsable .dx-texteditor-input')
        .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE_BODEGA)
        .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
        //El sistema permite guardar una Bodega sin precio
        .click(Selector('#txtBodega_Estado .dx-radiobutton-icon').nth(2))
        .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA CENTRPO DE COSTOS
     //Se ingresa al maestro de CentroCosto

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Centro de Costo', 'localizacion');
    await t
        .click('#gridCentrosCostos .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtCentroCosto_Codigofocus', CODIGO)
        .wait(1000)
        .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_CENTRO_COSTO)
        .click('#txtCentroCosto_Estado .dx-checkbox-icon')
        .click(Selector('#BtnActualizarCentroCosto span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA CIUDADES
    //Se ingresa al maestro de Ciudades

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Ciudades', 'localizacion');
    await t
        .click('#gridCiudades .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación de la ciudad
        .typeText('#txtCiudad_Idfocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION_CIUDAD)
        .click(Selector('#txtCiudad_Zonas .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, ZONA);
    await t
        .click(Selector('#txtCiudad_Dane_Ciudad .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, DANE_CIUDAD);
    await t
        .typeText('#txtCiudad_Dane_Pais .dx-texteditor-input', PAIS)
        .click(Selector('#txtCiudad_Dane_PaisIso .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, PAIS_ISO);
    await t
        .click(Selector('#BtnGuardarCiudad span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA SECTORES
   //Se ingresa al maestro de Sector

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Sectores', 'localizacion');
    await t
        .click(Selector('#gridSectores .dx-button-content').nth(1))
        //Se comienza con la inserción de datos para la creación del Actividades Eco
        .typeText('#txtSector_Codigofocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtSector_Descripcion .dx-texteditor-input', DESCRIPCION_SECTOR)
        .click(Selector('#BtnActualizarSector div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA SUBCENTRO COSTOS
    //Se ingresa al maestro de SubCentroCosto

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Subcentro de Costo', 'localizacion');
    await t
        .click('#gridSubCentrosCostos .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación del subcentro de costo
        .typeText('#txtSubCentroCosto_Codigofocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_SUBCENTRO)
        .click('#txtSubCentroCosto_Estado .dx-checkbox-icon')
        .click(Selector('#BtnActualizarSubCentroCosto span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA SUCURSALES
    //Se ingresa al maestro de Sucursal

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Sucursales', 'localizacion');
    await t
        .click(Selector('#gridSucursales .dx-button-content').nth(1))
        .typeText('#txtStrIdSucursalfocus', CODIGO_CERO)
        .wait(1000)
        .typeText('#txtSucursales_Descripcion .dx-texteditor-input', DESCRIPCION_SUCURSAL)
        .click(Selector('#txtSucursales_IntEstado .dx-checkbox-icon'))
        .click(Selector('#BtnActualizarSucursal div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA ZONAS
         //Se ingresa al maestro de Zona

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Zonas', 'localizacion');
    await t
        .click(Selector('#gridZonas .dx-button-content').nth(1))
        .typeText('#txtZona_Codigofocus', CODIGO)
        .wait(1000)
        .typeText('#txtZona_Descripcion .dx-texteditor-input', DESCRIPCION_ZONA)
        .click(Selector('#BtnActualizarZona div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
