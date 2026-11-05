import { Selector } from 'testcafe';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    filtrarPorEnModal,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const TIPO_IDENTIFICACION = 'CC - Cedula de Ciudadania';
const DIRECCION_INICIAL = 'cra48·77c-06';
const DIRECCION_EDITADA = 'NuevaCasa';
const CORREO = 'correoprueba@hotmail.com';
const TURNO = 'GENERAL';
const CODIGO_CIUDAD = '05001';
const CIUDAD = '05001 - MEDELLÍN';
const HORAS_DIARIAS = '5';
const HORAS_DIARIAS_EDITADAS = '7';
const TIPO_SALARIO = 'F';
const CONTRATO_INICIAL = 'contrat1452214';
const SUBTIPO_COTIZANTE = 'Independiente pensionado por vejez activo';
const SUBTIPO_COTIZANTE_EDITADO = 'Afiliado al ahorro programado de largo plazo y';
const FORMA_PAGO = 'Transferencia';
const NUMERO_CUENTA = '2400000001';
const TIPO_CUENTA = 'Ahorros';
const TIPO_CUENTA_EDITADO = 'Corriente';
const ENTIDAD_FINANCIERA = 'BANCOLOMBIA';
const CODIGO_CONTRATO = '1A';
const TIPO_CONTRATO = 'Fijo';
const TIPO_COTIZANTE = 'Independiente';
const TIPO_VINCULACION = 'Contrato Laboral';
const SALARIO = '2000000';
const FECHA_INGRESO = '2026-01-01';
const FECHA_VENCE_CONTRATO = '2026-12-12';
const FECHA_RETIRO = '2026-12-13';
const MOTIVO_RETIRO = 'PruebaQA';

const campoPorSufijoId = sufijo => Selector('[id]').withAttribute('id', new RegExp(`^dx_dx-.*_${sufijo}$`));
const botonEditarEmpleado = Selector('#gridEmpleados [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1);
const filtroEmpleados = Selector('#gridEmpleados .dx-texteditor-input').nth(0);
const filtroContratos = Selector('#gridEmpleadosContratos .dx-datagrid-filter-row .dx-texteditor-input').nth(0);
const gridContratosSinDatos = Selector('#gridEmpleadosContratos span').withText('Sin datos');
const btnEliminarContratoGrid = Selector('#gridEmpleadosContratos .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon');

async function limpiarYEscribir(t, selector, valor) {
    await t
        .click(selector)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(selector, valor);
}

async function crearContratoEmpleado(t) {
    const campoContrato = campoPorSufijoId('IntContrato');
    const campoSalario = campoPorSufijoId('IntSalarioActual');
    const campoFechaIngreso = campoPorSufijoId('datFecIngreso');
    const campoFechaVence = campoPorSufijoId('DatVenceContrato');
    const campoFechaRetiro = campoPorSufijoId('DatFecRetiro');
    const campoMotivoRetiro = campoPorSufijoId('StrMotivoRetiro');

    await t
        .click('#tabs_Empleado_Laboral')
        .click('#gridEmpleadosContratos .dx-icon.dx-icon-edit-button-addrow');

    await limpiarYEscribir(t, campoContrato, CODIGO_CONTRATO);

    await t.click('#gridEmpleadosContratos_IntTipoContrato_lookup_host .dx-lookup-field');
    await filtrarPorEnModal(t, TIPO_CONTRATO);
    await seleccionarOpcion(t, TIPO_CONTRATO);

    await t.click('#gridEmpleadosContratos_StrTipoCotizante_lookup_host .dx-lookup-field');
    await filtrarPorEnModal(t, TIPO_COTIZANTE);
    await seleccionarOpcion(t, TIPO_COTIZANTE);

    await t.click('#gridEmpleadosContratos_StrTipoVinculacion_lookup_host .dx-lookup-field');
    await filtrarPorEnModal(t, TIPO_VINCULACION);
    await seleccionarOpcion(t, TIPO_VINCULACION);

    await limpiarYEscribir(t, campoSalario, SALARIO);

    await t
        .click(campoFechaIngreso)
        .typeText(campoFechaIngreso, FECHA_INGRESO)
        .click(campoFechaVence)
        .typeText(campoFechaVence, FECHA_VENCE_CONTRATO)
        .click(campoFechaRetiro)
        .typeText(campoFechaRetiro, FECHA_RETIRO)
        .click(campoMotivoRetiro)
        .typeText(campoMotivoRetiro, MOTIVO_RETIRO)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] span').withText('Guardar'))
        .wait(2000);
}

async function eliminarContratoEmpleado(t) {
    await t
        .click(filtroContratos)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroContratos, CODIGO_CONTRATO)
        .click(Selector('#gridEmpleadosContratos .dx-icon.dx-icon-refresh'))
        .wait(5000)
        .click(Selector('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon'))
        .click(Selector('span').withText('Sí'))
        .wait(1500);
}

async function eliminarContratosPendientesEmpleado(t) {
    await t
        .click(botonEditarEmpleado)
        .wait(1000)
        .click('#tabs_Empleado_Laboral');

    while (!(await gridContratosSinDatos.visible)) {
        await t
            .click(btnEliminarContratoGrid)
            .click(Selector('span').withText('Sí'))
            .wait(1000)
            .click('#gridEmpleadosContratos .dx-icon.dx-icon-refresh')
            .wait(1000);
    }

    await t.click('#BtnCancelarEmpleado .dx-icon.dx-icon-close');
}

async function eliminarEmpleadoSiExiste(t, config) {
    const filaEmpleado = Selector('#gridEmpleados td').withText(config.idEmpleado);
    const btnEliminar = Selector('#gridEmpleados [class^="dx-button-mode-contained dx-link dx-link-delete dx"]');
    const btnEliminarGestion = Selector('[class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]');
    const btnAceptar = Selector('button').withText('Aceptar');
    const swalAbierto = Selector('.swal2-container.swal2-shown');
    const textoSwal = Selector('#swal2-html-container, #swal2-content, .swal2-content');

    await t
        .click(filtroEmpleados)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(filtroEmpleados, config.idEmpleado)
        .wait(2000);

    if (!(await filaEmpleado.visible)) return;

    if (await btnEliminar.visible) {
        await t.click(btnEliminar);
    } else {
        await t.click(btnEliminarGestion);
    }

    await t.click(btnAceptar).wait(1500);

    if (await swalAbierto.exists) {
        const texto = await textoSwal.innerText;

        if (/No se puede eliminar/i.test(texto)) {
            await t.click(btnAceptar);
            await eliminarContratosPendientesEmpleado(t);
            await t
                .click(filtroEmpleados)
                .pressKey('ctrl+a')
                .pressKey('backspace');
            await eliminarRegistroSiExiste(t, '#gridEmpleados', config.idEmpleado);
        } else {
            await t.click(btnAceptar).wait(1000);
        }
    }
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Empleados');
    await eliminarEmpleadoSiExiste(t, config);

    await t
        .click('#gridEmpleados .dx-icon.dx-icon-add')
        .typeText('#txtEmpleado_Id .dx-texteditor-input', config.idEmpleado)
        .click('#txtEmpleado_TipoId .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TIPO_IDENTIFICACION);
    await t
        .typeText('#txtEmpleado_PNombre .dx-texteditor-input', config.nombEmpleado)
        .typeText('#txtEmpleado_PApellido .dx-texteditor-input', config.apellido1Empleado)
        .typeText('#txtEmpleado_SApellido .dx-texteditor-input', config.apellido2Empleado)
        .typeText('#txtEmpleado_Direccion .dx-texteditor-input', DIRECCION_INICIAL)
        .typeText('#txtEmpleados_Mail .dx-texteditor-input', CORREO)
        .click(Selector('#txtEmpleado_Sexo .dx-radiobutton-icon'))
        .click(Selector('.dx-radiobutton-icon').nth(2))
        .click('#tabs_Empleado_Laboral')
        .click('#txtEmpleado_Turno .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TURNO);
    await t
        .click('#txtEmpleado_Ciudad .dx-lookup-field')
        .typeText('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input', CODIGO_CIUDAD)
        .wait(2000)
        ;
    await seleccionarOpcion(t, CIUDAD);
    await t
        .typeText('#txtEmpleado_Horas_Diaras .dx-texteditor-input', HORAS_DIARIAS)
        .click('#txtEmpleado_TipoSalario .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TIPO_SALARIO);
    await t
        .typeText('#txtEmpleado_ContratoActual .dx-texteditor-input', CONTRATO_INICIAL)
        .click('#txtEmpleado_SubTipoCotizante .dx-lookup-field')
        ;
    await seleccionarOpcion(t, SUBTIPO_COTIZANTE);
    await t
        .click('#txtEmpleado_SalarioIntegral .dx-checkbox-icon')
        .click('#txtEmpleado_SubsidioTransporte .dx-checkbox-icon')
        .click(Selector('#txtEmpleado_RiesgoAFP span').withText('Riesgo AFP'))
        .click('#tabs_Empleado_Nomina')
        .click('#txtEmpleado_FormaPago .dx-lookup-field')
        ;
    await seleccionarOpcion(t, FORMA_PAGO);
    await t
        .typeText('#txtEmpleado_Cuenta .dx-texteditor-input', NUMERO_CUENTA)
        .click('#txtEmpleado_TipoCuenta .dx-lookup-field')
        ;
    await seleccionarOpcion(t, TIPO_CUENTA);
    await t
        .click('#txtEmpleado_EntidadFinanciera .dx-lookup-field')
        ;
    await seleccionarOpcion(t, ENTIDAD_FINANCIERA);
    await t
        .click(Selector('#BtnGuardarEmpleado span').withText('Guardar'))
        .wait(1000)
        .click(Selector('#BtnGuardarEmpleado span').withText('Guardar'))
        .expect(Selector('#gridEmpleados td').withText(config.idEmpleado).exists).ok();

    await t
        .wait(2000)
        .click(botonEditarEmpleado);

    await crearContratoEmpleado(t);
    await eliminarContratoEmpleado(t);

    await t
        .click('#BtnCancelarEmpleado .dx-icon.dx-icon-close')
        .click(Selector('[class^="dx-button-mode-contained dx-eliminar-gestion dx-li"]'))
        .click(Selector('button').withText('Aceptar'))
        .wait(2000);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Empleados CRUD Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Empleados CRUD - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Empleados CRUD Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Empleados CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
