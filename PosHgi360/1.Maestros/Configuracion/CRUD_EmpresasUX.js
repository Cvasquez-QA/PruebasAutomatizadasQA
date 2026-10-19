import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const IDENTIFICACION = '811021438';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Empresas');
        //Se valida que exista
        await t
            .wait(2000)
            .expect(Selector('#gridEmpresas td').withText(IDENTIFICACION).exists).ok();
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Empresas testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Empresas Consulta miHgi360 ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Empresas testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Empresas Consulta miHgi360 ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
