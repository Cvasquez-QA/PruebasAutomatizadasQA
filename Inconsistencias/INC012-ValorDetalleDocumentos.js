import { Selector } from 'testcafe';
import { abrirTransaccion, limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC12-ValorDetalleDocumentos', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
        await abrirMovimiento(t, 'Documentos');
    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, '07QA');
    await t
        .click(Selector('#Documento_Tercero .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'hgi')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('811021438 - HGI S.A.S - HGI S.A.S').nth(8))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(9000)
        //Inserta los detalles
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '010203')
        .pressKey('enter')//cantidad
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .pressKey('enter')//valorUnitario
        .pressKey('enter')
        .pressKey('enter')//guardar detalle
        .wait(1500)
        .typeText('#txtDocumento_Detalle_Producto_cursor_2', '03')
        .pressKey('enter')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_2', '1')
        .click('#txtDocumento_Detalle_Producto_cursor_2')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Producto_cursor_2', '010203')
        .click('#txtDocumento_Detalle_Boton_2 .dx-icon.dx-icon-check')
        .wait(3000)
        var desc1 = await Selector('#txtDocumento_Detalle_Descripcion_1').value;
        var desc2 = await Selector('#txtDocumento_Detalle_Descripcion_2').value;
        await t
        .expect(desc1).eql(desc2, 'no es el mismo producto')
        var valor1 = await Selector('#txtDocumento_Detalle_ValorUnitario_cursor_1').value;
        var valor2 = await Selector('#txtDocumento_Detalle_ValorUnitario_cursor_2').value;
        await t
        .expect(valor1).eql(valor2, 'no es el mismo valor')
        .wait(2000)
        .click(Selector('#BtnEliminarDocumento span').withText('Eliminar'))
        .click(Selector('button').withText('Aceptar').nth(1))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});