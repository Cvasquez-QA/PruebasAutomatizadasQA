import { test, expect } from '@playwright/test';
import {
    abrirMovimientos360,
    btnConfirmarDialogo,
    cerrarSesion360,
    esVisible,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion
} from '../Funciones/HelpersHgi360PW.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

// INC119 - Punto de Venta (test.hgi360.com, AutPos, caja 10Au): en la nota crédito 85, F5 sobre el
// documento de referencia debe dejar un número distinto de 0. Solo lee: no guarda ni carga el documento.
const CAJA = '10Au - Caja Automatizacion';
const TX_NOTA_FILTRO = 'NOTA';
const TX_NOTA = '85 - NOTA CREDITO PUNTO DE VENTA';

const docRef = page => page.locator('#PuntoDeVenta_documento_ref .dx-texteditor-input').first();

/** Elige la caja en el lookup abierto. La lista solo muestra las primeras: se filtra por el código. */
async function elegirCaja(page, caja) {
    const codigo = String(caja).split(' - ')[0].trim();
    const buscador = page.locator('.dx-overlay-content').filter({ visible: true }).locator('input.dx-texteditor-input');
    if (await esVisible(buscador, 5000)) {
        await buscador.first().fill(codigo);
        await page.waitForTimeout(2500);
    }
    const opcion = page.locator('.dx-overlay-content').filter({ visible: true }).locator('.dx-list-item')
        .filter({ hasText: new RegExp(`^\\s*${codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+-`) });
    await expect(opcion.first(), `No apareció la caja "${caja}" en la lista`).toBeVisible({ timeout: 10000 });
    await opcion.first().click();
}

/** Movimientos > Punto de Venta con la caja 10Au. */
async function abrirPuntoDeVenta(page) {
    await abrirMovimientos360(page, 'Punto de Venta');
    const caja = page.locator('#modalPuntoDeVenta_Caja .dx-lookup-field').first();
    await expect(caja, 'No apareció la selección de caja del Punto de Venta').toBeVisible({ timeout: 20000 });
    await caja.click();
    await elegirCaja(page, CAJA);
    await page.locator('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar').first().click();
    // La caja puede estar en operación por otra sesión: se cierra esa operación y se sigue
    const confirmar = btnConfirmarDialogo(page);
    if (await esVisible(confirmar, 6000)) {
        await confirmar.first().click();
    }
    await expect(page.locator('#PuntoDeVenta_Transaccion').first(), 'No abrió la pantalla del Punto de Venta')
        .toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);
}

/** Elige la nota crédito 85. A veces el primer clic llega antes de que el lookup esté listo. */
async function elegirNotaCredito(page) {
    const lista = page.locator('.dx-overlay-content').filter({ visible: true });
    const campo = page.locator('#PuntoDeVenta_Transaccion .dx-lookup-field').first();
    for (let intento = 0; intento < 3 && !await esVisible(lista.locator('.dx-list-item, .dx-item-content')); intento++) {
        await expect(campo, 'No se ve el campo Transacción del Punto de Venta').toBeVisible({ timeout: 20000 });
        await campo.click();
        await page.waitForTimeout(1500);
    }
    if (await esVisible(lista.locator('.dx-texteditor-input'), 5000)) {
        await filtrarPor(page, TX_NOTA_FILTRO);
    }
    await seleccionarOpcion(page, TX_NOTA);
    await page.waitForTimeout(2000);
    await expect(page.locator('#PuntoDeVenta_Transaccion').first(), `No quedó la transacción ${TX_NOTA}`)
        .toContainText('85', { timeout: 10000 });
}

async function salirPuntoDeVenta(page) {
    const salir = page.locator('#PuntoDeVenta_BtnSalir').filter({ visible: true });
    if (!await esVisible(salir, 3000)) {
        return;
    }
    await salir.first().click();
    const confirmar = btnConfirmarDialogo(page);
    if (await esVisible(confirmar, 3000)) {
        await confirmar.first().click();
    }
    await expect(salir, 'No salió del Punto de Venta').toHaveCount(0, { timeout: 15000 });
}

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);
    await abrirPuntoDeVenta(page);
    try {
        await elegirNotaCredito(page);
        const campo = docRef(page);
        // Con el navegador visible, si la ventana no es la activa del sistema el campo no recibe el F5
        await page.bringToFront();
        await campo.click();
        await campo.focus();
        await campo.press('F5');
        await page.waitForTimeout(3500);
        await expect(campo, 'F5 no cargó un documento de referencia distinto de 0').toHaveValue(/[1-9]/);
    } finally {
        await salirPuntoDeVenta(page).catch(() => undefined);
        await cerrarSesion360(page).catch(() => undefined);
    }
}

test.describe('INC119 F5 DocRef Pos - Test Hgi360 Pos', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testPosWebConfig.pagina);
    });

    test('INC119 F5 DocRef Pos - Test Hgi360 Pos', async ({ page }) => {
        await ejecutarPrueba(page, testPosWebConfig);
    });
});
