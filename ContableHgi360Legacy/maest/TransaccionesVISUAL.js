import { Selector } from 'testcafe';
import { testAdminConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 
import { eliminarRegistroDesdeGrid } from '../../Funciones/HelpersHgi360Legacy.js';


/*
***************************
*********************************
*****************************************
*********************
*/
fixture `Prueba Transacciones testERP Admin`
    .page (testAdminConfig.pagina)

test('Prueba Transaccion testerp', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000)
   
    //Se ingresa al maestro de Transaccion
        .click(Selector('a').withText('Maestros'))
        .click(Selector('span').withText('TRANSACCIONES'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
     //Se valida si está creado el registro y en caso de que si, lo elimina
        .typeText(Selector('#gridTransacciones .dx-texteditor-input'), 'mitransaccion123')
        .wait(2000)
        if(await Selector('#gridTransacciones td').withText('mitransaccion123').exists){
    await eliminarRegistroDesdeGrid(t, '#gridTransacciones');
    await t
            .wait(3000)
        }
        await t
        .click('#gridTransacciones .dx-icon.dx-icon-add')
        .wait(1500)
        .typeText('#txtIntIdTransaccion', 'mitransaccion123')
        .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', 'midesctransaccion')
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        //.click(Selector('button').withText('Aceptar'))
    //Se valida la creación
        .wait(2000)
        .expect(Selector('#gridTransacciones td').withText('mitransaccion123').exists).ok()
    //Se edita
        .click(Selector('#gridTransacciones [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        .click('#TxtTransaccion_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', 'minuevadesc')
        //.expect(Selector('#txtTransaccion_Tipo .dx-texteditor-input').withText('Documentos').exists).ok()
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        //.click(Selector('button').withText('Aceptar'))
        .wait(2000)
    //Se elimina la Transaccion
        .expect(Selector('#gridTransacciones td').withText('mitransaccion123').exists).ok();
    await eliminarRegistroDesdeGrid(t, '#gridTransacciones');
    //Se cierra sesión
    await t
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});