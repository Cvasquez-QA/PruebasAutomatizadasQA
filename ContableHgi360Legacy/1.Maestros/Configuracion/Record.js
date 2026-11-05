import { cerrarSesion360, ingresarAplicacion, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

/*
    Stub: el archivo original no contenía cuerpo de prueba (solo fixture vacío).
    Se deja el patrón Contable para organización; sin pasos de negocio.
*/

async function ejecutarPruebaRecord(t, config, ingresar) {
    await ingresar(t, config);
    await cerrarSesion360(t);
}

fixture `Record - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Record - Mi ERP', async t => {
    await ejecutarPruebaRecord(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Record - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Record - Test Contable', async t => {
    await ejecutarPruebaRecord(t, testContableConfig, ingresarAplicacion);
});
