import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, guardarYConfirmar } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirUtilitarios360,
    buscarEnGrid360,
    accionFilaGrid360,
    guardarPopup360
} from '../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroConfig360 } from '../../Funciones/MenuMaestros360.js';
import { aviso360, elegirRegistro360, escribirEnPopup360, cerrarToasts360 } from '../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Utilitarios > Cambio Salarios (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy: incrementa el
// salario del empleado por porcentaje, por valor y por rango de salario, y valida cada cambio en el contrato.
// A diferencia de la legacy, al final restaura el salario original editando el contrato (aunque la prueba falle).
const ID_EMPLEADO = '1000099598';
const INCREMENTO_PORCENTAJE = 10;
const INCREMENTO_VALOR = 1000000;
const GRID = 'gridEmpleados';
const GRID_CONTRATOS = 'gridEmpleadosContratos';

const filaContrato = Selector(`#${GRID_CONTRATOS} tr.dx-data-row`).filterVisible().nth(0);
const btnCerrarEmpleado = Selector('#BtnCancelarEmpleado').filterVisible();
const btnConfirmar = Selector('button.swal2-confirm').filterVisible();
const resultado = aviso360(/Empleados actualizados:\s*1\b/i);

const aNumero = texto => parseFloat(String(texto).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));

async function abrirContratoEmpleado(t) {
    await abrirMaestroConfig360(t, testNominaConfig, 'Empleados');
    await buscarEnGrid360(t, GRID, ID_EMPLEADO);
    await accionFilaGrid360(t, GRID, ID_EMPLEADO, 'Editar');
    await t
        .click(Selector('#tabs_Empleado_Laboral').filterVisible().with({ timeout: 15000 }))
        .expect(filaContrato.with({ timeout: 15000 }).exists).ok(`El empleado ${ID_EMPLEADO} no tiene contratos`);
}

async function cerrarEmpleado(t) {
    const grid = Selector(`#${GRID}`).filterVisible();
    await cerrarToasts360(t);
    const inicio = Date.now();
    while (!await grid.exists && Date.now() - inicio < 30000) {
        if (await btnConfirmar.exists) {
            await t.click(btnConfirmar);
        } else if (await btnCerrarEmpleado.exists && !(await btnCerrarEmpleado.hasClass('dx-state-disabled'))) {
            await t.click(btnCerrarEmpleado);
        }
        await t.wait(1000);
    }
    await cerrarPestana360(t);
}

/** Salario del primer contrato del empleado (columna "Salario" del grid de contratos). */
async function leerSalario(t) {
    await abrirContratoEmpleado(t);
    const cabeceras = Selector(`#${GRID_CONTRATOS} .dx-header-row td`).filterVisible();
    let columna = -1;
    for (let i = 0; i < await cabeceras.count; i++) {
        if ((await cabeceras.nth(i).innerText).trim() === 'Salario') {
            columna = i;
        }
    }
    await t.expect(columna).gte(0, 'No se encontró la columna Salario en los contratos');
    const salario = Math.round(aNumero(await filaContrato.find('td').nth(columna).innerText));
    await cerrarEmpleado(t);
    return salario;
}

/** Abre Cambio Salarios, elige el empleado, aplica el incremento y espera "Empleados actualizados: 1". */
async function aplicarIncremento(t, { porcentaje = null, valor = null, desde = null, hasta = null }) {
    await abrirUtilitarios360(t, 'Cambio Salarios');
    await t.expect(Selector('#cambioSalarios_BtnGenerar').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Utilitarios > Cambio Salarios');
    await elegirRegistro360(t, '#txt_lista_CambioSalarios_Empleado', ID_EMPLEADO);
    // Pegado: al escribir carácter por carácter el NumberBox con formato corta los valores grandes (3200000 queda 3.200)
    const escribir = async (id, texto) => t
        .typeText(Selector(`#${id} .dx-texteditor-input`), String(texto), { replace: true, paste: true })
        .pressKey('tab');
    if (porcentaje !== null) {
        await escribir('txt_CambioSalarios_Porcentaje', porcentaje);
    } else {
        await t.click(Selector('#rg_CambioSalarios_TipoIncremento .dx-radiobutton').withText('Valor'));
        await escribir('txt_CambioSalarios_Valor', valor);
    }
    if (desde !== null) {
        await escribir('txt_CambioSalarios_SalarioInicial', desde);
        await escribir('txt_CambioSalarios_SalarioFinal', hasta);
    }
    await t.click(Selector('#cambioSalarios_BtnGenerar').filterVisible());

    // Antes del resultado puede pedir confirmación
    const pregunta = Selector('.swal2-popup, .dx-dialog').filterVisible()
        .filter(nodo => !/Empleados actualizados/i.test(nodo.textContent));
    const confirmarPregunta = pregunta.find('button.swal2-confirm, .dx-button').withText(/^\s*(S[ií]|Aceptar|Confirmar|OK)\b/i);
    const inicio = Date.now();
    while (!await resultado.exists && Date.now() - inicio < 30000) {
        if (await confirmarPregunta.exists) {
            await t.click(confirmarPregunta.nth(0));
        }
        await t.wait(500);
    }
    await t.expect(resultado.exists).ok('Cambio Salarios no confirmó "Empleados actualizados: 1"');
    const aceptar = resultado.find('button.swal2-confirm');
    if (await aceptar.exists) {
        await t.click(aceptar);
    }
    await t.wait(1500);
    await cerrarPestana360(t);
}

/** Deja el salario del contrato en el valor indicado (Editar contrato > IntSalarioActual > Guardar). */
async function restaurarSalario(t, salario) {
    await abrirContratoEmpleado(t);
    await t.click(filaContrato.find('[aria-label="Editar"]').nth(0));
    await escribirEnPopup360(t, 'IntSalarioActual', salario);
    await guardarPopup360(t);
    await guardarYConfirmar(t, 'BtnGuardarEmpleado', /almacenad|guardad|actualizad/i, `Restaurar salario de ${ID_EMPLEADO}`);
    await cerrarEmpleado(t);
}

fixture `Prueba Cambio Salarios Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Cambio Salarios - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    const salarioInicial = await leerSalario(t);
    await t.expect(salarioInicial).gt(0, `No se pudo leer el salario de ${ID_EMPLEADO}`);

    try {
        await aplicarIncremento(t, { porcentaje: INCREMENTO_PORCENTAJE });
        const despuesPorcentaje = await leerSalario(t);
        await t.expect(despuesPorcentaje).eql(Math.round(salarioInicial * (1 + INCREMENTO_PORCENTAJE / 100)),
            `El salario no refleja el incremento del ${INCREMENTO_PORCENTAJE}%`);

        await aplicarIncremento(t, { valor: INCREMENTO_VALOR });
        const despuesValor = await leerSalario(t);
        await t.expect(despuesValor).eql(despuesPorcentaje + INCREMENTO_VALOR,
            `El salario no refleja el incremento de ${INCREMENTO_VALOR}`);

        await aplicarIncremento(t, { valor: INCREMENTO_VALOR, desde: despuesValor, hasta: despuesValor + 1 });
        const despuesRango = await leerSalario(t);
        await t.expect(despuesRango).eql(despuesValor + INCREMENTO_VALOR,
            `El salario no refleja el incremento de ${INCREMENTO_VALOR} por rango de salario`);
    } finally {
        await restaurarSalario(t, salarioInicial);
    }

    await t.expect(await leerSalario(t)).eql(salarioInicial, `No se restauró el salario original de ${ID_EMPLEADO}`);
    await cerrarSesion360(t);
});
