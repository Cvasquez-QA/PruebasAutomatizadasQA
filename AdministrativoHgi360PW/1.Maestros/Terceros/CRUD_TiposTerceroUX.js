import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Tipos Tercero - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Tipos Tercero',
    grupo: 'terceros',
    grid: 'gridTiposTerceros',
    guardar: 'BtnGuardarTipoTerceros_btn',
    campoCodigo: 'txtIntIdTipoTercero',
    codigo: 'QATT1',
    crear: [
        { id: 'txtTipoTerceros_Descripcion', valor: 'descTipoTercero' },
        { id: 'txtTiposTerceros_IntPrecio', tipo: 'lookup', opcion: '1 - Precio 1' }
    ],
    editar: [
        { id: 'txtTipoTerceros_Descripcion', valor: 'NuevaDescripciónTipoTerceros' }
    ],
    validarEditado: 'NuevaDescripciónTipoTerceros'
};

test.describe('Prueba Tipo Terceros - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Tipo Tercero Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
