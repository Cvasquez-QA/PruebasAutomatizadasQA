import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Clases - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Clases',
    grupo: 'productos',
    grid: 'gridClases',
    guardar: 'BtnActualizarClases_btn',
    campoCodigo: 'txtStrIdClase',
    codigo: 'QACLA1',
    crear: [
        { id: 'txtClase_Descripcion', valor: 'MiDescripcionClase' },
        { id: 'txtClases_IntTipo', tipo: 'lookup', opcion: 'Productos' },
        { id: 'txtClases_StrConcepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' }
    ],
    editar: [
        { id: 'txtClase_Descripcion', valor: 'MiNuevaDescripciónClase' }
    ],
    validarEditado: 'MiNuevaDescripciónClase'
};

test.describe('Prueba Clases - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Clases Completo Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
