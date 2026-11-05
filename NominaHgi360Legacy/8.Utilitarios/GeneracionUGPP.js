import { Selector } from 'testcafe';
import { abrirUtilitarios, cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const MENSAJE_NO_DISPONIBLE = 'Aun no esta disponible este proceso';

const toastNoDisponible = Selector('[class^="dx-overlay-content dx-toast-warning"] div')
    .withText(MENSAJE_NO_DISPONIBLE);

const filasGrid = Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines td');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirUtilitarios(t, 'GENERACIÓN UGPP');
    
        await t
            .click(Selector('#BtnNomGeneracionUGPP_CargarSalarios span').withText('Cargar'))
            .wait(3000)
            .expect(filasGrid.count).gt(0, 'La grilla de salarios no trae información');
    
        await t
            .click(Selector('#BtnNomGeneracionUGPP_GenerarSalarios span').withText('Generar'))
            .wait(2000)
            .expect(toastNoDisponible.visible).ok('No se mostró el mensaje de Generar Salarios no disponible');
    
        await t
            .click('#GridNomGeneracionUGPP_Salarios .dx-icon.dx-icon-xlsxfile')
            .wait(1500);
    
        await t
            .click(Selector('#TabPanelNomGeneracionUGPP span').withText('Compensaciones'))
            .wait(1500)
            .click(Selector('#BtnNomGeneracionUGPP_CargarCompensaciones span').withText('Cargar'))
            .wait(3000)
            .expect(filasGrid.count).gt(0, 'La grilla de compensaciones no trae información');
    
        await t
            .click(Selector('#BtnNomGeneracionUGPP_GenerarCompensaciones span').withText('Generar'))
            .wait(2000)
            .expect(Selector('div').withText(MENSAJE_NO_DISPONIBLE).visible)
            .ok('No se mostró el mensaje de Generar Compensaciones no disponible');
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba GeneracionUGPP Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Generacion UGPP testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba GeneracionUGPP Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Generacion UGPP testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
