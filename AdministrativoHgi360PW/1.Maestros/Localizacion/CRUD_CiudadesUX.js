import { test } from '@playwright/test';
import { ejecutarCrudMaestro } from '../../../Funciones/HelpersMaestros360PW.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Ciudades - test.hgi360.com (Maestros > localizacion).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360PW.js.
const MAESTRO = {
    maestro: 'Ciudades',
    grupo: 'localizacion',
    grid: 'gridCiudades',
    guardar: 'BtnGuardarCiudad_btn',
    campoCodigo: 'txtCiudad_Id',
    codigo: 'QACIU1',
    crear: [
        { id: 'txtCiudad_Descripcion', valor: 'MIDESCRIPCION' },
        { id: 'txtCiudad_Zonas', tipo: 'lookup', filtro: '05', opcion: '05 - ANTIOQUIA' },
        { id: 'txtCiudad_Dane_Ciudad', tipo: 'lookup', filtro: '05001', opcion: /^\s*05001 -/ },
        { id: 'txtCiudad_Dane_Pais', valor: 'MIPAIS' },
        { id: 'txtCiudad_Dane_PaisIso', tipo: 'lookup', filtro: 'AF', opcion: /^\s*AF -/ }
    ],
    editar: [
        { id: 'txtCiudad_Descripcion', valor: 'MINUEVADESCRIPCION' }
    ],
    validarEditado: 'MINUEVADESCRIPCION'
};

test.describe('Prueba Ciudades - Test Hgi360', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testAdminConfig.pagina);
    });

    test('Prueba Ciudades Test Hgi360 CRUD - Test Hgi360', async ({ page }) => {
        await ejecutarCrudMaestro(page, testAdminConfig, MAESTRO);
    });
});
