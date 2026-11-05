import { cerrarPestana360, cerrarSesion360, ingresarAplicacion } from './HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from './HelpersMaestros360.js';
import { abrirParametros360, cerrarEdicionParametros360, cerrarPopupParametros } from './HelpersParametros360.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * Igual que FlujoParametros360.js, pero entra con el usuario de Pos (testPosWebConfig: AutPos, empresa 8902).
 * Lo usan las pruebas de PosHgi360Web/4.Herramientas/Administracion/Parametros (copias de las de
 * AdministrativoHgi360Web, 02-nov-2026).
 * Ojo: los parámetros son de la empresa, no del usuario. Las pruebas de Admin y de Pos cambian y restauran los
 * mismos parámetros de la 8902: no se deben correr las dos carpetas al mismo tiempo.
 * Solo test.hgi360.com: estas pruebas guardan parámetros y no deben correr contra producción.
 */
export const CONFIG_PARAMETROS = testPosWebConfig;

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
