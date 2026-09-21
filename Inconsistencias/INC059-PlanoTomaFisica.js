import { Selector } from 'testcafe';

import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js'; 


fixture `Prueba Inventario - Toma Fisica testERP POS`
    .page (testAdminConfig.pagina)


test('Prueba Inventario-TomaFisica testerp (Llenar campos inventario de Bodega GENERAL manualmente)', async t => {
     await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('span').withText('INVENTARIO - TOMA FÍSICA'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
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
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
***************
*********************
********************
*********************
******************
****************
*/
