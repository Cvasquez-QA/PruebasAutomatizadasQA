import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Colores - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
// OJO: el color se escribe en el campo (#FF0000); si el ColorBox no acepta texto, usar el selector de paleta.
const MAESTRO = {
    maestro: 'Colores',
    grupo: 'productos',
    grid: 'gridColores',
    guardar: 'BtnGuardarColores_btn',
    campoCodigo: 'txtColores_StrIdColor',
    codigo: 'QACOL1',
    crear: [
        { id: 'txtColores_StrDescripcion', valor: 'descColor' },
        { id: 'txtColores_Color', valor: '#FF0000' },
        { id: 'txtColores_IntOrden', valor: '87' }
    ],
    editar: [
        { id: 'txtColores_StrDescripcion', valor: 'nuevaDescColor' },
        { id: 'txtColores_IntOrden', valor: '4' }
    ],
    validarEditado: 'nuevaDescColor'
};

test.describe('CRUD_Colores - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Colors mierp - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
