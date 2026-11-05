import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    btnConfirmarDialogo,
    cerrarPestana360,
    cerrarSesion360,
    esVisible,
    filtrarPor,
    ingresarAplicacion,
    parseValorNumerico,
    seleccionarOpcion,
    TX_DOCUMENTO,
    TX_DOCUMENTO_TEXTO
} from '../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Documentos (test.hgi360.com, AutAdmin): carga el último documento de la transacción 01FE,
// crea uno nuevo copiándolo con F8, valida que el total sea igual al del original y elimina la copia.
const TOTAL_DOCUMENTO = '#txtDocumento_Total .dx-texteditor-input';
const numeroDocumento = page => page.locator('#txtDocumento .dx-texteditor-input').first();
// El total se recalcula unos segundos después de cargar el documento
const ESPERA_TOTAL = 15000;

/** Espera hasta que el total cumpla la condición y lo devuelve. */
async function esperarTotal(page, cumple, mensaje) {
    const inicio = Date.now();
    let total = await parseValorNumerico(page, TOTAL_DOCUMENTO);
    while (!cumple(total) && Date.now() - inicio < ESPERA_TOTAL) {
        await page.waitForTimeout(500);
        total = await parseValorNumerico(page, TOTAL_DOCUMENTO);
    }
    expect(cumple(total), `${mensaje} (total actual: ${total})`).toBeTruthy();
    return total;
}

/**
 * Con el formulario en blanco (después de Nuevo o de Eliminar) la app valida el tercero por defecto y,
 * unos segundos después, abre "Validación tercero"; mientras está abierta bloquea F8 y los clics.
 */
async function cerrarValidacionTercero(page) {
    const cancelar = page.locator('#Documento_ModalValidacionDIAN_BtnCancelar').filter({ visible: true });
    if (await esVisible(cancelar, 8000)) {
        await cancelar.first().click();
        await expect(cancelar, 'No se cerró la validación del tercero').toHaveCount(0, { timeout: 10000 });
    }
}

async function nuevoDocumento(page) {
    await abrirMovimientos360(page, 'Documentos');
    await expect(page.locator('.erp-page-skeleton-toolbar').filter({ visible: true })).toHaveCount(0, { timeout: 20000 });
    await page.locator('#BtnNuevoDocumento .dx-button-content').first().click();
    await expect(page.locator('#Documento_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de nuevo documento')
        .toBeVisible({ timeout: 15000 });
    await page.locator('#Documento_Transaccion .dx-lookup-field').first().click();
    await filtrarPor(page, TX_DOCUMENTO);
    await seleccionarOpcion(page, TX_DOCUMENTO_TEXTO);
}

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);
    await nuevoDocumento(page);

    // Último documento de la transacción
    await page.locator('#lbl_documento_ultimo_documento').first().click();
    await page.keyboard.press('Enter');
    await expect(numeroDocumento(page), 'No cargó el último documento').not.toHaveValue('', { timeout: 15000 });
    const numeroOriginal = await numeroDocumento(page).inputValue();
    const totalOriginal = await esperarTotal(page, total => total > 0, `El último documento (${numeroOriginal}) no tiene total`);

    // Documento nuevo copiado del anterior con F8
    await page.locator('#BtnNuevoDocumento_btn').filter({ visible: true }).first().click();
    await expect(numeroDocumento(page), 'Nuevo no limpió el documento').toHaveValue('', { timeout: 15000 });
    await cerrarValidacionTercero(page);
    // Justo después de Nuevo el formulario todavía se está reiniciando y puede ignorar el F8: se reintenta
    const aceptarCarga = page.locator('#Btn_Documento_Carga_Aceptar_btn').filter({ visible: true });
    // Con el navegador visible, si la ventana no es la activa del sistema el campo no recibe el foco ni el F8
    await page.bringToFront();
    for (let intento = 0; intento < 3 && !await esVisible(aceptarCarga); intento++) {
        await numeroDocumento(page).click();
        await numeroDocumento(page).focus();
        await page.waitForTimeout(1500);
        await numeroDocumento(page).press('F8');
        await esVisible(aceptarCarga, 5000);
    }
    await expect(aceptarCarga.first(), 'F8 no abrió la carga del documento').toBeVisible();
    await aceptarCarga.first().click();
    await expect(btnConfirmarDialogo(page).first(), 'No apareció la confirmación de la carga').toBeVisible({ timeout: 15000 });
    await btnConfirmarDialogo(page).first().click();

    await expect(numeroDocumento(page), 'El documento copiado no quedó con número').not.toHaveValue('', { timeout: 15000 });
    const numeroCopia = await numeroDocumento(page).inputValue();
    // Nunca eliminar el documento original
    expect(numeroCopia, 'El documento cargado es el original, no una copia').not.toBe(numeroOriginal);
    await esperarTotal(page, total => total === totalOriginal,
        `El total de la copia (${numeroCopia}) no es igual al del original (${numeroOriginal}: ${totalOriginal})`);

    // Eliminar la copia
    await page.locator('#BtnEliminarDocumento_btn').filter({ visible: true }).first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await expect(numeroDocumento(page), `No se eliminó la copia ${numeroCopia}`).toHaveValue('', { timeout: 15000 });
    await cerrarValidacionTercero(page);

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Copiar Último Documento - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Copiar último documento con F8 y comparar total - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig);
    });
});
