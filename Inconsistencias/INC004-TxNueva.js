import { Selector } from 'testcafe';
import { testPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js';
fixture `Inconsistencias Erp Web`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC04-TxNueva', async t => {
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testPosConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testPosConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testPosConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
     
        await abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(testPosConfig.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
         // Acceder al atributo aria-disabled
        const button = Selector('#PuntoDeVenta_BtnGuardarDocumento span')
        if( await button.hasAttribute('aria-disabled')){
            const ariaDisabledValue = await button.getAttribute('aria-disabled'); 
            await t.expect(ariaDisabledValue).eql('false', 'El botón GUARDAR está habilitado al estar en blanco el documento');
        }
        await t
        .click(Selector('#PuntoDeVenta_BtnNuevoDocumento span').withText('Nuevo'))
        .click(Selector('#PuntoDeVenta_BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#EncabezadoModal').nth(11).find('h5').withText('Observaciones del Documento').exists).ok('No salió el mensaje emergente con las observaciones del documento')
        .click(Selector('#EncabezadoModal').nth(11).find('.close'))
        .click('#PuntoDeVenta_BtnSalirFullPantalla .dx-icon.dx-icon-fullscreen')
        .wait(2000)
        .click(Selector('#PuntoDeVenta_BtnSalir span').withText('Salir'))
        .wait(2000)
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});