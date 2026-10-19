import { test } from '@playwright/test';
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
    escribirFecha360
} from '../../../Funciones/HelpersHgi360PW.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

test.describe('INC0000 Grabacion Prueba', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`https://mi.hgi360.com/`);
    });

test('GRABACION', async ({ page }) => {

});

});
