import { cerrarPestana360, cerrarSesion360, ingresarAplicacion } from './HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from './HelpersMaestros360.js';
import { abrirParametros360, cerrarEdicionParametros360, cerrarPopupParametros } from './HelpersParametros360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Arranque común de las pruebas de Herramientas > Parámetros.
 * Solo corren en test.hgi360.com (testAdminConfig, empresa 8902): estas pruebas guardan parámetros de la empresa
 * y no deben correr contra hgi360.com (hgiAdminConfig), que es producción.
 */
export const CONFIG_PARAMETROS = testAdminConfig;

/** beforeEach / afterEach del fixture (el fixture se declara en cada archivo de prueba). */
export const antesDeCadaParametros = async t => {
    await prepararNavegador360(t, CONFIG_PARAMETROS.pagina);
};
export const despuesDeCadaParametros = async t => {
    await limpiarCache360(t);
};

/** Ingresa, abre Parámetros, ejecuta el cuerpo y siempre sale de edición, cierra la pestaña y la sesión. */
export async function conParametros360(t, cuerpo) {
    await ingresarAplicacion(t, CONFIG_PARAMETROS);
    await abrirParametros360(t);
    let fallo = null;
    try {
        await cuerpo();
    } catch (e) {
        fallo = e;
    }
    // Si la prueba ya falló, un error al cerrar no debe tapar el error original
    const cierre = [
        () => cerrarPopupParametros(t),
        () => cerrarEdicionParametros360(t),
        () => cerrarPestana360(t),
        () => cerrarSesion360(t)
    ];
    for (const paso of cierre) {
        try {
            await paso();
        } catch (e) {
            if (!fallo) throw e;
        }
    }
    if (fallo) throw fallo;
}
