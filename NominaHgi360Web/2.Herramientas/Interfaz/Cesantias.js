import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360, cerrarPestana360, abrirHerramientas360 } from '../../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Herramientas > Cesantías (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy: valida el
// formulario de la interfaz (fondo, formatos, columnas y totalizadores del grid) y pulsa Generar.
const COLUMNAS_GRID = ['Empleado', 'Nombre', 'Documento', 'Tipo ID', 'Días', 'Salario', 'Cesantías', 'Pago'];
const FORMATOS = ['Aportes En Línea', 'ARUS'];

const grid = Selector('#gridNomHCesantias');

fixture `Prueba Interfaz Cesantias Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Interfaz Cesantias - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirHerramientas360(t, 'Cesantías');

    await t
        .expect(Selector('#txtNomHCesantias_Fondo').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Herramientas > Cesantías')
        .click('#txtNomHCesantias_Fondo .dx-lookup-field')
        .expect(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').with({ timeout: 10000 }).exists)
        .ok('La lista de fondos no trae opciones')
        .pressKey('esc');

    for (const formato of FORMATOS) {
        await t.expect(Selector('#rgNomHCesantias_Formato .dx-radiobutton').withText(formato).visible)
            .ok(`No se visualiza el formato ${formato}`);
    }
    for (const columna of COLUMNAS_GRID) {
        await t.expect(grid.find('.dx-datagrid-headers td').withExactText(columna).exists)
            .ok(`No se visualiza la columna ${columna}`);
    }
    await t
        .expect(grid.find('.dx-datagrid-summary-item').count).gte(2, 'No se visualizan los totalizadores del grid')
        .click(Selector('#btnNomHCesantias_Generar').filterVisible())
        .wait(2000)
        .expect(Selector('.erp-toast[data-type="error"]').filterVisible().exists)
        .notOk('La aplicación mostró un error al generar la interfaz de cesantías');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
