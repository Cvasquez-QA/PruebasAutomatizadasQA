import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, cerrarSesion360, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const IDENTIFICACION = '811021438';


async function ejecutarPruebaEmpresas(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Empresas');
        //Se valida que exista
        await t
            .wait(2000)
            .expect(Selector('#gridEmpresas td').withText(IDENTIFICACION).exists).ok();
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_EmpresasUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Empresas Consulta miHgi360 - Mi ERP', async t => {
    await ejecutarPruebaEmpresas(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_EmpresasUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Empresas Consulta miHgi360 - Test Contable', async t => {
    await ejecutarPruebaEmpresas(t, testContableConfig, ingresarAplicacion);
});
