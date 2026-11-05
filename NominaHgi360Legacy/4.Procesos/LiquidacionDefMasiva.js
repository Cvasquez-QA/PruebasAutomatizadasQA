import { Selector } from 'testcafe';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';

const FECHA_LIQUIDACION = '2026-06-25';
const CCOSTO = '07 - Q.A';
const ID_EMPLEADO = '1000099598';
const MENSAJE_NO_IMPLEMENTADO = 'Este proceso aun no esta implementado';

const toastNoImplementado = Selector('.dx-overlay-content.dx-toast-info.dx-toast-content div')
    .withText(MENSAJE_NO_IMPLEMENTADO);

const filasGrid = Selector('.dx-row.dx-data-row.dx-column-lines td');

const botonCancelarLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] span')
    .withText('Cancelar');

const abrirLiquidacionDefMasiva = async t => {
    await t
        .click(Selector('a').withText('Procesos'))
        .click(Selector('span').withText('LIQUIDACIÓN DEFINITIVA MASIVA'))
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
        await abrirLiquidacionDefMasiva(t);
    
        await cancelarLookup(t, '#TxtLiqDefMas_Sucursal');
        await cancelarLookup(t, '#TxtLiqDefMas_CCosto');
        await cancelarLookup(t, '#TxtLiqDefMas_SubCCosto');
        await cancelarLookup(t, '#TxtLiqDefMas_Empleado');
    
        await t
            .typeText('#TxtLiqDefMas_FechaRetiro .dx-texteditor-input', FECHA_LIQUIDACION)
            .pressKey('enter')
            .typeText('#TxtLiqDefMas_FechaAcumulados .dx-texteditor-input', FECHA_LIQUIDACION)
            .pressKey('enter')
            .typeText('#TxtLiqDefMas_FechaUltimoAno .dx-texteditor-input', FECHA_LIQUIDACION)
            .pressKey('enter')
            .click(Selector('.dx-item.dx-radiobutton div').withText('Promedio'))
            .click(Selector('.dx-item.dx-radiobutton div').withText('Básico'))
            .click(Selector('#frmLiquidacionDefinitivaMasiva span').withText('Prima de servicios'))
            .click('#ChkLiqDefMas_Indemnizacion .dx-checkbox-icon')
            .click('#ChkLiqDefMas_CesantiasAnt .dx-checkbox-icon')
            .click('#ChkLiqDefMas_IntCesantiasAnt .dx-checkbox-icon')
            .click('#TxtLiqDefMas_CCosto .dx-lookup-field')
            .click(Selector('.dx-item.dx-list-item div').withText(CCOSTO))
            .click(Selector('#BtnLiqDefMas_CargarEmpleados div').withText('Cargar'))
            .wait(3000)
            .expect(filasGrid.count).gt(0, 'La grilla no trae información de empleados');
    
        await t
            .click(Selector('#gridLiquidacionDefinitivaMasiva td').withText(ID_EMPLEADO))
            .click(Selector('#BtnLiqDefMas_CalcularLiquidacion span').withText('Calcular liquidación'))
            .wait(2000)
            .expect(toastNoImplementado.visible).ok('No se mostró el mensaje al calcular liquidación');
    
        await t
            .click(Selector('#BtnLiqDefMas_Grabar span').withText('Grabar'))
            .wait(2000)
            .expect(toastNoImplementado.visible).ok('No se mostró el mensaje al grabar');
    
        await t
            .click(Selector('#BtnLiqDefMas_Anular span').withText('Anular'))
            .wait(2000)
            .expect(toastNoImplementado.visible).ok('No se mostró el mensaje al anular');
    
        await t
            .click(Selector('#BtnLiqDefMas_CargarNomina span').withText('Cargar en nómina'))
            .wait(2000)
            .expect(toastNoImplementado.visible).ok('No se mostró el mensaje al cargar en nómina');
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba LiquidacionDefMasiva Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Liquidacion Definitiva Masiva testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba LiquidacionDefMasiva Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Liquidacion Definitiva Masiva testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
