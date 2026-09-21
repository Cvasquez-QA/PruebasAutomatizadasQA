import { Selector } from 'testcafe';
import { miContableConfig } from '../../ParametrosPruebas/MiErpContable8787.js'; 
import { testContableConfig } from '../../ParametrosPruebas/TestErpContable8902.js'; 

    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan
import { testHappgiContableConfig } from '../../ParametrosPruebas/TestHappgiContable8902.js'; 
import { devContableConfig } from '../../ParametrosPruebas/DevErpContable8906.js'; 

import { miHappgiContableConfig } from '../../ParametrosPruebas/MiHappgiContable8893.js';


/*

*/
fixture `Prueba INC054 testERP Contable`
    .page (testContableConfig.pagina)

test('Prueba INC054 prueba Check Detalle Extracto testerp Contable', async t => {
     await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testContableConfig.empresa)  
        .wait(1000)  
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testContableConfig.usuario)
        .wait(1000)  
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testContableConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    //Se ingresa al maestro de herramientas 
        .click(Selector('a').withText('Utilitarios'))
        .wait(8000)
        .click(Selector('span').withExactText('CONCILIACIÓN'))
        .wait(8000)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .expect(Selector('#txtConciliacion_DetalleExtracto span').withText('Detalle Extracto').visible).ok('No se encontró el parámetro')
        //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
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

test('Prueba INC054 prueba Check Detalle Extracto testHappgi Contable', async t => {
     await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testHappgiContableConfig.empresa)  
        .wait(1000)  
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testHappgiContableConfig.usuario)
        .wait(1000)  
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testHappgiContableConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    //Se ingresa al maestro de herramientas 
        .click(Selector('a').withText('Utilitarios'))
        .wait(8000)
        .expect(Selector('span').withExactText('CONCILIACIÓN').visible).notOk('ESTÁ EL MENÚ DE CONCILIACION')
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
***************
****************
******************
********************
********************
************
*/

fixture `Prueba INC054 hgi360 Contable`
    .page (miContableConfig.pagina)

test('Prueba INC054 prueba Check Detalle Extracto mierp Contable', async t => {
     await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', miContableConfig.empresa)  
        .wait(1000)  
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', miContableConfig.usuario)
        .wait(1000)  
        .typeText('#TxtUsuarioClave .dx-texteditor-input', miContableConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    //Se ingresa al maestro de herramientas 
        .click(Selector('a').withText('Utilitarios'))
        .wait(8000)
        .click(Selector('span').withExactText('CONCILIACIÓN'))
        .wait(8000)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .expect(Selector('#txtConciliacion_DetalleExtracto span').withText('Detalle Extracto').visible).ok('No se encontró el parámetro')
        //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
***************
****************
******************
********************
********************
************
*/
fixture `Prueba INC054 deverp Contable`
    .page (devContableConfig.pagina)

test('Prueba INC054 prueba Check Detalle Extracto deverp Contable', async t => {
     await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', devContableConfig.empresa)  
        .wait(1000)  
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', devContableConfig.usuario)
        .wait(1000)  
        .typeText('#TxtUsuarioClave .dx-texteditor-input', devContableConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
    //Se ingresa al maestro de herramientas 
        .click(Selector('a').withText('Utilitarios'))
        .wait(8000)
        .click(Selector('span').withExactText('CONCILIACIÓN'))
        .wait(8000)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .expect(Selector('#txtConciliacion_DetalleExtracto span').withText('Detalle Extracto').visible).ok('No se encontró el parámetro')
        //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
***************
****************
******************
********************
********************
************
*/