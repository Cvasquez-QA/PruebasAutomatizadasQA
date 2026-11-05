import { Selector } from 'testcafe';
import { abrirUtilitarios, cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const CAMPOS_LOOKUP = [
    '#TxtNomGenFact_Puesto',
    '#TxtNomGenFact_Sucursal',
    '#TxtNomGenFact_CCosto',
    '#TxtNomGenFact_SubCCosto',
    '#TxtNomGenFact_Empleado',
    '#TxtNomGenFact_ProductoSegSocial',
    '#TxtNomGenFact_ProductoPresSocial',
    '#TxtNomGenFact_ProductoAdministracion'
];

const toastProcesoTerminado = Selector('[class^="dx-overlay-content dx-toast-success"] div')
    .withText('Proceso Terminado');

const seleccionarLookup = async (t, idCampo) => {
    await t.click(Selector(`${idCampo} .dx-lookup-field`));
};

const clicCancelar = async t => {
    await t.click(Selector('[data-bind="dxControlsDescendantBindings: true"] span').withText('Cancelar'));
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirUtilitarios(t, 'GENERAR FACTURA');
    
        for (const campo of CAMPOS_LOOKUP) {
            await seleccionarLookup(t, campo);
            await clicCancelar(t);
        }
    
        await t
            .click('#NumNomGenFact_ValorPorEmpleado .dx-texteditor-input')
            .click('#NumNomGenFact_Porcentaje .dx-texteditor-input')
            .click(Selector('#BtnNomGenFact_CargarEmpleados span').withText('Cargar Empleados'))
            .expect(toastProcesoTerminado.visible).ok('No se mostró el mensaje de éxito al cargar empleados');
    
        await t
            .click(Selector('#BtnNomGenFact_NovedadesFactura span').withText('Novedades Factura'))
            .expect(toastProcesoTerminado.visible).ok('No se mostró el mensaje de éxito al generar novedades');
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba GenerarFactura Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Generar Factura testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba GenerarFactura Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Generar Factura testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
