import { Selector } from 'testcafe';
import {
    abrirMovimiento,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const ID_EMPLEADO = '1000099598';
const CODIGO_CONCEPTO = '001';
const OBSERVACION_FINANCIADO = 'obs1';
const OBSERVACION_EDITADA = 'prueba1';

const seleccionarEmpleadoYConcepto = async t => {
    await t
        .click('#lkpEmpleadoNomMPrestamos .dx-lookup-field')
        .typeText(Selector('.dx-overlay-content').filterVisible().find('.dx-texteditor-input'), ID_EMPLEADO)
        .wait(2000)
        .click(seleccionarOpcion(ID_EMPLEADO))
        .click('#lkpConceptoNomMPrestamos .dx-lookup-field')
        .typeText(Selector('.dx-overlay-content').filterVisible().find('.dx-texteditor-input'), CODIGO_CONCEPTO)
        .wait(2000)
        .click(seleccionarOpcion(CODIGO_CONCEPTO))
        .wait(2000);
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'PRESTAMOS');
        await seleccionarEmpleadoYConcepto(t);
    
        await t
            .maximizeWindow()
            .typeText(Selector('#gridNomMPrestamos .dx-texteditor-input').nth(8), OBSERVACION_FINANCIADO)
            .wait(2000);
    
        if (await Selector('#gridNomMPrestamos td').withText(OBSERVACION_FINANCIADO).exists) {
            await t
                .click(Selector('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon'))
                .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'))
                .wait(3000);
        }
    
        await t
            .click('#lblFinanciacionNomMPrestamos')
            .typeText('#txtValorFinanciacionNomMPrestamos .dx-texteditor-input', '2000')
            .typeText('#txtMesesNomMPrestamos .dx-texteditor-input', '2')
            .typeText('#txtInteresFinanciacionNomMPrestamos .dx-texteditor-input', '10')
            .typeText('#txtValorMesNomMPrestamos .dx-texteditor-input', '2')
            .typeText('#txtObservacionFinNomMPrestamos .dx-texteditor-input', OBSERVACION_FINANCIADO)
            .click('#btnAdicionarFinNomMPrestamos .dx-icon.dx-icon-add')
            .click(Selector('#btnCalcularNomMPrestamos span').withText('Calcular'))
            .click('#txtValorPeriodoNomMPrestamos .dx-texteditor-input')
            .click(Selector('#btnAdicionarFinNomMPrestamos span').withText('Adicionar'))
            .wait(3000)
            .expect(Selector('td').withText(OBSERVACION_FINANCIADO).exists).ok()
        //Se comienza con la inserción de datos para la creación del Prestamo Financiado
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridNomMPrestamos td').withText(OBSERVACION_FINANCIADO).exists).ok()
    //Se edita el Prestamo
            .click(Selector('.dx-link.dx-link-edit.dx-icon-edit.dx-link-icon'))
            .click(Selector('[id$="_IntValor"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_IntValor"]'), '5000')
            .click(Selector('[id$="_IntCuota"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_IntCuota"]'), '1')
            .click(Selector('[id$="_IntTasa"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_IntTasa"]'), '20')
            .click(Selector('[id$="_StrObservaciones"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_StrObservaciones"]'), OBSERVACION_EDITADA)
            .click(Selector('span').withText('Guardar'))
            .wait(3000)
            .click(Selector('#gridNomMPrestamos .dx-texteditor-input').nth(8))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('#gridNomMPrestamos .dx-texteditor-input').nth(8), OBSERVACION_EDITADA)
            .expect(Selector('#gridNomMPrestamos td').withText(OBSERVACION_EDITADA).exists).ok()
            .click(Selector('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon'))
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'))
            .wait(3000)
            .switchToMainWindow();
    
        await cerrarSesion360(t);
}

fixture `Prueba Prestamos Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Prestamo Financiado testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Prestamos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Prestamo Financiado testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
