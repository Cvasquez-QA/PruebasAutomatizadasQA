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

const CODIGO_BANCO = 'miBanco123';
const DESCRIPCION_BANCO = 'midescripcion';
const CONSECUTIVO = '1212';
const NUMERO_CUENTA = '24006124298';
const CUENTA_CONTABLE = 'ACTIVO';
const TIPO_CUENTA = 'Ahorros';
const ENTIDAD_FINANCIERA = 'BANCOLOMBIA';
const OPCION_GENERAL = 'GENERAL';
const FORMATO_BANCARIO = 'BancolombiaPAB';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Bancos');
    await eliminarRegistroSiExiste(t, '#gridBancos', CODIGO_BANCO);

    await t
        .click('#gridBancos .dx-icon.dx-icon-add')
    //Se ingresa la información para la creación del banco
        .typeText('#txtBancos_Codigofoco', CODIGO_BANCO)
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION_BANCO)
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        .wait(2000)
    //Se valida la creación
        .expect(Selector('#gridBancos td').withText(CODIGO_BANCO).exists).ok()
    //Se edita
        .click(Selector('#gridBancos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtBancos_Consecutivo .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtBancos_Consecutivo .dx-texteditor-input', CONSECUTIVO)
        .click(Selector('#txtBancos_AutoIncremento span').withText('AutoIncremento'))
        .click(Selector('#txtMaestroBancos_CuentaPCGA .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CUENTA_CONTABLE);
    await t
        .click(Selector('#txtMaestroBancos_CuentaNIIF .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, CUENTA_CONTABLE);
    await t
        .click(Selector('#txtBancos_Tipo .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, TIPO_CUENTA);
    await t
        .click('#txtBancos_NroCuenta .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtBancos_NroCuenta .dx-texteditor-input', NUMERO_CUENTA)
        .click(Selector('#txtMaestroBancos_EntidadFin .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, ENTIDAD_FINANCIERA);
    await t
        .click(Selector('#txtMaestroBancos_Tercero .dx-lookup-field'))
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'general')
        .wait(1500)
        ;
    await seleccionarOpcion(t, OPCION_GENERAL);
    await t
        .click(Selector('#txtBancos_Formato .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, FORMATO_BANCARIO);
    await t
        .click(Selector('#txtMaestroBancos_CCosto .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, OPCION_GENERAL);
    await t
        .click(Selector('#txtBancos_Red .dx-radiobutton-icon').nth(1))
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
    //Se elimina
        .wait(3000);
    await eliminarRegistroDesdeGrid(t, '#gridBancos');
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Bancos Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Bancos - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Bancos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Bancos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});