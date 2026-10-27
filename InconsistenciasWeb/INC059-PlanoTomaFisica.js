import { Selector } from 'testcafe';

import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMovimientos360, ingresarAplicacion, cerrarSesion360 } from '../Funciones/HelpersHgi360Web.js';


fixture `Prueba Inventario - Toma Fisica testERP POS`
    .page (testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inventario-TomaFisica testerp (Llenar campos inventario de Bodega GENERAL manualmente)', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, testAdminConfig);
        await abrirMovimientos360(t, 'Inventario - toma física');
    await t
        .click(Selector('#TomaFisica_Bodega .dx-lookup-field'))
        .click(Selector('.dx-list-item').withText('GENERAL'))
        .wait(1500)
        .click(Selector('#BtnImportarTF span').withText('Importar'))
        .setFilesToUpload('#file_uploader .dx-fileuploader-input', ['ArchivosDePrueba\\\\TblFisico.xls'])
        .click(Selector('button').withText('Aceptar'))
        .expect(Selector('.swal2-content div').withText('Importación de archivo Excel exitosa.').visible).ok('No se muestra el mensaje de importación exitosa')
        .click(Selector('button').withText('Aceptar'))
        .click(Selector('#BtnEliminarTF span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar'))
        .wait(1500)
    //Se cierra sesión

    await cerrarSesion360(t);
});

/*
***************
*********************
********************
*********************
******************
****************
*/
