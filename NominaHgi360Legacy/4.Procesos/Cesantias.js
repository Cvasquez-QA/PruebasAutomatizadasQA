import { Selector } from 'testcafe';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';

const FECHA_CORTE = '2026-06-15';
const TASA = '10';
const ANO = '2026';
const CCOSTO = '07 - Q.A';
const ID_EMPLEADO = '1000099598';
const EMPLEADO_LOOKUP = '1000099598 - Vasquez Suarez Camilo';

const desplegableLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input');

const botonCancelarLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] span')
    .withText('Cancelar');

const abrirCesantias = async t => {
    await t
        .click(Selector('a').withText('Procesos'))
        .click(Selector('a').withText('CESANTÍAS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500);
};

const cancelarLookup = async (t, idCampo) => {
    await t
        .click(Selector(`${idCampo} .dx-lookup-field`))
        .click(botonCancelarLookup);
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await t.wait(2000);
        await abrirCesantias(t);
    
        await t
            .doubleClick('#TxtCes_FechaCorte .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtCes_FechaCorte .dx-texteditor-input', FECHA_CORTE)
            .doubleClick('#NumCes_Tasa .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#NumCes_Tasa .dx-texteditor-input', TASA)
            .click('#CboCes_Ano .dx-dropdowneditor-icon')
            .click(Selector('.dx-item.dx-list-item div').withText(ANO));
    
        await cancelarLookup(t, '#TxtCes_Sucursal');
    
        await t
            .click('#TxtCes_CCosto .dx-lookup-field')
            .click(Selector('.dx-item.dx-list-item div').withText(CCOSTO));
    
        await cancelarLookup(t, '#TxtCes_SubCCosto');
    
        await t
            .click('#TxtCes_Empleado .dx-lookup-field')
            .typeText(desplegableLookup, ID_EMPLEADO)
            .click(Selector('.dx-item.dx-list-item div').withText(EMPLEADO_LOOKUP))
            .click(Selector('#BtnCes_Liquidar span').withText('Liquidar'))
            .wait(3000)
            .click(Selector('#BtnCes_CargarNomina span').withText('Cargar En Nómina'))
            .wait(3000)
            .click('#BtnCes_Imprimir .dx-icon.dx-icon-spindown')
            .expect(Selector('div').withText('PDF').nth(10).visible).ok('No se visualiza la opción PDF')
            .expect(Selector('div').withText('Mail').nth(10).visible).ok('No se visualiza la opción Mail');
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba Cesantias Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Cesantias Proceso testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Cesantias Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Cesantias Proceso testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
