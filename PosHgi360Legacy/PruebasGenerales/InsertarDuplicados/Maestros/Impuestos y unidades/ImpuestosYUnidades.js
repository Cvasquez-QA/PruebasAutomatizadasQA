import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO = '01';
const CODIGO_CERO = '0';
const DESCRIPCION_BANCO = 'midescripcion';
const DESCRIPCION_CONCEPTO_PAGO = 'midescripcionconceptopago';
const TIPO_PAGO = '1 - Pago';
const VALOR_CONCEPTO = '999999999999';
const CUENTA_ACTIVO = '1 - ACTIVO';
const DESCRIPCION_ENTIDAD = 'midescentidadfin';
const CODIGO_ACH = 'miacn()';
const CODIGO_ACH1 = 'miach#';
const DESCRIPCION_FORMA_PAGO = 'MiDescripcionFormadepago';
const GRUPO_FORMA_PAGO = '6 - Bono';
const FORMA_PAGO_DIAN = '71 - Bonos';
const BANCO_FORMA_PAGO = '07 - AHORROS BANCOLOMBIA';
const DESCRIPCION_MONEDA = 'midescmoneda123';
const MONEDA_ISO = 'AFN - Afgani';
const DESCRIPCION_RETEFUENTE = 'DESCRIPCIONRETEFUENTE';
const BASE_RTE_FTE = '5314';
const PORCENTAJE_ND = '801';
const PORCENTAJE_DECL = '100';
const BASE_RTE_ICA = '896';
const PORCENTAJE_RETEFUENTE = '5664';
const DESCRIPCION_CREE = 'MIDESC123';
const PORCENTAJE_CREE = '87500';
const DESCRIPCION_IMPUESTO = 'midectaridaimpuyesto';
const PORCENTAJE_IMPUESTO = '333';
const DESCRIPCION_IVA = 'MiDescTarifaIva123';
const PORCENTAJE_IVA = '40';
const PORCENTAJE_IVA2 = '1';
const DESCRIPCION_UNIDAD = 'midescunidad';
const CODIGO_DIAN_UNIDAD = '91 - alimenta';

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inserción Duplicados - IMPUESTOS Y UNIDADES - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirMaestros360(t, 'Bancos', 'impuestos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#gridBancos .dx-icon.dx-icon-add')
    //Se ingresa la información para la creación del banco
        .typeText('#txtBancos_Codigofoco', CODIGO)
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION_BANCO)
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA CONCEPTOS DE PAGO
 //Se ingresa al maestro de Conceptos pago

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Conceptos Pago', 'impuestos');
    await t
        .click('#gridConceptosPago .dx-icon.dx-icon-add')
    //Se ingresa la información para la creación del concepto de pago
        .typeText('#txtStrIdConceptoPagofoco', CODIGO)
        .typeText('#txtConceptoPago_Descripcion .dx-texteditor-input', DESCRIPCION_CONCEPTO_PAGO)
        .click(Selector('#txtConceptoPago_Tipo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_PAGO);
    await t
        .typeText('#txtConceptoPago_Valor .dx-texteditor-input', VALOR_CONCEPTO)
        .click('#txtMaestroConceptosPago_CuentaPCGA .dx-lookup-field')
        ;
    await seleccionarOpcion(t, CUENTA_ACTIVO);
    await t
        .click('#txtMaestroConceptosPago_CuentaNIIF .dx-lookup-field')
        ;
    await seleccionarOpcion(t, CUENTA_ACTIVO);
    await t
        .click('#txtConceptosPago_ActualizaValor .dx-checkbox-icon')
        .click(Selector('#txtConceptosPago_IntCartera span').withText('Actualiza Cartera'))
        .click('#txtConceptosPago_ValidaSaldoCartera .dx-checkbox-icon')
        .click(Selector('#BtnActualizarConceptosPago div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA CONCEPTOS DE PAGO
    //Se ingresa al maestro de entidad financiera

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Entidades Financieras', 'impuestos');
    await t
        .click('#gridEntidadesFinancieras .dx-icon.dx-icon-add')
        .typeText('#txtIdEntidadfoco', CODIGO)
        .wait(2000)
        .typeText('#txtEntidadFinanciera_Descripcion .dx-texteditor-input', DESCRIPCION_ENTIDAD)
        .typeText('#txtEntidadFinanciera_CodigoAch .dx-texteditor-input', CODIGO_ACH)
        .typeText('#txtEntidadFinanciera_CodigoAch1 .dx-texteditor-input', CODIGO_ACH1)
        .click(Selector('#BtnActualizarEntidadFinanciera span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA FORMAS DE PAGO
    //Se ingresa al maestro de Tablade Retención en la fuente

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Formas de Pago', 'impuestos');
    await t
        .click(Selector('#gridFormasPago .dx-button-content').nth(1))
        .typeText('#txtIntIdFormaPago', CODIGO)
        //El sistema no permite crear una forma de pago con código mayor a 327667
        .typeText('#txtFormaPago_Descripcion .dx-texteditor-input', DESCRIPCION_FORMA_PAGO)
        .click(Selector('#txtFormaPago_Grupo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, GRUPO_FORMA_PAGO);
    await t
        .click('#txt_lista_FormaPagoFPagoDian .dx-lookup-field')
        ;
    await seleccionarOpcion(t, FORMA_PAGO_DIAN);
    await t
        .click('#FormasPago_Banco .dx-lookup-field')
        ;
    await seleccionarOpcion(t, BANCO_FORMA_PAGO);
    await t
        //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
        .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA MONEDAS
    //Se ingresa al maestro de Moneda

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Monedas', 'impuestos');
    await t
        .click('#gridMonedas .dx-icon.dx-icon-add')
        .typeText('#txtStrIdMoneda', CODIGO)
        .typeText('#txtMoneda_Descripcion .dx-texteditor-input', DESCRIPCION_MONEDA)
        .click(Selector('#txtMoneda_CodigoFE_ISO .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, MONEDA_ISO);
    await t
        .click(Selector('#BtnGuardarMoneda span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TABLAS RETEFUENTE
    //Se ingresa al maestro de Tablade Retención en la fuente

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Maestro de Retención', 'impuestos');
    await t
        .click('#gridTarifasRetenciones .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación de la Tabla
        .typeText('#txtIntIdRetencion', CODIGO_CERO)
        .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
        .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION_RETEFUENTE)
        .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE)
        .typeText('#txtTarifasRetencion_PorcentajeND .dx-texteditor-input', PORCENTAJE_ND)
        .typeText('#txtTarifasRetencion_PorcentajeDecl .dx-texteditor-input', PORCENTAJE_DECL)
        .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA)
        .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE_RETEFUENTE)
        //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
        .click(Selector('#BtnGuardarTarifasRetencion span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TARIFAS CREE
    //Se ingresa al maestro de Tarifa CREE

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tarifas CREE', 'impuestos');
    await t
        .click('#gridTarifasCree .dx-icon.dx-icon-add')
        .typeText('#txtTarifaCree_Idfoco', CODIGO_CERO)
        .wait(2000)
        .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION_CREE)
        .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_CREE)
        //El sistema permite guardar una Tarifa CREE con un porcentaje mayor a 100 PERO este lo redondea
        .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TARIFAS DE IMPUESTOS
        //Se ingresa al maestro de tarifa de impuesto

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tarifas de Impuesto', 'impuestos');
    await t
        .click('#gridTarifasImpto1 .dx-icon.dx-icon-add')
        .typeText('#txtIntIdCodigo', CODIGO_CERO)
        .wait(2000)
        .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION_IMPUESTO)
        .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE_IMPUESTO)
        //El sistema permite guardar una tarifa de impuesto con un porcentaje mayor a 100
        .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TARIFAS DE IVA
        //Se ingresa al maestro de Tarifa de Iva

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tarifas de Iva', 'impuestos');
    await t
        .click(Selector('#gridTarifasIva .dx-button-content').nth(1))
    //Se comienza con la inserción de datos para la creación de la tarifa
        .typeText('#txtIntIdIva', CODIGO_CERO)
        .wait(2000)
         .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION_IVA)
        .typeText('#txtTarifaIva_Porcentaje .dx-texteditor-input', PORCENTAJE_IVA)
        .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE_IVA2)
        .click(Selector('#BtnGuardarTarifaIva div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    //PRUEBA UNIDADES
         //Se ingresa al maestro de unidad

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Unidades', 'impuestos');
    await t
        .click('#gridUnidades .dx-icon.dx-icon-add')
        .typeText('#txtStrIdUnidad', CODIGO_CERO)
        .wait(2000)
        .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION_UNIDAD)
        .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CODIGO_DIAN_UNIDAD);
    await t
        .click(Selector('#BtnGuardarUnidad span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Duplicados Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Inserción Duplicados - IMPUESTOS Y UNIDADES - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirMaestros360(t, 'Bancos', 'impuestos');
    await t
        .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
        .wait(1500)
        .click('#gridBancos .dx-icon.dx-icon-add')
    //Se ingresa la información para la creación del banco
        .typeText('#txtBancos_Codigofoco', CODIGO)
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION_BANCO)
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        let mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA CONCEPTOS DE PAGO
 //Se ingresa al maestro de Conceptos pago

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Conceptos Pago', 'impuestos');
    await t
        .click('#gridConceptosPago .dx-icon.dx-icon-add')
    //Se ingresa la información para la creación del concepto de pago
        .typeText('#txtStrIdConceptoPagofoco', CODIGO)
        .typeText('#txtConceptoPago_Descripcion .dx-texteditor-input', DESCRIPCION_CONCEPTO_PAGO)
        .click(Selector('#txtConceptoPago_Tipo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_PAGO);
    await t
        .typeText('#txtConceptoPago_Valor .dx-texteditor-input', VALOR_CONCEPTO)
        .click('#txtMaestroConceptosPago_CuentaPCGA .dx-lookup-field')
        ;
    await seleccionarOpcion(t, CUENTA_ACTIVO);
    await t
        .click('#txtMaestroConceptosPago_CuentaNIIF .dx-lookup-field')
        ;
    await seleccionarOpcion(t, CUENTA_ACTIVO);
    await t
        .click('#txtConceptosPago_ActualizaValor .dx-checkbox-icon')
        .click(Selector('#txtConceptosPago_IntCartera span').withText('Actualiza Cartera'))
        .click('#txtConceptosPago_ValidaSaldoCartera .dx-checkbox-icon')
        .click(Selector('#BtnActualizarConceptosPago div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
///PRUEBA CONCEPTOS DE PAGO
    //Se ingresa al maestro de entidad financiera

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Entidades Financieras', 'impuestos');
    await t
        .click('#gridEntidadesFinancieras .dx-icon.dx-icon-add')
        .typeText('#txtIdEntidadfoco', CODIGO)
        .wait(2000)
        .typeText('#txtEntidadFinanciera_Descripcion .dx-texteditor-input', DESCRIPCION_ENTIDAD)
        .typeText('#txtEntidadFinanciera_CodigoAch .dx-texteditor-input', CODIGO_ACH)
        .typeText('#txtEntidadFinanciera_CodigoAch1 .dx-texteditor-input', CODIGO_ACH1)
        .click(Selector('#BtnActualizarEntidadFinanciera span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA FORMAS DE PAGO
    //Se ingresa al maestro de Tablade Retención en la fuente

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Formas de Pago', 'impuestos');
    await t
        .click(Selector('#gridFormasPago .dx-button-content').nth(1))
        .typeText('#txtIntIdFormaPago', CODIGO)
        //El sistema no permite crear una forma de pago con código mayor a 327667
        .typeText('#txtFormaPago_Descripcion .dx-texteditor-input', DESCRIPCION_FORMA_PAGO)
        .click(Selector('#txtFormaPago_Grupo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, GRUPO_FORMA_PAGO);
    await t
        .click('#txt_lista_FormaPagoFPagoDian .dx-lookup-field')
        ;
    await seleccionarOpcion(t, FORMA_PAGO_DIAN);
    await t
        .click('#FormasPago_Banco .dx-lookup-field')
        ;
    await seleccionarOpcion(t, BANCO_FORMA_PAGO);
    await t
        //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
        .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA MONEDAS
    //Se ingresa al maestro de Moneda

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Monedas', 'impuestos');
    await t
        .click('#gridMonedas .dx-icon.dx-icon-add')
        .typeText('#txtStrIdMoneda', CODIGO)
        .typeText('#txtMoneda_Descripcion .dx-texteditor-input', DESCRIPCION_MONEDA)
        .click(Selector('#txtMoneda_CodigoFE_ISO .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, MONEDA_ISO);
    await t
        .click(Selector('#BtnGuardarMoneda span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TABLAS RETEFUENTE
    //Se ingresa al maestro de Tablade Retención en la fuente

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Maestro de Retención', 'impuestos');
    await t
        .click('#gridTarifasRetenciones .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación de la Tabla
        .typeText('#txtIntIdRetencion', CODIGO_CERO)
        .click('#txtTarifasRetencion_Descripcion .dx-texteditor-input')
        .typeText('#txtTarifasRetencion_Descripcion .dx-texteditor-input', DESCRIPCION_RETEFUENTE)
        .typeText('#txtTarifasRetencion_BaseRteFte .dx-texteditor-input', BASE_RTE_FTE)
        .typeText('#txtTarifasRetencion_PorcentajeND .dx-texteditor-input', PORCENTAJE_ND)
        .typeText('#txtTarifasRetencion_PorcentajeDecl .dx-texteditor-input', PORCENTAJE_DECL)
        .typeText('#txtTarifasRetencion_BaseRteIca .dx-texteditor-input', BASE_RTE_ICA)
        .typeText('#txtTarifasRetencion_Porcentaje .dx-texteditor-input', PORCENTAJE_RETEFUENTE)
        //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
        .click(Selector('#BtnGuardarTarifasRetencion span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TARIFAS CREE
    //Se ingresa al maestro de Tarifa CREE

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tarifas CREE', 'impuestos');
    await t
        .click('#gridTarifasCree .dx-icon.dx-icon-add')
        .typeText('#txtTarifaCree_Idfoco', CODIGO_CERO)
        .wait(2000)
        .typeText('#txtTarifaCree_Descripcion .dx-texteditor-input', DESCRIPCION_CREE)
        .typeText('#txtTarifaCree_PorTar .dx-texteditor-input', PORCENTAJE_CREE)
        //El sistema permite guardar una Tarifa CREE con un porcentaje mayor a 100 PERO este lo redondea
        .click(Selector('#BtnGuardarTarifaCree span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TARIFAS DE IMPUESTOS
        //Se ingresa al maestro de tarifa de impuesto

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tarifas de Impuesto', 'impuestos');
    await t
        .click('#gridTarifasImpto1 .dx-icon.dx-icon-add')
        .typeText('#txtIntIdCodigo', CODIGO_CERO)
        .wait(2000)
        .typeText('#txtTarifaImpto1_Descripcion .dx-texteditor-input', DESCRIPCION_IMPUESTO)
        .typeText('#txtTarifaImpto1_Porcentaje .dx-texteditor-input', PORCENTAJE_IMPUESTO)
        //El sistema permite guardar una tarifa de impuesto con un porcentaje mayor a 100
        .click(Selector('#BtnGuardarTarifaImpto1 span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
//PRUEBA TARIFAS DE IVA
        //Se ingresa al maestro de Tarifa de Iva

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Tarifas de Iva', 'impuestos');
    await t
        .click(Selector('#gridTarifasIva .dx-button-content').nth(1))
    //Se comienza con la inserción de datos para la creación de la tarifa
        .typeText('#txtIntIdIva', CODIGO_CERO)
        .wait(2000)
         .typeText('#txtTarifaIva_Descripcion .dx-texteditor-input', DESCRIPCION_IVA)
        .typeText('#txtTarifaIva_Porcentaje .dx-texteditor-input', PORCENTAJE_IVA)
        .typeText('#txtTarifaIva_Porcentaje2 .dx-texteditor-input', PORCENTAJE_IVA2)
        .click(Selector('#BtnGuardarTarifaIva div').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    //PRUEBA UNIDADES
         //Se ingresa al maestro de unidad

    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Unidades', 'impuestos');
    await t
        .click('#gridUnidades .dx-icon.dx-icon-add')
        .typeText('#txtStrIdUnidad', CODIGO_CERO)
        .wait(2000)
        .typeText('#txtUnidad_Descripcion .dx-texteditor-input', DESCRIPCION_UNIDAD)
        .click(Selector('#txtUnidad_Codigo_DIAN .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CODIGO_DIAN_UNIDAD);
    await t
        .click(Selector('#BtnGuardarUnidad span').withText('Guardar'))
        mensaje= Selector('#swal2-content').innerText;
        await t
        .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
        .click(Selector('button').withText('Aceptar').nth(1));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
