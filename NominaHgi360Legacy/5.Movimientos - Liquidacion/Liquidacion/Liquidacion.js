import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMovimiento,
    cerrarSesion360,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Legacy.js';

const probarMovimientoLiquidacion = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'LIQUIDACION');
    await t
        .click('#txt_lista_NominaEmpleado .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), config.idEmpleado)
        .wait(2000)
        .click(Selector('div').withText(`${config.idEmpleado} - ${config.nombreEmpleado}`).nth(9))
        .wait(2000)
        .expect(Selector('#gridLiquidacionEmpleado td').exists).ok('no se ha liquidado u ocurrió un error con este usuario')
        ;
    await cerrarSesion360(t);
};

fixture('Prueba Movimiento Liquidacion Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Movimiento liquidacion', async t => {
    await probarMovimientoLiquidacion(t, miNominaConfig, ingresarAplicacion);
});

fixture('Prueba Movimiento Liquidacion Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Movimiento liquidacion', async t => {
    await probarMovimientoLiquidacion(t, testNominaConfig, ingresarAplicacion);
});
