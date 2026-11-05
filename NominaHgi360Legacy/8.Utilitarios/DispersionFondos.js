import { Selector } from 'testcafe';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirUtilitarios,
    cerrarSesion360,
    ingresarAplicacion,
} from '../../Funciones/HelpersHgi360Legacy.js';

const BANCO = '07 - AHORROS BANCOLOMBIA';
const ENTIDAD = '07 - BANCOLOMBIA';
const OPCION_GENERAL = '0 - GENERAL';

const probarDispersionFondos = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await abrirUtilitarios(t, 'DISPERSIÓN DE FONDOS');
    await t
        .click('#txt_lista_DispersionFondo_Banco .dx-lookup-field')
        .click(Selector('div').withText(BANCO).nth(9))
        .click(Selector('#txt_lista_DispersionFondo_Entidad div').withText('Todos').nth(1))
        .click(Selector('div').withText(ENTIDAD).nth(9))
        .click(Selector('#txt_lista_DispersionFondo_Empleado div').withText('Todos').nth(1))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), config.idEmpleado)
        .wait(2000)
        .click(Selector('div').withText(`${config.idEmpleado} - ${config.nombreEmpleado}`).nth(9))
        .click(Selector('#txt_lista_DispersionFondo_Sucursal div').withText('Todos').nth(1))
        .click(Selector('div').withText(OPCION_GENERAL).nth(29))
        .click(Selector('#txt_lista_DispersionFondo_cCosto div').withText('Todos').nth(1))
        .click(Selector('div').withText(OPCION_GENERAL).nth(39))
        .click(Selector('#txt_lista_DispersionFondo_subcCosto div').withText('Todos').nth(1))
        .click(Selector('div').withText(OPCION_GENERAL).nth(49))
        .click('#dispersionFondo_General .dx-checkbox-icon')
        .click(Selector('#BtnConsultarDispersionFondos span').withText('Consultar'))
        .expect(Selector('#dispersionFondo_GridConsignacionElectronica td').withText(config.idEmpleado).exists).ok('No se encontró el registro en el grid')
        .click('#dispersionFondo_MatricularCuentas .dx-checkbox-icon')
        .click(Selector('#DispersionFondo_BtnGenerarPlano span').withText('Generar plano'))
        .wait(5000)
       // .click(Selector('#dispersionFondo_GridConsignacionElectronica .centrarTextoVerticalmente').nth(19))
        ;
    await cerrarSesion360(t);
};

fixture('Prueba Dispersion Fondos Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Dispersion Fondos - Nomina', async t => {
    await probarDispersionFondos(t, miNominaConfig, ingresarAplicacion);
});

fixture('Prueba Dispersion Fondos Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Dispersion Fondos - Nomina', async t => {
    await probarDispersionFondos(t, testNominaConfig, ingresarAplicacion);
});
