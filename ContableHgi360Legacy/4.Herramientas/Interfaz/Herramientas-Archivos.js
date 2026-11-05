import { Selector } from 'testcafe';
import { abrirHerramientas, abrirMaestros360, cerrarPestana360, cerrarSesion360, eliminarRegistroDesdeGrid, ingresarAplicacion, seleccionarOpcion, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

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

const filtroTerceros = Selector('#gridTerceros .dx-texteditor-input').nth(1);
const btnAceptar = Selector('button').withText('Aceptar');
const iconoExito = Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]');

async function importarArchivo(t, tabla, archivo, actualizar = false) {
    await abrirHerramientas(t, 'ARCHIVOS');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, tabla);
    
    if (actualizar) {
        await t.click('#TxtArchivos_Actualizar .dx-checkbox-icon');
    }

    await t
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [archivo])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect(iconoExito.exists)
        .ok(actualizar
            ? 'Ocurrió un error en el procesamiento del archivo plano para la actualizacion'
            : 'Ocurrió un error en el procesamiento del archivo plano')
        .click(btnAceptar)
        .expect(Selector('#swal2-content').innerText)
        .eql(
            MENSAJE_IMPORTACION,
            actualizar
                ? 'Ocurrió un error en la descarga del reporte de la actualizacion'
                : 'Ocurrió un error en la descarga del reporte'
        )
        .click(btnAceptar);
}

async function filtrarYValidarTercero(t, codigo) {
    await t
        .click(filtroTerceros)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroTerceros, codigo)
        .wait(3000)
        .expect(Selector('#gridTerceros td').withText(codigo).exists)
        .ok(`No se encuentra el registro importado ${codigo}`);
}

async function ejecutarPruebaTerceros(t, config, ingresar) {
    await ingresar(t, config);

    await importarArchivo(t, TABLA_TERCEROS, ARCHIVO_TERCEROS);
    await cerrarPestana360(t);

    await abrirMaestros360(t, 'Terceros');
    await filtrarYValidarTercero(t, TERCERO_CODIGO_1);
    await filtrarYValidarTercero(t, TERCERO_CODIGO_2);
    await cerrarPestana360(t);

    await importarArchivo(t, TABLA_TERCEROS, ARCHIVO_TERCEROS_ACTUALIZADO, true);
    await cerrarPestana360(t);

    await abrirMaestros360(t, 'Terceros');
    await filtrarYValidarTercero(t, TERCERO_CODIGO_1);
    await eliminarRegistroDesdeGrid(t, '#gridTerceros');
    await t.wait(3000);
    await filtrarYValidarTercero(t, TERCERO_CODIGO_2);
    await eliminarRegistroDesdeGrid(t, '#gridTerceros');
    await t.wait(2000);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

async function ejecutarPruebaProductos(t, config, ingresar) {
    await ingresar(t, config);

    await importarArchivo(t, TABLA_PRODUCTOS, ARCHIVO_PRODUCTOS);
    await cerrarPestana360(t);

    await abrirMaestros360(t, 'Productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridProductos td').withText(PRODUCTO_CODIGO).exists)
        .ok('No se encuentra el registro importado');
    await cerrarPestana360(t);

    await importarArchivo(t, TABLA_PRODUCTOS, ARCHIVO_PRODUCTOS_ACTUALIZADO, true);
    await cerrarPestana360(t);

    await abrirMaestros360(t, 'Productos');
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridProductos td').withText(PRODUCTO_CODIGO).exists)
        .ok('No se encuentra el registro importado');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

async function importarPlanContable(t, archivo, actualizar = false, usarIconoSave = false) {
    await abrirHerramientas(t, 'ARCHIVOS');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_PLAN_CONTABLE);
    
    if (actualizar) {
        await t.click('#TxtArchivos_Actualizar .dx-checkbox-icon');
    }

    await t
        .click(Selector('#BtnRuta1 div').withText('Elija archivo excel').nth(5))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [archivo]);

    if (usarIconoSave) {
        await t.click('#BtnArchivos_Generar .dx-icon.dx-icon-save');
    } else {
        await t.click(Selector('#BtnArchivos_Generar span').withText('Generar'));
    }

    await t
        .expect(iconoExito.exists)
        .ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(btnAceptar)
        .expect(Selector('#swal2-content').innerText)
        .eql(MENSAJE_IMPORTACION, 'Ocurrió un error en la descarga del reporte')
        .click(btnAceptar);
}

async function ejecutarPruebaPlanContable(t, config, ingresar) {
    await ingresar(t, config);
    await t
        .click(Selector('#divpanelmaster').nth(1).find('.navbar-nav-link.dropdown-toggle').nth(1))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cambiar Periodo'));

    const modo = await Selector('#TxtCambioPeriodo_ModoCon .dx-lookup-field').innerText;

    if (modo === MODO_PGCA) {
        await cerrarPestana360(t);
        await importarPlanContable(t, ARCHIVO_PLAN_PCGA);
        await cerrarPestana360(t);

        await abrirMaestros360(t, 'Plan De Cuentas');
        await t
            .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
            .wait(3000)
            .expect(Selector('#gridPlanContable td').withText(CUENTA_CODIGO).exists)
            .ok('No se encontró el registro importado');
        await cerrarPestana360(t);

        await importarPlanContable(t, ARCHIVO_PLAN_PCGA_ACTUALIZADO, true, true);
        await cerrarPestana360(t);

        await abrirMaestros360(t, 'Plan De Cuentas');
        await t
            .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
            .wait(3000)
            .expect(Selector('#gridPlanContable td').withText(DESCRIPCION_PLAN_PCGA).exists)
            .ok('No se encontró el archivo');
        await eliminarRegistroDesdeGrid(t, '#gridPlanContable');
    } else {
        await cerrarPestana360(t);
        await importarPlanContable(t, ARCHIVO_PLAN_NIIF);
        await cerrarPestana360(t);

        await abrirMaestros360(t, 'Plan De Cuentas');
        await t
            .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
            .wait(3000)
            .expect(Selector('#gridPlanContable td').withText(CUENTA_CODIGO).exists)
            .ok('No se encontró el registro importado');
        await cerrarPestana360(t);

        await importarPlanContable(t, ARCHIVO_PLAN_NIIF_ACTUALIZADO, true, true);
        await cerrarPestana360(t);

        await abrirMaestros360(t, 'Plan De Cuentas');
        await t
            .typeText('#gridPlanContable .dx-texteditor-input', CUENTA_CODIGO)
            .wait(3000)
            .expect(Selector('#gridPlanContable td').withText(DESCRIPCION_PLAN_NIIF).exists)
            .ok('No se encontró el archivo');
        await eliminarRegistroDesdeGrid(t, '#gridPlanContable');
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Herramientas-Archivos - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Archivos - Terceros - Mi ERP', async t => {
    await ejecutarPruebaTerceros(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Archivos - Productos - Mi ERP', async t => {
    await ejecutarPruebaProductos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Archivos - PlanContable - Mi ERP', async t => {
    await ejecutarPruebaPlanContable(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-Archivos - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Archivos - Terceros - Test Contable', async t => {
    await ejecutarPruebaTerceros(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Archivos - Productos - Test Contable', async t => {
    await ejecutarPruebaProductos(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Archivos - PlanContable - Test Contable', async t => {
    await ejecutarPruebaPlanContable(t, testContableConfig, ingresarAplicacion);
});
