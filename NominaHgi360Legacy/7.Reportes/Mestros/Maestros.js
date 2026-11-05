import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion } from '../../../Funciones/HelpersHgi360Legacy.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const REPORTES = ['Empleados', 'Conceptos'];
const MENU_REPORTES = Selector('#menu_25500 a').withText('Reportes');
const OPCION_MAESTROS = Selector('#link_2550011 span').withText('MAESTROS');
const SELECTOR_REPORTE = Selector('div').withText('Seleccione un reporte').nth(19);
const FILAS_REPORTE = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines im"] td');

const generarReporte = async (t, nombreReporte) => {
    await t
        .click(MENU_REPORTES)
        .click(OPCION_MAESTROS)
        .click(SELECTOR_REPORTE)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(nombreReporte).nth(10))
        .click(Selector('.dx-button-text').withText('Generar'))
        .wait(2000)
        .expect(FILAS_REPORTE.exists).ok();

    await cerrarPestana360(t);
    await t.wait(2000);
};

fixture `Prueba Reportes Maestros Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Reportes Nomina - Empleados', async t => {
    await ingresarAplicacion(t, testNominaConfig);

for (const reporte of REPORTES) {
        await generarReporte(t, reporte);
    }

    await cerrarSesion360(t);
});