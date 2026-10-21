import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - IMPUESTOS Y UNIDADES (test.hgi360.com, AutPos).
// Por cada maestro: crea el registro de prueba, intenta crearlo de nuevo con el mismo código,
// valida el rechazo ("Ya existe un registro...") y borra el registro.
// Las definiciones son las mismas de las pruebas CRUD de 1.Maestros (selectores validados).
// No incluidos: Entidades Financieras, Monedas, Tarifas CREE (no están en el menú de Maestros del módulo POS).

const BANCOSUX = {
    maestro: 'Bancos',
    grupo: 'impuestos',
    grid: 'gridBancos',
    guardar: 'BtnActualizarBanco_btn',
    campoCodigo: 'txtBancos_Codigo',
    codigo: 'QABAN1',
    crear: [
        { id: 'txtBancos_Descripcion', valor: 'midescripcion' },
        { id: 'txtBancos_Consecutivo', valor: '1212' },
        { id: 'txtBancos_Tipo', tipo: 'lookup', opcion: 'Ahorros' },
        { id: 'txtBancos_NroCuenta', valor: '24006124298' },
        { id: 'txtMaestroBancos_EntidadFin', tipo: 'lookup', filtro: '07', opcion: '07 - BANCOLOMBIA' },
        { id: 'txtBancos_Formato', tipo: 'lookup', opcion: 'BancolombiaSAP' }
    ],
    editar: [
        { id: 'txtBancos_Descripcion', valor: 'minuevadescripcion' }
    ],
    validarEditado: 'minuevadescripcion'
};

const CONCEPTOSDEPAGOUX = {
    maestro: 'Conceptos Pago',
    grupo: 'impuestos',
    grid: 'gridConceptosPago',
    guardar: 'BtnActualizarConceptosPago_btn',
    campoCodigo: 'txtStrIdConceptoPago',
    codigo: 'QACPG1',
    crear: [
        { id: 'txtConceptoPago_Descripcion', valor: 'midescripcionconceptopago' },
        { id: 'txtConceptoPago_Tipo', tipo: 'lookup', opcion: 'Pago' },
        { id: 'txtConceptoPago_Valor', valor: '100000' },
        { id: 'txtMaestroConceptosPago_CuentaPCGA', tipo: 'lookup', filtro: 'ACTIVO', opcion: '1 - ACTIVO PCGA' },
        { id: 'txtMaestroConceptosPago_CuentaNIIF', tipo: 'lookup', filtro: 'ACTIVO', opcion: '1 - ACTIVO NIIF' },
        { id: 'txtConceptosPago_ActualizaValor', tipo: 'check' },
        { id: 'txtConceptosPago_IntCartera', tipo: 'check' },
        { id: 'txtConceptosPago_ValidaSaldoCartera', tipo: 'check' }
    ],
    editar: [
        { id: 'txtConceptoPago_Descripcion', valor: 'miNUEVAdescripcionconceptopago' },
        { id: 'txtConceptoPago_Tipo', tipo: 'lookup', opcion: 'Deducción' },
        { id: 'txtConceptosPago_IntCartera', tipo: 'check' },
        { id: 'txtConceptosPago_ActualizaValor', tipo: 'check' }
    ],
    validarEditado: 'miNUEVAdescripcionconceptopago'
};

const FORMASDEPAGOUX = {
    maestro: 'Formas de Pago',
    grupo: 'impuestos',
    grid: 'gridFormasPago',
    guardar: 'BtnGuardarFormaPago_btn',
    campoCodigo: 'txtFormaPago_Id',
    codigo: '3276',
    crear: [
        { id: 'txtFormaPago_Descripcion', valor: 'MiDescripcionFormadepago' },
        { id: 'txtFormaPago_Grupo', tipo: 'lookup', opcion: '6 - Bono' },
        { id: 'txt_lista_FormaPagoFPagoDian', tipo: 'lookup', filtro: 'Bono', opcion: 'Bono' },
        { id: 'FormasPago_Banco', tipo: 'lookup', opcion: '0 - GENERAL' }
    ],
    editar: [
        { id: 'txtFormaPago_Descripcion', valor: 'minuevadescripcionformadepago' },
        { id: 'txtFormaPago_Consulta', tipo: 'check' }
    ],
    validarEditado: 'minuevadescripcionformadepago'
};

const TABLASRETEFTEUX = {
    maestro: 'Maestro de Retención',
    grupo: 'impuestos',
    grid: 'gridTarifasRetenciones',
    guardar: 'BtnGuardarTarifasRetencion_btn',
    campoCodigo: 'txtTarifasRetencion_Id',
    codigo: 'QARTF1',
    crear: [
        { id: 'txtTarifasRetencion_Descripcion', valor: 'DESCRIPCIONRETEFUENTE' },
        { id: 'txtTarifasRetencion_BaseRteFte', valor: '5314' },
        { id: 'txtTarifasRetencion_PorcentajeND', valor: '801' },
        { id: 'txtTarifasRetencion_PorcentajeDecl', valor: '100' },
        { id: 'txtTarifasRetencion_BaseRteIca', valor: '896' },
        { id: 'txtTarifasRetencion_Porcentaje', valor: '5664' }
    ],
    editar: [
        { id: 'txtTarifasRetencion_Descripcion', valor: 'NuevaDescripciónReteFuente' },
        { id: 'txtTarifasRetencion_BaseRteFte', valor: '5000' },
        { id: 'txtTarifasRetencion_BaseRteIca', valor: '800069' },
        { id: 'txtTarifasRetencion_Porcentaje', valor: '8411' }
    ],
    validarEditado: 'NuevaDescripciónReteFuente'
};

const TARIFASDEIMPUESTOUX = {
    maestro: 'Tarifas de Impuesto',
    grupo: 'impuestos',
    grid: 'gridTarifasImpto1',
    guardar: 'BtnGuardarTarifaImpto1_btn',
    campoCodigo: 'txtTarifaImpto1_Id',
    codigo: 'QATI1',
    crear: [
        { id: 'txtTarifaImpto1_Descripcion', valor: 'midectaridaimpuyesto' },
        { id: 'txtTarifaImpto1_Porcentaje', valor: '333' }
    ],
    editar: [
        { id: 'txtTarifaImpto1_Descripcion', valor: 'minuevadesc' },
        { id: 'txtTarifaImpto1_Porcentaje', valor: '12' }
    ],
    validarEditado: 'minuevadesc'
};

const TARIFASDEIVAUX = {
    maestro: 'Tarifas de Iva',
    grupo: 'impuestos',
    grid: 'gridTarifasIva',
    guardar: 'BtnGuardarTarifaIva_btn',
    campoCodigo: 'txtTarifaIva_Id',
    codigo: 'QAIVA1',
    crear: [
        { id: 'txtTarifaIva_Descripcion', valor: 'MiDescTarifaIva123' },
        { id: 'txtTarifaIva_Porcentaje', valor: '40' },
        { id: 'txtTarifaIva_Porcentaje2', valor: '1' }
    ],
    editar: [
        { id: 'txtTarifaIva_Descripcion', valor: 'minuevadescripcion' },
        { id: 'txtTarifaIva_Porcentaje2', valor: '8' }
    ],
    validarEditado: 'minuevadescripcion'
};

const UNIDADESUX = {
    maestro: 'Unidades',
    grupo: 'impuestos',
    grid: 'gridUnidades',
    guardar: 'BtnGuardarUnidad_btn',
    campoCodigo: 'txtUnidad_Id',
    codigo: 'QAUN',
    crear: [
        { id: 'txtUnidad_Descripcion', valor: 'midescunidad' },
        { id: 'txtUnidad_Codigo_DIAN', tipo: 'lookup', filtro: '91', opcion: /^\s*91 -/ }
    ],
    editar: [
        { id: 'txtUnidad_Descripcion', valor: 'minuevadescunidad' },
        { id: 'txtUnidad_Codigo_DIAN', tipo: 'lookup', filtro: 'A1', opcion: /^\s*A1 -/ }
    ],
    validarEditado: 'minuevadescunidad'
};

const MAESTROS = [BANCOSUX, CONCEPTOSDEPAGOUX, FORMASDEPAGOUX, TABLASRETEFTEUX, TARIFASDEIMPUESTOUX, TARIFASDEIVAUX, UNIDADESUX];

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - IMPUESTOS Y UNIDADES - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro, testPosWebConfig);
    }
    await cerrarSesion360(t);
});
