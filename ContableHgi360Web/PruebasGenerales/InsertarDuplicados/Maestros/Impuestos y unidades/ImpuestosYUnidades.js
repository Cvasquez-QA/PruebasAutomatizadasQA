import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - IMPUESTOS Y UNIDADES (test.hgi360.com, AutContable).
// Crea el registro de prueba, intenta crearlo de nuevo con el mismo código, valida el rechazo
// ("Ya existe un registro...") y borra el registro. Ids tomados en el navegador el 03-nov-2026.
// Solo Bancos: Conceptos Pago, Entidades Financieras, Formas de Pago, Monedas, Retención, Tarifas y Unidades
// no están en el menú Maestros del módulo Contable.

const BANCOS = {
    maestro: 'Bancos',
    grid: 'gridBancos',
    guardar: 'BtnActualizarBanco_btn',
    campoCodigo: 'txtBancos_Codigo',
    codigo: 'QADUPBAN',
    crear: [
        { id: 'txtBancos_Descripcion', valor: 'midescripcionbanco' }
    ]
};

const MAESTROS = [BANCOS];

fixture `Prueba Duplicados Contable - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - IMPUESTOS Y UNIDADES - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro, testContableConfig);
    }
    await cerrarSesion360(t);
});
