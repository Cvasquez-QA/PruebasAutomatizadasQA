import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Grupos - test.hgi360.com (Maestros > productos).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Grupos',
    grupo: 'productos',
    grid: 'gridGrupos',
    guardar: 'BtnGuardarGrupos_btn',
    campoCodigo: 'txtIdGrupo',
    codigo: 'QAGRU1',
    crear: [
        { id: 'txtGrupo_Descripcion', valor: 'MiDescripciónGrupo' },
        { id: 'txtGrupo_Producto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' },
        { id: 'txtGrupo_TipoGrupo', valor: '2' },
        { id: 'txtGrupo_StrConcepto', tipo: 'lookup', filtro: 'GENERAL', opcion: '0 - GENERAL' },
        { id: 'txtGrupo_IntPrioridad', valor: '10' }
    ],
    editar: [
        { id: 'txtGrupo_Descripcion', valor: 'MiNuevaDescripciónGrupo' }
    ],
    validarEditado: 'MiNuevaDescripciónGrupo'
};

test.describe('Prueba Grupos - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba CRUD Grupos Test Hgi360 - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
