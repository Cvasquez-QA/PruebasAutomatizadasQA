import { Selector } from 'testcafe';
import { miContableConfig, testContableConfig, testHappgiContableConfig, devContableConfig, miHappgiContableConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe, abrirMaestros360, ingresarAplicacion, cerrarSesion360 } from '../Funciones/HelpersHgi360Web.js';
//import { miHappgiContableConfig } from '../ParametrosPruebas/ParametrosPruebas.js'; 
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

/*

*/

fixture `Prueba INC048 testERP Contable`
    .page (testContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes testerp Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, testContableConfig);
    //Se ingresa al maestro de herramientas
        await abrirMaestros360(t, 'Comprobantes');
    await t
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        //VALIDACION ENCABEZADO
        //Validación de los campos del origen
        .click('#gridParametrosComprobantesEncabezado .dx-icon.dx-icon-add')
        .wait(2000)
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_FpagoDian div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cartera .dx-texteditor-input').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(3000)        
        .click(Selector('#BtnCancelarComprobanteFormulario div').withText('Cerrar'))
        //VALIDACION DETALLE
        .click('#tabs_documento_Detalle')
        .click('#gridParametrosComprobantesDetalle .dx-icon.dx-icon-add')
        //Validación de los campos del origen
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_iva div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_impuesto1 div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_retfte div').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(2000)
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
fixture `Prueba INC048 MIERP Contable`
    .page (miContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes mierp Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, miContableConfig);
    //Se ingresa al maestro de herramientas
        await abrirMaestros360(t, 'Comprobantes');
    await t
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        //VALIDACION ENCABEZADO
        //Validación de los campos del origen
        .click('#gridParametrosComprobantesEncabezado .dx-icon.dx-icon-add')
        .wait(2000)
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_FpagoDian div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cartera .dx-texteditor-input').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(3000)        
        .click(Selector('#BtnCancelarComprobanteFormulario div').withText('Cerrar'))
        //VALIDACION DETALLE
        .click('#tabs_documento_Detalle')
        .click('#gridParametrosComprobantesDetalle .dx-icon.dx-icon-add')
        //Validación de los campos del origen
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_iva div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_impuesto1 div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_retfte div').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(2000)
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
fixture `Prueba INC048 devERP Contable`
    .page (devContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes deverp Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, devContableConfig);
    //Se ingresa al maestro de herramientas
        await abrirMaestros360(t, 'Comprobantes');
    await t
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        //VALIDACION ENCABEZADO
        //Validación de los campos del origen
        .click('#gridParametrosComprobantesEncabezado .dx-icon.dx-icon-add')
        .wait(2000)
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_FpagoDian div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cartera .dx-texteditor-input').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(3000)        
        .click(Selector('#BtnCancelarComprobanteFormulario div').withText('Cerrar'))
        //VALIDACION DETALLE
        .click('#tabs_documento_Detalle')
        .click('#gridParametrosComprobantesDetalle .dx-icon.dx-icon-add')
        //Validación de los campos del origen
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_iva div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_impuesto1 div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_retfte div').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(2000)
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
fixture `Prueba INC048 testhappgi Contable`
    .page (testHappgiContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes testhappgi Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, testHappgiContableConfig);
    //Se ingresa al maestro de herramientas
        await abrirMaestros360(t, 'Comprobantes');
    await t
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        //VALIDACION ENCABEZADO
        //Validación de los campos del origen
        .click('#gridParametrosComprobantesEncabezado .dx-icon.dx-icon-add')
        .wait(2000)
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_FpagoDian div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cartera .dx-texteditor-input').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(3000)        
        .click(Selector('#BtnCancelarComprobanteFormulario div').withText('Cerrar'))
        //VALIDACION DETALLE
        .click('#tabs_documento_Detalle')
        .click('#gridParametrosComprobantesDetalle .dx-icon.dx-icon-add')
        //Validación de los campos del origen
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_iva div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_impuesto1 div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_retfte div').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(2000)
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
fixture `Prueba INC048 mihappgi Contable`
    .page (miHappgiContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC048 prueba CamposComprobantes mihappgi Contable', async t => {
  //Se ingresa al aplicativo
    await ingresarAplicacion(t, miHappgiContableConfig);
    //Se ingresa al maestro de herramientas
        await abrirMaestros360(t, 'Comprobantes');
    await t
        .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(1500)
        //VALIDACION ENCABEZADO
        //Validación de los campos del origen
        .click('#gridParametrosComprobantesEncabezado .dx-icon.dx-icon-add')
        .wait(2000)
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_FpagoDian div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cartera .dx-texteditor-input').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(3000)        
        .click(Selector('#BtnCancelarComprobanteFormulario div').withText('Cerrar'))
        //VALIDACION DETALLE
        .click('#tabs_documento_Detalle')
        .click('#gridParametrosComprobantesDetalle .dx-icon.dx-icon-add')
        //Validación de los campos del origen
        .expect(Selector('#txtMaestroGestionFormulario_Valor .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TipoTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Resp05 .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_RegimenTercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Par1Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_TarAct div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCostoF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SucursalF div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Vendedor div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_clase div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_iva div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_impuesto1 div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_retfte div').visible).ok('no está el campo visible')
        //Validación campos del destino
        .expect(Selector('#txtMaestroGestionFormulario_Naturaleza div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Porcentaje .dx-texteditor-input').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Cuenta div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CuentaEQ div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Sucursal div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_CCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_SubCCosto div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Documento div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_DocRef .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Tercero2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Base2 .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Detalle .dx-lookup-field').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Agrupar div').visible).ok('no está el campo visible')
        .expect(Selector('#txtMaestroGestionFormulario_Grupo .dx-texteditor-input').visible).ok('no está el campo visible')
        .wait(2000)
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

