import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    parseValorNumerico,
    TERCERO,
    textoExacto,
    existe,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Causaciones (test.hgi360.com, empresa 8902)
 *  1. Crea una causación "09 - CAJA MENOR" al tercero 1000099598, clase 01, sucursal 0 - GENERAL,
 *     con una referencia única para no chocar con "El Documento Referencia ... ya existe".
 *  2. Agrega una línea con la cuenta 11050501 por 1000 y la graba.
 *  3. Vuelve a la consulta, carga la causación por número y valida el total.
 *  4. La elimina.
 *
 * Selectores validados contra la versión React de test.hgi360.com.
 */

const TX_CAUSACION = '09';
const CLASE = '01';
const SUCURSAL = '0';
const FILTRO_SUCURSAL = 'GENERAL';
const CUENTA = '11050501';
const DETALLE = 'pruebaCausacion';
const VALOR = '1000';

const btnConfirmarDialogo = page => page.locator('button.swal2-confirm').filter({ visible: true });
const esqueleto = page => page.locator('.erp-page-skeleton-toolbar').filter({ visible: true });
const toast = (page, texto) => page.locator('.erp-toast').filter({ hasText: texto }).filter({ visible: true });
const numeroCausacion = page => page.locator('#txtDocumentoCausacion .dx-texteditor-input');
const totalCausacion = '#txtDocumentoCausacion_Total .dx-texteditor-input';

/** Opción visible de un lookup cuyo texto empieza por "<codigo> -". */
const opcionCodigo = (page, codigo) => page.locator('.dx-overlay-content')
    .filter({ visible: true })
    .locator('.dx-item-content')
    .filter({ hasText: new RegExp(`^\\s*${codigo} -`) });

async function elegirEnLookup(page, lookup, filtro, codigo) {
    await page.locator(`${lookup} .dx-lookup-field`).first().click();
    await filtrarPor(page, filtro);
    await expect(opcionCodigo(page, codigo).first(), `No apareció la opción "${codigo} - ..." en ${lookup}`)
        .toBeAttached({ timeout: 10000 });
    await opcionCodigo(page, codigo).first().click();
}

/** Referencia única por ejecución (p. ej. QA1015172200). */
const referenciaUnica = () => `QA${String(Date.now()).slice(-10)}`;

async function nuevaCausacion(page) {
    await page.locator('#BtnNuevoCausacionConsulta').first().click();
    await expect(page.locator('#Causacion_Transaccion .dx-lookup-field').first(), 'No se abrió el formulario de causaciones')
        .toBeVisible({ timeout: 15000 });
    await elegirEnLookup(page, '#Causacion_Transaccion', TX_CAUSACION, TX_CAUSACION);
}

async function guardarEncabezado(page) {
    // Si la referencia ya existe la app avisa con un toast; se reintenta con otra referencia
    for (let intento = 1; intento <= 3; intento++) {
        await escribir(page.locator('#txtDocumentoCausacion_Referencia .dx-texteditor-input'), referenciaUnica());
        await page.locator('#BtnGuardarCausacion').first().click();
        await page.waitForTimeout(3000);

        if (await numeroCausacion(page).first().inputValue()) {
            return;
        }
        if (!await existe(toast(page, 'ya existe'))) {
            break;
        }
        await page.waitForTimeout(1000);
    }
    expect(await numeroCausacion(page).first().inputValue(), 'La causación no quedó guardada (sin número de documento)').toBeTruthy();
}

async function agregarLinea(page) {
    // Cuenta desde el buscador (F4) de la celda
    const cuentaEnPopup = page.locator('.dx-popup-content').filter({ visible: true }).locator('td').filter({ hasText: textoExacto(CUENTA) });
    await page.locator('#txtCausacion_Detalle_Cuenta_cursor_1 [aria-label="Buscar"]').first().click();
    await expect(cuentaEnPopup.first(), `No apareció la cuenta ${CUENTA} en el buscador`).toBeAttached({ timeout: 10000 });
    await cuentaEnPopup.first().dblclick();
    await page.waitForTimeout(2000);
    await expect(page.locator('#txtCausacion_Detalle_Cuenta_cursor_1 .dx-texteditor-input').first(), `No quedó la cuenta ${CUENTA} en la línea`)
        .toHaveValue(CUENTA);

    await escribir(page.locator('#txtdocumento_detalle_causacion_cursor_1 .dx-texteditor-input'), DETALLE);
    await page.keyboard.press('Enter');
    await escribir(page.locator('#txtdocumento_detalle_causacion_Valor_cursor_1 .dx-texteditor-input'), VALOR);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.locator('#txtdocumento_detalle_causacion_Boton_1').first().click();
    await page.waitForTimeout(3000);
}

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);

    await abrirMovimientos360(page, 'Causaciones');
    await expect(esqueleto(page)).toHaveCount(0, { timeout: 20000 });

    // 1. Encabezado
    await nuevaCausacion(page);
    await elegirEnLookup(page, '#Causacion_Tercero', TERCERO, TERCERO);
    await elegirEnLookup(page, '#Causacion_Clase', CLASE, CLASE);
    await elegirEnLookup(page, '#Causacion_Sucursal', FILTRO_SUCURSAL, SUCURSAL);
    await guardarEncabezado(page);
    const numero = await numeroCausacion(page).first().inputValue();

    // 2. Detalle
    await agregarLinea(page);
    const totalCreado = await parseValorNumerico(page, totalCausacion);
    expect(totalCreado, `El total de la causación ${numero} debería ser ${VALOR}`).toEqual(parseInt(VALOR, 10));

    // 3. Volver a la consulta y cargar la causación por número
    await page.locator('#BtnAtrasCausacion').first().click();
    await page.waitForTimeout(2000);
    await nuevaCausacion(page);
    await escribir(numeroCausacion(page), numero);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await expect(page.locator('#Causacion_Tercero').filter({ hasText: TERCERO }).first(), `No cargó la causación ${numero}`)
        .toBeAttached();
    const valorCausacion = await parseValorNumerico(page, totalCausacion);
    expect(valorCausacion, 'El valor no es el total de la causación creada previamente').toEqual(parseInt(VALOR, 10));

    // 4. Eliminar
    await page.locator('#BtnEliminarCausacion').first().click();
    await btnConfirmarDialogo(page).first().click({ timeout: 10000 });
    await expect(toast(page, 'eliminado').first(), `No se confirmó la eliminación de la causación ${numero}`)
        .toBeAttached({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba Causaciones - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Causaciones admin - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig);
    });
});
