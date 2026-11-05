import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, seleccionarOpcion, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = '3276';
const DESCRIPCION = 'MiDescripcionFormadepago';
const OPCION_GRUPO_BONO = '6 - Bono';
const OPCION_FORMA_PAGO_DIAN = '71 - Bonos';
const OPCION_BANCO_GENERAL = 'GENERAL';
const DESCRIPCION_EDIT = 'minuevadescripcionformadepago';
const OPCION_BANCO_GENERAL_EDIT = '0 - GENERAL';


async function ejecutarPruebaFormasDePago1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Formas De Pago');
        await eliminarRegistroSiExiste(t, '#gridFormasPago', CODIGO);
        await t
            .click(Selector('#gridFormasPago .dx-button-content').nth(1))
            .wait(2000)
            .typeText('#txtIntIdFormaPago', CODIGO)
            //El sistema no permite crear una forma de pago con código mayor a 3276
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
            //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
            .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
        //Se valida la creación 
            .wait(3000)
            .expect(Selector('#gridFormasPago td').withText(CODIGO).exists).ok()
        //Se edita
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
            .wait(2000)
        //Se elimina la Forma de pago
            ;
        await eliminarRegistroDesdeGrid(t, '#gridFormasPago');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaFormasDePago2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Formas De Pago');
        await eliminarRegistroSiExiste(t, '#gridFormasPago', CODIGO);
        await t
            .click(Selector('#gridFormasPago .dx-button-content').nth(1))
            .wait(2000)
            .typeText('#txtIntIdFormaPago', CODIGO)
            //El sistema no permite crear una forma de pago con código mayor a 3276
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
            //El sistema no permite que se guarde un porcentaje mayor a 100, por lo que si se ingresa un valor mayor, el sistema le asigna el 100 por defecto
            .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
        //Se valida la creación 
            .wait(3000)
            .expect(Selector('#gridFormasPago td').withText(CODIGO).exists).ok()
        //Se edita
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
            .wait(2000)
        //Se elimina la Forma de pago
            ;
        await eliminarRegistroDesdeGrid(t, '#gridFormasPago');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_FormasDePagoUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Formas de Pago Mi Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaFormasDePago1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba Formas de Pago Test Contable CRUD - Mi ERP', async t => {
    await ejecutarPruebaFormasDePago2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_FormasDePagoUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Formas de Pago Mi Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaFormasDePago1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba Formas de Pago Test Contable CRUD - Test Contable', async t => {
    await ejecutarPruebaFormasDePago2(t, testContableConfig, ingresarAplicacion);
});
