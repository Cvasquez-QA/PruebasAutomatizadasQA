import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_FORMA_PAGO = '3276';
const DESCRIPCION_FORMA_PAGO = 'descformapago';
const DESCRIPCION_EDITADA = 'minuevadescripcionformadepago';
const GRUPO_FORMA_PAGO = 'Efectivo';
const FORMA_PAGO_DIAN = 'Acuerdo mutuo';
const BANCO = 'BANCOLOMBIA';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Formaspago');
    await eliminarRegistroSiExiste(t, '#gridFormasPago', CODIGO_FORMA_PAGO);

    await t
        .click(Selector('#gridFormasPago .dx-button-content').nth(1))
        .typeText('#txtIntIdFormaPago', CODIGO_FORMA_PAGO)
        .typeText('#txtFormaPago_Descripcion .dx-texteditor-input', DESCRIPCION_FORMA_PAGO)
        .click('#txtFormaPago_Grupo .dx-lookup-field')
        ;
    await seleccionarOpcion(t, GRUPO_FORMA_PAGO);
    await t
        .click('#txt_lista_FormaPagoFPagoDian .dx-lookup-field')
        ;
    await seleccionarOpcion(t, FORMA_PAGO_DIAN);
    await t
        .click('#FormasPago_Banco .dx-lookup-field')
        ;
    await seleccionarOpcion(t, BANCO);
    await t
        .click('#txtFormaPago_Consulta .dx-checkbox-icon')
        .click(Selector('#BtnGuardarFormaPago span').withText('Guardar'))
        //.click(Selector('button').withText('Aceptar').nth(1))
    //Se valida la creación 
        .wait(2000)
        .expect(Selector('#gridFormasPago td').withText(CODIGO_FORMA_PAGO).exists).ok()
    //Se edita
        .click(Selector('#gridFormasPago [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se inserta la información para actualizar la forma de pago
        .click('#txtFormaPago_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtFormaPago_Descripcion .dx-texteditor-input', DESCRIPCION_EDITADA)
        .click(Selector('#BtnGuardarFormaPago div').withText('Guardar'))
        .wait(2000)
    //Se elimina la Forma de pago
        ;
    await eliminarRegistroDesdeGrid(t, '#gridFormasPago');
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Formas de Pago Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Forma de Pago Nom - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Formas de Pago Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Forma de Pago Nom - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});