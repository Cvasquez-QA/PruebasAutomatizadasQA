import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360, cerrarPestana360, abrirUtilitarios360 } from '../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Utilitarios > Generar Factura (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// abre y cierra cada lista, y valida "Proceso Terminado" en Cargar Empleados y Novedades Factura.
const LISTAS = [
    'TxtNomGenFact_Puesto',
    'TxtNomGenFact_Sucursal',
    'TxtNomGenFact_CCosto',
    'TxtNomGenFact_SubCCosto',
    'TxtNomGenFact_Empleado',
    'TxtNomGenFact_ProductoSegSocial',
    'TxtNomGenFact_ProductoPresSocial',
    'TxtNomGenFact_ProductoAdministracion'
];
const TERMINADO = /proceso terminado/i;

const aviso = texto => Selector('.erp-toast, .swal2-popup').filterVisible().withText(texto);

fixture `Prueba Generar Factura Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Generar Factura - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirUtilitarios360(t, 'Generar Factura');
    await t.expect(Selector('#BtnNomGenFact_CargarEmpleados').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Utilitarios > Generar Factura');

    for (const lista of LISTAS) {
        await t
            .click(`#${lista} .dx-lookup-field`)
            .expect(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item, .dx-empty-message').with({ timeout: 10000 }).exists)
            .ok(`No se abrió la lista ${lista}`)
            .pressKey('esc')
            .wait(500);
    }

    await t
        .click(Selector('#BtnNomGenFact_CargarEmpleados').filterVisible())
        .expect(aviso(TERMINADO).with({ timeout: 30000 }).exists).ok('No se mostró el mensaje de éxito al cargar empleados')
        .expect(aviso(TERMINADO).exists).notOk('El aviso de Cargar Empleados no se cerró', { timeout: 20000 })
        .click(Selector('#BtnNomGenFact_NovedadesFactura').filterVisible())
        .expect(aviso(TERMINADO).with({ timeout: 30000 }).exists).ok('No se mostró el mensaje de éxito al generar novedades');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
