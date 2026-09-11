import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    seleccionarOpcion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = '3276';
const DESCRIPCION = 'MiDescripcionFormadepago';
const OPCION_GRUPO_BONO = '6 - Bono';
const OPCION_FORMA_PAGO_DIAN = '71 - Bonos';
const OPCION_BANCO_GENERAL = 'GENERAL';
const DESCRIPCION_EDIT = 'minuevadescripcionformadepago';
const OPCION_BANCO_GENERAL_EDIT = '0 - GENERAL';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Formas de Pago', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridFormasPago', CODIGO);
        await t
            .click(Selector('#gridFormasPago .dx-button-content').nth(1))
            .wait(2000)
            .typeText('#txtIntIdFormaPago', CODIGO)
            .typeText('#txtFormaPago_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtFormaPago_Grupo .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_GRUPO_BONO);
    await t
            .click('#txt_lista_FormaPagoFPagoDian .dx-lookup-field')
            ;
    await seleccionarOpcion(t, OPCION_FORMA_PAGO_DIAN);
    await t
            .click('#FormasPago_Banco .dx-lookup-field')
            ;
    await seleccionarOpcion(t, OPCION_BANCO_GENERAL);
    await t
            .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridFormasPago td').withText(CODIGO).exists).ok()
            .click(Selector('#gridFormasPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtFormaPago_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtFormaPago_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtFormaPago_Consulta .dx-checkbox-icon')
            .click('#FormasPago_Banco .dx-lookup-field')
            ;
    await seleccionarOpcion(t, OPCION_BANCO_GENERAL_EDIT);
    await t
            .click(Selector('#BtnGuardarFormaPago div').withText('Guardar'))
            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridFormasPago');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Formas de Pago - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Formas de Pago Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Formas de Pago - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Formas de Pago CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
