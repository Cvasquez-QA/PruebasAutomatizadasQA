import { Selector } from 'testcafe';
import { limpiarCacheChromeTestCafe, abrirMaestros360, ingresarAplicacion, cerrarSesion360 } from '../Funciones/HelpersHgi360Web.js';

fixture `Prueba INC076 Mensaje permisos testERP Contable`
    .page ('https://test.hgi360.com')
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC076 Mensaje permisos testERP Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, { empresa: '8902', usuario: 'activosfijos', clave: '123' });
    //Se ingresa al maestro de herramientas
        await abrirMaestros360(t, 'Activos');
    await t
        .expect(Selector('.swal2-content div').withText('El usuario no tiene permisos para la ejecución').visible).notOk('salió el mensaje de error de permisos')
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        .expect(Selector('.swal2-content div').withText('El usuario no tiene permisos para la ejecución').visible).notOk('salió el mensaje de error de permisos')
        //Se cierra sesión

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
