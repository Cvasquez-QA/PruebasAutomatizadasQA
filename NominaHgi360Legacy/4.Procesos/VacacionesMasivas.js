import { Selector } from 'testcafe';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';

const FECHA_ACUMULADO_HASTA = '2026-06-23';
const FECHA_INICIO = '2026-06-20';
const MESES = '1';
const DIAS_VACACIONES = '5';
const CCOSTO = '07 - Q.A';
const DIAS_VACACIONES_NUM = Number(DIAS_VACACIONES);
const DIAS_PVAC_ESPERADOS = String(DIAS_VACACIONES_NUM + 1);

const toastProcesoRealizado = Selector('[class^="dx-overlay-content dx-toast-success"] div')
    .withText('Proceso realizado.');

const toastProximamente = Selector('.dx-overlay-content.dx-toast-info.dx-toast-content div')
    .withText('Esta acción estará disponible proximamente.');

const filasGrid = Selector('.dx-row.dx-data-row.dx-column-lines td');

const sumarDias = (fecha, dias) => {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const date = new Date(anio, mes - 1, dia);
    date.setDate(date.getDate() + Number(dias));

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
};

const abrirVacacionesMasivas = async t => {
    await t
        .click(Selector('a').withText('Procesos'))
        .click(Selector('span').withText('VACACIONES MASIVAS'))
        .wait(1500)
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500);
};

const botonCancelarLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] span')
    .withText('Cancelar');

const cancelarLookup = async (t, idCampo) => {
    await t
        .click(Selector(`${idCampo} .dx-lookup-field`))
        .click(botonCancelarLookup);
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await t.wait(2000);
        await abrirVacacionesMasivas(t);
    
        await cancelarLookup(t, '#TxtVacMas_Sucursal');
        await cancelarLookup(t, '#TxtVacMas_CCosto');
        await cancelarLookup(t, '#TxtVacMas_SubCCosto');
        await cancelarLookup(t, '#TxtVacMas_Empleado');
    
        await t
            .doubleClick('#TxtVacMas_FechaAcumuladoHasta .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtVacMas_FechaAcumuladoHasta .dx-texteditor-input', FECHA_ACUMULADO_HASTA)
            .doubleClick('#NumVacMas_Meses .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#NumVacMas_Meses .dx-texteditor-input', MESES)
            .click(Selector('#RgVacMas_TipoLiquidacion div').withText('Básico').nth(2))
            .click(Selector('#RgVacMas_TipoLiquidacion div').withText('Promedio').nth(2))
            .doubleClick('#TxtVacMas_FechaInicio .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#TxtVacMas_FechaInicio .dx-texteditor-input', FECHA_INICIO)
            .doubleClick('#TxtVacMas_FechaFinal .dx-texteditor-input')
            .doubleClick('#NumVacMas_DiasVac .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#NumVacMas_DiasVac .dx-texteditor-input', DIAS_VACACIONES)
            .pressKey('enter')
            .wait(1500);
    
        await t
            .expect(Selector('#NumVacMas_DiasDis .dx-texteditor-input').value).eql(DIAS_VACACIONES)
            .expect(Selector('#NumVacMas_DiasCom .dx-texteditor-input').value).eql('0')
            .expect(Selector('#NumVacMas_DiasPVac .dx-texteditor-input').value).eql(DIAS_PVAC_ESPERADOS)
            .expect(Selector('#NumVacMas_DiasPDis .dx-texteditor-input').value).eql(DIAS_PVAC_ESPERADOS)
            .expect(Selector('#NumVacMas_DiasPCom .dx-texteditor-input').value).eql('0');
    
        const fechaFinalEsperada = sumarDias(FECHA_INICIO, DIAS_VACACIONES_NUM);
    
        await t
            .expect(Selector('#TxtVacMas_FechaFinal .dx-texteditor-input').value)
            .eql(fechaFinalEsperada, 'La fecha final no corresponde a 5 días después del inicio');
    
        await t.doubleClick('#TxtVacMas_FechaRegreso .dx-texteditor-input');
    
        const fechaRegresoEsperada = sumarDias(fechaFinalEsperada, 1);
    
        await t
            .expect(Selector('#TxtVacMas_FechaRegreso .dx-texteditor-input').value)
            .eql(fechaRegresoEsperada, 'La fecha de regreso no es un día después de la fecha final');
    
    
        await t
            .click('#TxtVacMas_CCosto .dx-lookup-field')
            .click(Selector('.dx-item.dx-list-item div').withText(CCOSTO))
            .wait(2000);
    
        await t
            .click(Selector('#BtnVacMas_CargarEmpleados span').withText('Cargar'))
            .wait(5000)
            .expect(toastProcesoRealizado.visible).ok('No se mostró el mensaje de proceso realizado')
            .expect(filasGrid.count).gt(0, 'La grilla no trae información de empleados');
    
        await t
            .click(Selector('#BtnVacMas_Grabar span').withText('Grabar'))
            .wait(2000)
            .expect(toastProximamente.visible).ok('No se mostró el mensaje al grabar');
    
        await t
            .click(Selector('#BtnVacMas_Anular span').withText('Anular'))
            .wait(2000)
            .expect(toastProximamente.visible).ok('No se mostró el mensaje al anular');
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba VacacionesMasivas Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Vacaciones Masivas testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba VacacionesMasivas Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Vacaciones Masivas testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
