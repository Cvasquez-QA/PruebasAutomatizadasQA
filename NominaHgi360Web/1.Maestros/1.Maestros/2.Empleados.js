import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos, guardarYConfirmar } from '../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaGrid360,
    escribirCampoPopup360,
    guardarPopup360
} from '../../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroConfig360 } from '../../../Funciones/MenuMaestros360.js';
import { elegirEnPopup360, elegirEnSelectBox360, elegirRegistro360, cerrarToasts360, escribirEnPopup360, existeConEspera360 } from '../../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Maestros > Empleados (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy: crea el empleado,
// le agrega el contrato 1A, borra el contrato y borra el empleado.
// Se usa un código propio y no testNominaConfig.idEmpleado, que lo usan Liquidación y NominaE.
const GRID = 'gridEmpleados';
const GRID_CONTRATOS = 'gridEmpleadosContratos';
const EMPLEADO = {
    id: '111111199',
    nombre: testNominaConfig.nombEmpleado,
    apellido1: testNominaConfig.apellido1Empleado,
    apellido2: testNominaConfig.apellido2Empleado
};
const GUARDADO = /almacenad|guardad|cread|actualizad/i;

const GENERAL = [
    { id: 'txtEmpleado_Id', valor: EMPLEADO.id },
    { id: 'txtEmpleado_TipoId', tipo: 'lookup', opcion: 'Cedula de Ciudadania' },
    { id: 'txtEmpleado_PNombre', valor: EMPLEADO.nombre },
    { id: 'txtEmpleado_PApellido', valor: EMPLEADO.apellido1 },
    { id: 'txtEmpleado_SApellido', valor: EMPLEADO.apellido2 },
    { id: 'txtEmpleado_Direccion', valor: 'cra48 77c-06' },
    { id: 'txtEmpleados_Mail', valor: 'correoprueba@hotmail.com' }
];
const LABORAL = [
    { id: 'txtEmpleado_Turno', tipo: 'lookup', opcion: /GENERAL/ },
    { id: 'txtEmpleado_Ciudad', tipo: 'lookup', filtro: '05001', opcion: /05001/ },
    { id: 'txtEmpleado_Horas_Diaras', valor: '5' },
    { id: 'txtEmpleado_TipoSalario', tipo: 'lookup', opcion: /^\s*F\b/ },
    { id: 'txtEmpleado_SubTipoCotizante', tipo: 'lookup', opcion: /Independiente pensionado por vejez activo/ },
    { id: 'txtEmpleado_SalarioIntegral', tipo: 'check' },
    { id: 'txtEmpleado_SubsidioTransporte', tipo: 'check' },
    { id: 'txtEmpleado_RiesgoAFP', tipo: 'check' }
];
const NOMINA = [
    { id: 'txtEmpleado_FormaPago', tipo: 'lookup', opcion: /Transferencia/ },
    { id: 'txtEmpleado_Cuenta', valor: '2400000001' }
];
const TIPO_CUENTA = /Ahorros/i;
const ENTIDAD_FINANCIERA = 'BANCOLOMBIA';
const CONTRATO = {
    codigo: '1',
    tipo: 'Fijo',
    cotizante: 'Independiente',
    vinculacion: 'Contrato Laboral',
    salario: '2000000',
    ingreso: '2026-01-01',
    vence: '2026-12-12',
    retiro: '2026-12-13',
    motivo: 'PruebaQA'
};

const pestana = nombre => Selector(`#tabs_Empleado_${nombre}`).filterVisible();
const btnCerrarEmpleado = Selector('#BtnCancelarEmpleado').filterVisible();
const btnConfirmar = Selector('button.swal2-confirm').filterVisible();
const filaContrato = codigo => Selector(`#${GRID_CONTRATOS} tr.dx-data-row`).filterVisible()
    .find('td').withExactText(codigo).parent('tr');

/** Cierra el formulario y espera a volver al grid (después de guardar, Cerrar queda deshabilitado unos segundos). */
async function cerrarEmpleado(t) {
    const grid = Selector(`[data-testid="${GRID}"], #${GRID}`).filterVisible();
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
    await t.expect(grid.exists).ok('El formulario de Empleados no se cerró');
}

async function eliminarContrato(t, codigo) {
    const fila = filaContrato(codigo);
    await t
        .click(fila.find('[aria-label="Eliminar"]').nth(0))
        .click(btnConfirmar.with({ timeout: 10000 }))
        .expect(fila.with({ timeout: 15000 }).exists).notOk(`El contrato ${codigo} sigue en el empleado después de eliminarlo`);
}

/** Borra el empleado de una ejecución anterior (primero sus contratos, si los tiene). */
async function eliminarEmpleadoSiExiste(t) {
    await buscarEnGrid360(t, GRID, EMPLEADO.id);
    if (!await existeConEspera360(t, filaGrid360(GRID, EMPLEADO.id), 8000)) {
        return;
    }
    await accionFilaGrid360(t, GRID, EMPLEADO.id, 'Editar');
    await t.click(pestana('Laboral').with({ timeout: 15000 }));
    await existeConEspera360(t, Selector(`#${GRID_CONTRATOS} tr.dx-data-row`).filterVisible(), 5000);
    for (let i = 0; i < 5 && await Selector(`#${GRID_CONTRATOS} tr.dx-data-row`).filterVisible().exists; i++) {
        const codigo = await Selector(`#${GRID_CONTRATOS} tr.dx-data-row`).filterVisible().nth(0).find('td').nth(1).innerText;
        await eliminarContrato(t, codigo.trim());
    }
    await cerrarEmpleado(t);
    await buscarEnGrid360(t, GRID, EMPLEADO.id);
    await eliminarFilaGrid360(t, GRID, EMPLEADO.id);
}

fixture `Prueba Empleados CRUD Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Empleados CRUD - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirMaestroConfig360(t, testNominaConfig, 'Empleados');
    await eliminarEmpleadoSiExiste(t);

    // Crear
    await t
        .click(Selector('[aria-label="Nuevo"]').filterVisible().with({ timeout: 15000 }).nth(0))
        .expect(Selector('#txtEmpleado_Id').filterVisible().with({ timeout: 15000 }).exists)
        .ok('No se abrió el formulario de Empleados');
    await llenarCampos(t, GENERAL);
    await t.click(Selector('#txtEmpleado_Sexo .dx-radiobutton').nth(0));
    await t.click(pestana('Laboral'));
    await llenarCampos(t, LABORAL);
    await t.click(pestana('Nomina'));
    await llenarCampos(t, NOMINA);
    await elegirEnSelectBox360(t, '#txtEmpleado_TipoCuenta', TIPO_CUENTA);
    await elegirRegistro360(t, '#txtEmpleado_EntidadFinanciera', ENTIDAD_FINANCIERA);
    await guardarYConfirmar(t, 'BtnGuardarEmpleado', GUARDADO, `Crear empleado ${EMPLEADO.id}`);
    await cerrarEmpleado(t);
    await buscarEnGrid360(t, GRID, EMPLEADO.id);
    await t.expect(filaGrid360(GRID, EMPLEADO.id).with({ timeout: 15000 }).exists)
        .ok(`No se creó el empleado ${EMPLEADO.id}`);

    // Contrato
    await accionFilaGrid360(t, GRID, EMPLEADO.id, 'Editar');
    await t
        .click(pestana('Laboral').with({ timeout: 15000 }))
        .click(Selector(`#${GRID_CONTRATOS} [aria-label="Agregar una fila"]`).filterVisible().with({ timeout: 15000 }))
        .wait(2000);
    await escribirCampoPopup360(t, 'IntContrato', CONTRATO.codigo);
    await elegirEnPopup360(t, 'IntTipoContrato', CONTRATO.tipo);
    await elegirEnPopup360(t, 'StrTipoCotizante', CONTRATO.cotizante);
    await elegirEnPopup360(t, 'StrTipoVinculacion', CONTRATO.vinculacion);
    await escribirEnPopup360(t, 'IntSalarioActual', CONTRATO.salario);
    await escribirCampoPopup360(t, 'datFecIngreso', CONTRATO.ingreso);
    await escribirCampoPopup360(t, 'DatVenceContrato', CONTRATO.vence);
    await escribirCampoPopup360(t, 'DatFecRetiro', CONTRATO.retiro);
    await escribirCampoPopup360(t, 'StrMotivoRetiro', CONTRATO.motivo);
    await guardarPopup360(t);
    await t.expect(filaContrato(CONTRATO.codigo).with({ timeout: 15000 }).exists)
        .ok(`No se creó el contrato ${CONTRATO.codigo}`);

    await eliminarContrato(t, CONTRATO.codigo);
    await cerrarEmpleado(t);

    // Eliminar
    await buscarEnGrid360(t, GRID, EMPLEADO.id);
    await eliminarFilaGrid360(t, GRID, EMPLEADO.id);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
