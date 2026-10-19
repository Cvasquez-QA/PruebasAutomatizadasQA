import { test, expect } from '@playwright/test';
import {
    ingresarAplicacion,
    abrirMaestros360,
    aceptarValidacionesSiExisten,
    confirmarProceso,
    cerrarSesion360,
    cerrarPestana360,
    nuevoRegistroGrid360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaSiExiste360,
    escribirFecha360,
    escribir,
    parseValorNumerico
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

test.describe('INC0000 Grabacion Prueba', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`https://mi.hgi360.com/`);
    });

test('GRABACION', async ({ page }) => {

});



test('New Test', async ({ page }) => {
    
});




test('New Test 1', async ({ page }) => {
    await escribir(page.locator('#TxtEmpresaIdentificacion .dx-texteditor-input'), '8902', { reemplazar: false });
    await page.keyboard.press('Enter');
    await escribir(page.locator('#TxtUsuarioCodigo .dx-texteditor-input'), 'cvasq', { reemplazar: false });
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await escribir(page.locator('#TxtUsuarioCodigo .dx-texteditor-input'), 'admin', { reemplazar: false });
    await page.keyboard.press('Enter');
    await page.keyboard.press('CapsLock');
    await escribir(page.locator('#TxtUsuarioClave .dx-texteditor-input'), 'C', { reemplazar: false });
    await page.keyboard.press('CapsLock');
    await escribir(page.locator('#TxtUsuarioClave .dx-texteditor-input'), 'alidad2026*', { reemplazar: false });
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.locator('header a').filter({ hasText: 'Administrativo' }).first().click();
    await page.locator('header span').filter({ hasText: 'Contable' }).nth(1).click();
});



test('New Test 2', async ({ page }) => {
    await page.locator('#ErpSidebarModulos span').filter({ hasText: 'Movimientos' }).first().click();
    await page.locator('#ErpMenuCardGrid span').filter({ hasText: 'Documentos' }).first().click();
    await page.locator('#BtnNuevoDocumento .dx-icon.dx-icon-add').first().click();
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await escribir(page.locator('#dx-5458c3d0-522c-4b1a-5203-b14d29509f95 .dx-texteditor-input'), '01fe', { reemplazar: false });
    await page.locator('#dx-2ebceb13-2ced-1451-e5ad-6d39bdfb583e div').filter({ hasText: '01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA' }).first().click();
    await page.locator('#BtnGuardarDocumento_btn span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('#Documento_Dependencia .dx-texteditor-input').first().click();
    await page.locator('#Documento_Dependencia .dx-texteditor-input').first().click();
    await page.locator('#Documento_Buscar_Dependencia .dx-icon.dx-icon-search').first().click();
    await page.locator('#Documento_Buscar_Dependencia .dx-icon.dx-icon-search').first().click();
    await page.locator('#dx-d40a7fa9-53fe-84b2-26e6-4967b9cb4cfb td').filter({ hasText: '0' }).first().click();
    await page.locator('#btnSeleccionarDependencias_documentos div').filter({ hasText: 'Seleccionar' }).first().click();
    await page.locator('#TabCtab_1792074976853_zyzec4hdv button').filter({ hasText: 'Reintentar' }).first().click();
    await page.locator('#BtnNuevoDocumento .dx-button-content').first().click();
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await escribir(page.locator('#dx-2a77acc6-5ac4-5969-642b-401a14a8f8af .dx-texteditor-input'), '01fe', { reemplazar: false });
    await page.locator('#dx-3eb91164-8c85-190d-385d-b581ed15c8ad div').filter({ hasText: '01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA' }).first().click();
    await escribir(page.locator('#Documento_Dependencia .dx-texteditor-input'), '0', { reemplazar: false });
    await page.locator('#BtnGuardarDocumento_btn div').filter({ hasText: 'Guardar' }).first().click();
    await escribir(page.locator('#txtDocumento_Detalle_Producto_cursor_1'), '010203', { reemplazar: false });
    await page.keyboard.press('Enter');
    await page.locator('#txtDocumento_Detalle_Cantidad_cursor_1').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await escribir(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), '1', { reemplazar: false });
    await page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1').first().click();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Control+A');
    await escribir(page.locator('#txtDocumento_Detalle_ValorUnitario_cursor_1'), '100', { reemplazar: false });
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save').first().click();
    await page.waitForTimeout(1000);
   
    let totalDoc = await parseValorNumerico(page, '#txtDocumento_Total .dx-texteditor-input');

    expect(totalDoc >= 100).toBeTruthy();
    await page.locator('#dx-d5eb838c-19db-fe60-6349-5c8c58348e21 .erp-grid-action-glyph').first().click();
    await page.locator('#txtDocumento_Detalle_Cantidad_cursor_1').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
        
    await escribir(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), '2', { reemplazar: false });
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save').first().click();

        totalDoc = await parseValorNumerico(page, '#txtDocumento_Total .dx-texteditor-input');

        expect(totalDoc >= 200).toBeTruthy();
    await page.locator('#dx-eea26f3a-288d-42b8-f5ba-79811b54a5e1 .erp-grid-action-glyph').nth(1).click();
    await page.locator('button').filter({ hasText: 'Eliminar' }).first().click();
    expect(await parseValorNumerico(page, '#txtDocumento_Total .dx-texteditor-input')).toEqual(0);

    await page.locator('#Documento_Tercero div').filter({ hasText: '811021438 - HGI S.A.S' }).nth(1).click();
    await escribir(page.locator('#dx-740921a4-1d58-633a-286f-5ee190753fe0 .dx-texteditor-input'), '1000099598', { reemplazar: false });
    await page.locator('#dx-61566ed5-e723-933e-1c3e-cff3bc0c4a0d div').filter({ hasText: '1000099598 - Vasquez Suarez Camilo' }).first().click();
    await page.locator('#BtnGuardarDocumento_btn span').filter({ hasText: 'Guardar' }).first().click();
    await page.locator('#txtDocumento .dx-texteditor-input').first().click();
        
    await page.keyboard.press('Enter');
    await expect(page.locator('#Documento_Tercero div').filter({ hasText: '1000099598 - Vasquez Suarez Camilo' }).first()).toBeVisible();
    
    await page.locator('#BtnEliminarDocumento_btn span').filter({ hasText: 'Eliminar' }).first().click();
    await page.locator('button').filter({ hasText: 'Eliminar' }).first().click();
});

test('New Test 3', async ({ page }) => {
      
    await page.locator('#ErpSidebarModulos a').filter({ hasText: 'Movimientos' }).first().click();
    await page.locator('#ErpMenuCardGrid span').filter({ hasText: 'Documentos' }).first().click();
    await page.locator('#BtnNuevoDocumento .dx-button-content').first().click();
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await escribir(page.locator('#dx-aece67a6-c3a7-e3c7-8118-6318ab37aa79 .dx-texteditor-input'), '01fe', { reemplazar: false });
    await page.locator('#dx-cd2aeb85-98dc-0cef-b17b-eb1069b5ada2 div').filter({ hasText: '01FE - PRUEBA FACTURA DE VENTA ELECTRONICA QA' }).first().click();
    await page.locator('#lbl_documento_ultimo_documento').first().click();
    await page.keyboard.press('Enter');
    await page.locator('#dx-eea26f3a-288d-42b8-f5ba-79811b54a5e1 .erp-grid-action-glyph').first().click();
    await page.locator('#txtDocumento_Detalle_Cantidad_cursor_1').first().click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
        
    await escribir(page.locator('#txtDocumento_Detalle_Cantidad_cursor_1'), '2', { reemplazar: false });
    await page.locator('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-save').first().click();
    await page.locator('#txtDocumento_Total .dx-texteditor-input').first().dblclick();
    await page.locator('#dx-eea26f3a-288d-42b8-f5ba-79811b54a5e1 .erp-grid-action-glyph').nth(1).click();
    await page.locator('button').filter({ hasText: 'Eliminar' }).first().click();
      
});
});
