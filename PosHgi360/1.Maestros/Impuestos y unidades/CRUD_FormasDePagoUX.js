import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    seleccionarOpcion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Formas de Pago', 'impuestos');
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

fixture `Prueba Formas de Pago testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Formas de Pago mierp CRUD ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Formas de Pago testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Formas de Pago mierp CRUD ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
