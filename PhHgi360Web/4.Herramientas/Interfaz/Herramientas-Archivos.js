import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    ingresarAplicacion,
    seleccionarOpcion,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroPh360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const TABLA_TERCEROS = 'Terceros';
const TABLA_PRODUCTOS = 'Productos';
const ARCHIVO_TERCEROS = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraTerceros.xls';
const ARCHIVO_TERCEROS_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraTercerosActualizado.xls';
const TERCERO_CODIGO_1 = '112233';
const TERCERO_CODIGO_2 = '123123';
const ARCHIVO_PRODUCTOS = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraArchivoPlanoProductos.xls';
const ARCHIVO_PRODUCTOS_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\PruebaEstructuraArchivoPlanoProductosActualizado.xls';
const PRODUCTO_CODIGO = '131211';
const MENSAJE_IMPORTACION = 'El archivo que se descargó contiene el resultado de la importación.';

const filtroTerceros = Selector('#gridTerceros .dx-texteditor-input').nth(1);
const btnAceptar = Selector('button').withText('Aceptar');
const iconoExito = Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]');

async function importarArchivo(t, tabla, archivo, actualizar = false) {
    await abrirHerramientas360(t, 'Archivos');
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

fixture `Prueba Archivos - Test Hgi360`
    .page(testPhConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Archivos Terceros - Test Hgi360', async t => {
    await ejecutarPruebaTerceros(t, testPhConfig, ingresarAplicacion);
});

test('Prueba Archivos Productos - Test Hgi360', async t => {
    await ejecutarPruebaProductos(t, testPhConfig, ingresarAplicacion);
});

