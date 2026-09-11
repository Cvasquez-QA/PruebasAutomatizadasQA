import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    cerrarSesion360,
    cerrarPestana360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const IDENTIFICACION = '811021438';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Empresas');
        await t
            .wait(2000)
            .expect(Selector('#gridEmpresas td').withText(IDENTIFICACION).exists).ok();
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Empresas - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Empresas Consulta Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Empresas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Empresas Consulta - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
