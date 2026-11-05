import { Selector } from 'testcafe';
import { miContableConfig, testContableConfig, testHappgiContableConfig, devContableConfig, miHappgiContableConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirUtilitarios360, ingresarAplicacion, cerrarSesion360, cerrarPestana360 } from '../Funciones/HelpersHgi360Web.js';
import { cerrarSesion as cerrarSesionHappgi } from '../Funciones/HelpersHappgi.js';

    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

/*

*/
fixture `Prueba INC054 testERP Contable`
    .page (testContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC054 prueba Check Detalle Extracto testerp Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, testContableConfig);
    await abrirUtilitarios360(t, 'Conciliación');
    await t
        .expect(Selector('#txtConciliacion_DetalleExtracto').withText('Detalle Extracto').with({ timeout: 20000 }).visible)
        .ok('No se encontró el check "Detalle Extracto" en Conciliación');
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

/*
***************
****************
******************
********************
********************
************
*/

fixture `Prueba INC054 testHappgi Contable`
    .page (testHappgiContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC054 prueba Check Detalle Extracto testHappgi Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, testHappgiContableConfig);
    await t
    //Se ingresa al maestro de herramientas 
        .click(Selector('a').withText('Utilitarios'))
        .wait(8000)
        .expect(Selector('span').withExactText('Conciliación').visible).notOk('ESTÁ EL MENÚ DE CONCILIACION')
    //Se cierra sesión (Happgi: menú anterior, no el del ERP React)
    await cerrarSesionHappgi(t);
});

/*
***************
****************
******************
********************
********************
************
*/

// [02-nov-2026] Comentado: solo se corren las pruebas en ambientes de test (test.hgi360.com / test.happgi.com).
// fixture `Prueba INC054 hgi360 Contable`
//     .page (miContableConfig.pagina)
//     .afterEach(async t => {
//         await limpiarCacheChromeTestCafe(t);
//     });

// test('Prueba INC054 prueba Check Detalle Extracto mierp Contable', async t => {
//   //Se ingresa al aplicativo
//     await ingresarAplicacion(t, miContableConfig);
//     //Se ingresa al maestro de herramientas
//         await abrirUtilitarios360(t, 'Conciliación');
//     await t
//         .expect(Selector('#txtConciliacion_DetalleExtracto span').withText('Detalle Extracto').visible).ok('No se encontró el parámetro')
//         //Se cierra sesión

//     await cerrarSesion360(t);
// });

/*
***************
****************
******************
********************
********************
************
*/
// [02-nov-2026] Comentado: solo se corren las pruebas en ambientes de test (test.hgi360.com / test.happgi.com).
// fixture `Prueba INC054 deverp Contable`
//     .page (devContableConfig.pagina)
//     .afterEach(async t => {
//         await limpiarCacheChromeTestCafe(t);
//     });

// test('Prueba INC054 prueba Check Detalle Extracto deverp Contable', async t => {
//   //Se ingresa al aplicativo
//     await ingresarAplicacion(t, devContableConfig);
//     //Se ingresa al maestro de herramientas
//         await abrirUtilitarios360(t, 'Conciliación');
//     await t
//         .expect(Selector('#txtConciliacion_DetalleExtracto span').withText('Detalle Extracto').visible).ok('No se encontró el parámetro')
//         //Se cierra sesión

//     await cerrarSesion360(t);
// });

/*
***************
****************
******************
********************
********************
************
*/