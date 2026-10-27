import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC079 - Un usuario con caracteres especiales (* y #) en la contraseña debe poder ingresar.
 * Usuario y clave vienen del archivo legacy (usuario h20 de test).
 */
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, { ...config, usuario: 'h20', clave: 'crca*0809#' });
    await t
        .expect(Selector('#divpanelmaster .dropdown-toggle.erp-user-trigger').with({ timeout: 30000 }).exists)
        .ok('No se ingresó correctamente al aplicativo');
    await cerrarSesion360(t);
}

fixture `Prueba INC079 Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC079 Credenciales Pass', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});
