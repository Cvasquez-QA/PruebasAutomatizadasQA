import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const TABLA_TERCEROS = 'Terceros';
const TABLA_PRODUCTOS = 'Productos';
const TABLA_PLAN_CONTABLE = 'PlanContable';
const ARCHIVO_TERCEROS = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraTerceros.xls';
const ARCHIVO_TERCEROS_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraTercerosActualizado.xls';
const TERCERO_CODIGO_1 = '112233';
const TERCERO_CODIGO_2 = '123123';
const ARCHIVO_PRODUCTOS = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraArchivoPlanoProductos.xls';
const ARCHIVO_PRODUCTOS_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraArchivoPlanoProductosActualizado.xls';
const PRODUCTO_CODIGO = '131211';
const MODO_PGCA = 'PGCA';
const ARCHIVO_PLAN_PCGA = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraPlandeCuentasPCGA.xls';
const ARCHIVO_PLAN_PCGA_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraPlandeCuentasPCGAActualizado.xls';
const ARCHIVO_PLAN_NIIF = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraPlandeCuentasNIIF.xls';
const ARCHIVO_PLAN_NIIF_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraPlandeCuentasNIIFActualizado.xls';
const CUENTA_CODIGO = '1106';
const DESCRIPCION_PLAN_PCGA = 'PruebaPlanCuentasPCGANuevo';
const DESCRIPCION_PLAN_NIIF = 'PruebaPlanCuentaNIIFActualizado';
const MENSAJE_IMPORTACION = 'El archivo que se descargó contiene el resultado de la importación.';

fixture `Prueba Archivos Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Archivos - Terceros - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_TERCEROS);
    await t
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload(Selector('#BtnRuta1 .dx-fileuploader-input'), [ARCHIVO_TERCEROS])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Validación creación

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_1)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_1)).exists).ok('No se encuentra el registro importado')
        .click(Selector('#gridTerceros .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_2)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_2)).exists).ok('No se encontró el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_TERCEROS);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_TERCEROS_ACTUALIZADO])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Validación actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_1)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_1)).exists).ok('No se encuentra el registro importado');
    await eliminarRegistroDesdeGrid(t, '#gridTerceros');
        .wait(3000)
        .click(Selector('#gridTerceros .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_2)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_2)).exists).ok('No se encuentra el registro importado');
    await eliminarRegistroDesdeGrid(t, '#gridTerceros');
        .wait(2000)
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>
*/

test('Prueba Archivos - Productos - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PRODUCTOS);
    await t
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PRODUCTOS])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la inserción

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO_CODIGO)
        .wait(3000)
        .expect((Selector('#gridProductos td').withText(PRODUCTO_CODIGO)).exists).ok('No se encuentra el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PRODUCTOS);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PRODUCTOS_ACTUALIZADO])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO_CODIGO)
        .wait(3000)
        .expect((Selector('#gridProductos td').withText(PRODUCTO_CODIGO)).exists).ok('No se encuentra el registro importado')
        //Se elimina
       // .click('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-delete dx"]')
       // .click(Selector('button').withText('Aceptar').nth(1))
       // .wait(1000)
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>
*/

test('Prueba Archivos - PlanContable - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
await t
        .click(Selector('#divpanelmaster').nth(1).find('.navbar-nav-link.dropdown-toggle').nth(1))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cambiar Periodo'))

        const modo = Selector('#TxtCambioPeriodo_ModoCon .dx-lookup-field').innerText
        if(modo==MODO_PGCA){
    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click(Selector('#BtnRuta1 div').withText('Elija archivo excel').nth(5))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_PCGA])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la creación

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(CUENTA_CODIGO)).exists).ok('No se encontró el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_PCGA_ACTUALIZADO])
        .click('#BtnArchivos_Generar .dx-icon.dx-icon-save')
         .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(DESCRIPCION_PLAN_PCGA)).exists).ok('No se encontró el archivo');
    await eliminarRegistroDesdeGrid(t, '#gridPlanContable');
        }else{
    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click(Selector('#BtnRuta1 div').withText('Elija archivo excel').nth(5))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_NIIF])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la creación

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(CUENTA_CODIGO)).exists).ok('No se encontró el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_NIIF_ACTUALIZADO])
        .click('#BtnArchivos_Generar .dx-icon.dx-icon-save')
         .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(DESCRIPCION_PLAN_NIIF)).exists).ok('No se encontró el archivo');
    await eliminarRegistroDesdeGrid(t, '#gridPlanContable');
        }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Archivos Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Archivos - Terceros - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_TERCEROS);
    await t
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload(Selector('#BtnRuta1 .dx-fileuploader-input'), [ARCHIVO_TERCEROS])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Validación creación

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_1)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_1)).exists).ok('No se encuentra el registro importado')
        .click(Selector('#gridTerceros .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_2)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_2)).exists).ok('No se encontró el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_TERCEROS);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_TERCEROS_ACTUALIZADO])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Validación actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await t
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_1)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_1)).exists).ok('No se encuentra el registro importado');
    await eliminarRegistroDesdeGrid(t, '#gridTerceros');
        .wait(3000)
        .click(Selector('#gridTerceros .dx-texteditor-input').nth(1))
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#gridTerceros .dx-texteditor-input').nth(1), TERCERO_CODIGO_2)
        .wait(3000)
        .expect((Selector('#gridTerceros td').withText(TERCERO_CODIGO_2)).exists).ok('No se encuentra el registro importado');
    await eliminarRegistroDesdeGrid(t, '#gridTerceros');
        .wait(2000)
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>
*/

test('Prueba Archivos - Productos - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PRODUCTOS);
    await t
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PRODUCTOS])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la inserción

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO_CODIGO)
        .wait(3000)
        .expect((Selector('#gridProductos td').withText(PRODUCTO_CODIGO)).exists).ok('No se encuentra el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PRODUCTOS);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PRODUCTOS_ACTUALIZADO])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Productos', 'productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO_CODIGO)
        .wait(3000)
        .expect((Selector('#gridProductos td').withText(PRODUCTO_CODIGO)).exists).ok('No se encuentra el registro importado')
        //Se elimina
       // .click('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-delete dx"]')
       // .click(Selector('button').withText('Aceptar').nth(1))
       // .wait(1000)
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>
*/

test('Prueba Archivos - PlanContable - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
await t
        .click(Selector('#divpanelmaster').nth(1).find('.navbar-nav-link.dropdown-toggle').nth(1))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cambiar Periodo'))

        const modo = Selector('#TxtCambioPeriodo_ModoCon .dx-lookup-field').innerText
        if(modo==MODO_PGCA){
    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click(Selector('#BtnRuta1 div').withText('Elija archivo excel').nth(5))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_PCGA])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la creación

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(CUENTA_CODIGO)).exists).ok('No se encontró el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_PCGA_ACTUALIZADO])
        .click('#BtnArchivos_Generar .dx-icon.dx-icon-save')
         .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(DESCRIPCION_PLAN_PCGA)).exists).ok('No se encontró el archivo');
    await eliminarRegistroDesdeGrid(t, '#gridPlanContable');
        }else{
    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click(Selector('#BtnRuta1 div').withText('Elija archivo excel').nth(5))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_NIIF])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la creación

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(CUENTA_CODIGO)).exists).ok('No se encontró el registro importado');
        //Se actualiza

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Archivos');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_PLAN_NIIF_ACTUALIZADO])
        .click('#BtnArchivos_Generar .dx-icon.dx-icon-save')
         .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1));
        //Se valida la actualización

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Plan de Cuentas');
    await t
        .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
        .wait(3000)
        .expect((Selector('#gridPlanContable td').withText(DESCRIPCION_PLAN_NIIF)).exists).ok('No se encontró el archivo');
    await eliminarRegistroDesdeGrid(t, '#gridPlanContable');
        }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
