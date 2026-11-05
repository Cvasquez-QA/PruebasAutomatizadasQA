import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_EMPRESA = '1';
const CIUDAD_EMPRESA = 'MEDELL�N';
const CIUDAD_EMPRESA_EDITADA = 'AGUADAS';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Empresas');

    await t
        .expect((Selector('#gridEmpresas td').withText(CODIGO_EMPRESA)).exists).ok('no se encuentra registrada la empresa 1')
        .click(Selector('#gridEmpresas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click(Selector('#txtEmpresa_Ciudad .dx-lookup-field'))
        //.typeText('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input','05001')
        //.wait(2000)
        await filtrarPor(t, CIUDAD_EMPRESA_EDITADA);
            await seleccionarOpcion(t, CIUDAD_EMPRESA_EDITADA);
    await t
        .click(Selector('#BtnGuardarEmpresa span').withText('Guardar'))
        .click(Selector('#gridEmpresas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .expect(Selector('#txtEmpresa_Ciudad .dx-lookup-field').withText(CIUDAD_EMPRESA).visible).ok('no se encuentra registrada la ciudad')
        .click(Selector('#txtEmpresa_Ciudad .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CIUDAD_EMPRESA);
    await t
        .click(Selector('#BtnGuardarEmpresa span').withText('Guardar'))
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Empresas Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Empresas - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Empresas Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Empresas - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});