import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMaestros } from '../Funciones/HelpersHgi360Legacy.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC07-TxDuplicada', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
        await abrirMaestros(t, 'Transacciones');
    await t
        .click('#gridTransacciones .dx-icon.dx-icon-add')
        .typeText('#txtIntIdTransaccion', '01')
        .typeText('#TxtTransaccion_Descripcion .dx-texteditor-input', 'pruebatxduplicada')
        .click(Selector('#BtnGuardarTransaccion span').withText('Guardar'))
        .expect(Selector('.swal2-content div').withText('Ya existe un registro con el código ingresado.').exists).ok('No salio el mensaje emergente diciendo que ya existe esa transacción')
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});