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
const OBSERVACION_NORMAL = 'pruebaPrestamoNormal';
const OBSERVACION_FINANCIADO = 'obs1';
const OBSERVACION_EDITADA = 'prueba1';
const VALOR_NORMAL = '1000';
const VALOR_FINANCIADO = '2000';
const VALOR_EDITADO = '5000';
const CANTIDAD_CUOTAS = '1';
const CANTIDAD_MESES = '2';
const TASA_INICIAL = '10';
const TASA_EDITADA = '20';
const VALOR_MENSUAL = '2';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimiento(t, 'PRESTAMOS');
    
        await t
            .maximizeWindow()
            .click('#lkpEmpleadoNomMPrestamos .dx-lookup-field')
            .typeText(Selector('.dx-overlay-content').filterVisible().find('.dx-texteditor-input'), ID_EMPLEADO)
            .wait(2000)
            ;
    await seleccionarOpcion(t, ID_EMPLEADO);
    await t
            .typeText(Selector('#gridNomMPrestamos .dx-texteditor-input').nth(8), OBSERVACION_NORMAL)
            .wait(2000);
    
        if (await Selector('#gridNomMPrestamos td').withText(OBSERVACION_NORMAL).exists) {
            await t
                .click(Selector('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon'))
                .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'))
                .wait(3000);
        }
    
        await t
            .click('#lkpConceptoNomMPrestamos .dx-lookup-field')
            .typeText(Selector('.dx-overlay-content').filterVisible().find('.dx-texteditor-input'), CODIGO_CONCEPTO)
            .wait(2000)
            ;
    await seleccionarOpcion(t, CODIGO_CONCEPTO);
    await t
            .wait(2000)
            .typeText('#txtValorNomMPrestamos .dx-texteditor-input', VALOR_NORMAL)
            .typeText('#txtCuotaNomMPrestamos .dx-texteditor-input', CANTIDAD_CUOTAS)
            .typeText('#txtTasaNomMPrestamos .dx-texteditor-input', TASA_INICIAL)
            .typeText('#txtObservacionNomMPrestamos .dx-texteditor-input', OBSERVACION_NORMAL)
            .click(Selector('#btnAceptarNomMPrestamos span').withText('Adicionar'))
            .wait(3000)
            .expect(Selector('#gridNomMPrestamos td').withText(OBSERVACION_NORMAL).exists).ok()
            .click(Selector('.dx-link.dx-link-edit.dx-icon-edit.dx-link-icon'))
            .click(Selector('[id$="_IntValor"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_IntValor"]'), VALOR_EDITADO)
            .click(Selector('[id$="_IntCuota"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_IntCuota"]'), CANTIDAD_CUOTAS)
            .click(Selector('[id$="_IntTasa"]'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(Selector('[id$="_IntTasa"]'), TASA_EDITADA)
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
            .wait(3000);
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba Prestamos Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Prestamo Normal testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Prestamos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Prestamo Normal testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
