import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'micodigoconceptopago123';
const DESCRIPCION = 'midescripcionconceptopago';
const OPCION_TIPO_PAGO = '1 - Pago';
const VALOR = '999999999999';
const FILTRO_PCGA = 'pcga';
const OPCION_CUENTA_PCGA = '1 - ACTIVO PCGA';
const FILTRO_NIIF = 'niif';
const OPCION_CUENTA_NIIF = '1 - ACTIVO NIIF';
const DESCRIPCION_EDIT = 'miNUEVAdescripcionconceptopago';
const OPCION_TIPO_DEDUCCION = 'Deducción';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Conceptos Pago', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridConceptosPago', CODIGO);
        await t
            .click('#gridConceptosPago .dx-icon.dx-icon-add')
        //Se ingresa la información para la creación del concepto de pago
            .typeText('#txtStrIdConceptoPagofoco', CODIGO)
            .typeText('#txtConceptoPago_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtConceptoPago_Tipo .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_TIPO_PAGO);
    await t
            .typeText('#txtConceptoPago_Valor .dx-texteditor-input', VALOR)
            .click('#txtMaestroConceptosPago_CuentaPCGA .dx-lookup-field');

            await filtrarPor(t, FILTRO_PCGA);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, OPCION_CUENTA_PCGA);
    await t
            .click('#txtMaestroConceptosPago_CuentaNIIF .dx-lookup-field');

            await filtrarPor(t, FILTRO_NIIF);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, OPCION_CUENTA_NIIF);
    await t
            .click('#txtConceptosPago_ActualizaValor .dx-checkbox-icon')
            .click(Selector('#txtConceptosPago_IntCartera span').withText('Actualiza Cartera'))
            .click('#txtConceptosPago_ValidaSaldoCartera .dx-checkbox-icon')
            .click(Selector('#txtConceptoPago_Operacion .dx-radiobutton-icon'))
            .click(Selector('#BtnActualizarConceptosPago div').withText('Guardar'))
        //Se valida la creación
            .wait(2000)
            .expect(Selector('#gridConceptosPago td').withText(CODIGO).exists).ok()
        //Se edita
            .click(Selector('#gridConceptosPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
             //Se inserta la información para actualizar el concepto pago
            .click('#txtConceptoPago_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtConceptoPago_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#txtConceptoPago_Tipo .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_TIPO_DEDUCCION);
    await t
            .click('#txtConceptosPago_IntCartera .dx-checkbox-icon')
            .click('#txtConceptosPago_ActualizaValor .dx-checkbox-icon')
            .click('#BtnActualizarConceptosPago .dx-icon.dx-icon-save')
        //Se elimina
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridConceptosPago');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Concepto de Pago testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Concepto de pago CRUD mierp ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Concepto de Pago testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Concepto de pago CRUD mierp ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
