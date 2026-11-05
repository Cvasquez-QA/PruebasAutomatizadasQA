import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion } from '../../../Funciones/HelpersHgi360Legacy.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const REPORTES = [
    'Novedades',
    'Relacion de Pagos',
    'Ausentismo',
    'Liquidacion',
    'Prenomina',
    'Novedades Turno'
];
const MENU_REPORTES = Selector('#menu_25500 a').withText('Reportes');
const OPCION_LIQUIDACION = Selector('#link_2550021 span').withText('LIQUIDACIÓN');
const SELECTOR_REPORTE = Selector('div').withText('Seleccione un reporte').nth(19);
const GRID_SIN_DATOS = Selector('.dx-datagrid-rowsview.dx-datagrid-nowrap.dx-empty .dx-datagrid-nodata');

const generarReporte = async (t, nombreReporte) => {
    await t
        .click(MENU_REPORTES)
        .click(OPCION_LIQUIDACION)
        .click(SELECTOR_REPORTE)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(nombreReporte).nth(10))
        .click(Selector('.dx-button-text').withText('Generar'))
        .wait(2000)
        .expect(GRID_SIN_DATOS.exists).notOk('No se está llenando el grid');

    await cerrarPestana360(t);
    await t.wait(2000);
};

fixture `Prueba Reportes Liquidacion Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Reportes Nomina - Liquidacion', async t => {
    await ingresarAplicacion(t, testNominaConfig);

for (const reporte of REPORTES) {
        await generarReporte(t, reporte);
    }

    await cerrarSesion360(t);
});