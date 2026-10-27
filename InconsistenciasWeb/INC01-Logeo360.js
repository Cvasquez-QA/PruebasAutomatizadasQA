import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { hgiAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const testAdminConfig = {
    pagina: 'https://test.hgi360.com',
    empresa: '8902',
    usuario: 'AutAdmin',
    clave: 'Calidad2026*',
};

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);
    await t.expect(Selector('#ErpSidebarModulos').visible).ok('No se ingresó al aplicativo Hgi360');
    await cerrarSesion360(t);
};

fixture `INC01 Logeo Hgi360 - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC01 Logeo Hgi360 - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC01 Logeo Hgi360 - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC01 Logeo Hgi360 - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
