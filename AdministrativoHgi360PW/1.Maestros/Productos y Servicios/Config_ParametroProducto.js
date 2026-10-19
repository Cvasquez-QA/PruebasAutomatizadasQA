import { test, expect } from '@playwright/test';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirHerramientas360,
    existe,
    escribir
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Herramientas > Parámetros > pestaña Parámetros (test.hgi360.com).
// Deja los nombres de los parámetros de producto en Parametro11..Parametro66, que son los nombres
// de menú que usan las pruebas CRUD_ParametroProducto1..6.
const NOMBRES = ['Parametro11', 'Parametro22', 'Parametro33', 'Parametro44', 'Parametro55', 'Parametro66'];

const campoParametro = n => `#TxtParametrosGenerales_Params_StrProductoParametro${n} .dx-texteditor-input`;
const toastExito = page => page.locator('.erp-toast[data-type="success"]').filter({ visible: true });
const botonConfirmar = page => page.locator('button.swal2-confirm').filter({ visible: true });

async function ejecutarPrueba(page, config) {
    await ingresarAplicacion(page, config);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametros_Params').first().click({ timeout: 20000 });
    await page.locator('#BtnEditar_btn').filter({ visible: true }).first().click({ timeout: 15000 });
    await expect(page.locator(campoParametro(1)).filter({ visible: true }).first(), 'No se habilitó la edición de parámetros')
        .toBeAttached({ timeout: 10000 });

    for (let n = 1; n <= NOMBRES.length; n++) {
        await escribir(page.locator(campoParametro(n)), NOMBRES[n - 1]);
        await page.keyboard.press('Tab');
    }

    await page.locator('#BtnGuardar_btn').filter({ visible: true }).first().click();
    // Según la versión, el guardado confirma con un toast o con un diálogo "Aceptar"
    if (await existe(botonConfirmar(page), 5000)) {
        await botonConfirmar(page).first().click();
    }
    await page.waitForTimeout(1500);
    const hayToast = await existe(toastExito(page));

    // Validar recargando la pantalla de parámetros
    await cerrarPestana360(page);
    await abrirHerramientas360(page, 'Parámetros');
    await page.locator('#tabs_parametros_Params').first().click({ timeout: 20000 });
    for (let n = 1; n <= NOMBRES.length; n++) {
        await expect(page.locator(campoParametro(n)).first(),
            `El parámetro de producto ${n} no quedó guardado${hayToast ? '' : ' (no se vio confirmación)'}`)
            .toHaveValue(NOMBRES[n - 1], { timeout: 10000 });
    }

    await cerrarPestana360(page);
    await cerrarSesion360(page);
}

test.describe('Prueba ParametroProd1 - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Config Parametros Productos - Test Hgi360', async ({ page }) => {
        await ejecutarPrueba(page, testAdminConfig);
    });
});
