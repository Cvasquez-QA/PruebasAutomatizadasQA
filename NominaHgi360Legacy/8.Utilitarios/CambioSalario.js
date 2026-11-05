import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirUtilitarios,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const ID_EMPLEADO = '1000099598';
const EMPLEADO_LOOKUP = '1000099598 - Vasquez Suarez Camilo';
const INCREMENTO_PORCENTAJE = 10;
const INCREMENTO_VALOR = 1000000;
const MENSAJE_EXITO = 'Proceso realizado. Empleados actualizados: 1.';
const MAESTRO_EMPLEADOS = 'Empleados';
const UTILITARIO_CAMBIO_SALARIOS = 'CAMBIO SALARIOS';

const desplegableLookup = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input');

const filaSalarioLaboral = Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines"]').nth(1).find('td').nth(4);

const normalizarNumero = valor => {
    if (valor === null || valor === undefined) return NaN;
    const limpio = String(valor).trim();
    if (!limpio) return NaN;
    return parseFloat(limpio.replace(/\./g, '').replace(',', '.'));
};

const obtenerSalarioLaboral = async () => {
    const textoSalario = await filaSalarioLaboral.innerText;
    return Math.round(normalizarNumero(textoSalario));
};

const abrirEmpleadoLaboral = async t => {
    await abrirMaestros360(t, MAESTRO_EMPLEADOS);
    await t
        .typeText(Selector('#gridEmpleados .dx-texteditor-input'), ID_EMPLEADO)
        .wait(2000)
        .click(Selector('#gridEmpleados [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000)
        .click('#tabs_Empleado_Laboral')
        .wait(2000);
};

const seleccionarEmpleadoCambioSalarios = async t => {
    await t
        .click('#txt_lista_CambioSalarios_Empleado .dx-lookup-field')
        .typeText(desplegableLookup, ID_EMPLEADO)
        .wait(2000)
        .click(Selector('.dx-item.dx-list-item div').withText(EMPLEADO_LOOKUP));
};

const validarToastExito = async t => {
    await t
        .expect(Selector('[class^="dx-overlay-content dx-toast-success dx-toast-content"] div')
            .withText(MENSAJE_EXITO).visible).ok();
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirEmpleadoLaboral(t);
        const salarioInicial = await obtenerSalarioLaboral();
        await cerrarPestana360(t);
        await t.wait(1500);
    
        await abrirUtilitarios(t, UTILITARIO_CAMBIO_SALARIOS);
        await seleccionarEmpleadoCambioSalarios(t);
        await t
            .click('#txt_CambioSalarios_Porcentaje .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txt_CambioSalarios_Porcentaje .dx-texteditor-input', String(INCREMENTO_PORCENTAJE))
            .click(Selector('#cambioSalarios_BtnGenerar span').withText('Aplicar incremento'))
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'));
        await validarToastExito(t);
        await cerrarPestana360(t);
        await t.wait(1500);
    
        const salarioEsperado10 = Math.round(salarioInicial * (1 + INCREMENTO_PORCENTAJE / 100));
    
        await abrirEmpleadoLaboral(t);
        const salarioDespues10 = await obtenerSalarioLaboral();
        await t.expect(salarioDespues10).eql(salarioEsperado10, 'El salario no refleja el incremento del 10%');
        await cerrarPestana360(t);
        await t.wait(1500);
    
        await abrirUtilitarios(t, UTILITARIO_CAMBIO_SALARIOS);
        await seleccionarEmpleadoCambioSalarios(t);
        await t
            .click(Selector('#rg_CambioSalarios_TipoIncremento .dx-radio-value-container').nth(1))
            .click('#txt_CambioSalarios_Valor .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txt_CambioSalarios_Valor .dx-texteditor-input', String(INCREMENTO_VALOR))
            .click(Selector('#cambioSalarios_BtnGenerar span').withText('Aplicar incremento'))
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'));
        await validarToastExito(t);
        await cerrarPestana360(t);
        await t.wait(1500);
    
        const salarioEsperadoMillon = salarioDespues10 + INCREMENTO_VALOR;
    
        await abrirEmpleadoLaboral(t);
        const salarioDespuesMillon = await obtenerSalarioLaboral();
        await t.expect(salarioDespuesMillon).eql(salarioEsperadoMillon, 'El salario no refleja el incremento de 1000000');
        await cerrarPestana360(t);
        await t.wait(1500);
    
        await abrirUtilitarios(t, UTILITARIO_CAMBIO_SALARIOS);
        await seleccionarEmpleadoCambioSalarios(t);
        await t
            .click(Selector('#rg_CambioSalarios_TipoIncremento .dx-radio-value-container').nth(1))
            .click('#txt_CambioSalarios_Valor .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txt_CambioSalarios_Valor .dx-texteditor-input', String(INCREMENTO_VALOR))
            .click('#txt_CambioSalarios_SalarioInicial .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txt_CambioSalarios_SalarioInicial .dx-texteditor-input', String(salarioDespuesMillon))
            .click('#txt_CambioSalarios_SalarioFinal .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txt_CambioSalarios_SalarioFinal .dx-texteditor-input', String(salarioDespuesMillon + 1))
            .click(Selector('#cambioSalarios_BtnGenerar span').withText('Aplicar incremento'))
            .wait(2000)
            .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'));
        await validarToastExito(t);
        await cerrarPestana360(t);
        await t.wait(1500);
    
        const salarioEsperadoFinal = salarioDespuesMillon + INCREMENTO_VALOR;
    
        await abrirEmpleadoLaboral(t);
        const salarioFinal = await obtenerSalarioLaboral();
        await t.expect(salarioFinal).eql(salarioEsperadoFinal, 'El salario no refleja el incremento final de 1000000');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba CambioSalario Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Cambio Salarios testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba CambioSalario Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Cambio Salarios testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
