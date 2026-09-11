import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'mibanco12';
const DESCRIPCION = 'midescripcion';
const CONSECUTIVO = '1212';
const OPCION_CUENTA_ACTIVO = 'ACTIVO';
const OPCION_TIPO_AHORROS = 'Ahorros';
const NUMERO_CUENTA = '24006124298';
const FILTRO_ENTIDAD_FIN = '07';
const OPCION_BANCOLOMBIA = '07 - BANCOLOMBIA';
const FILTRO_GENERAL = 'GENERAL';
const OPCION_GENERAL = '0 - GENERAL';
const FILTRO_CCOSTO = 'GENERAL';
const OPCION_FORMATO_BANCOLOMBIA = 'BancolombiaSAP';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Bancos', 'impuestos');
        await eliminarRegistroSiExiste(t, '#gridBancos', CODIGO);
        await t
            .click('#gridBancos .dx-icon.dx-icon-add')
            .typeText('#txtBancos_Codigofoco', CODIGO)
            .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
            .wait(2000)
            .expect(Selector('#gridBancos td').withText(CODIGO).exists).ok()
            .click(Selector('#gridBancos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtBancos_Consecutivo .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBancos_Consecutivo .dx-texteditor-input', CONSECUTIVO)
            .click(Selector('#txtBancos_AutoIncremento span').withText('AutoIncremento'))
            .click(Selector('#txtMaestroBancos_CuentaPCGA div'))
            ;
    await seleccionarOpcion(t, OPCION_CUENTA_ACTIVO);
    await t
            .click(Selector('#txtMaestroBancos_CuentaNIIF div'))
            ;
    await seleccionarOpcion(t, OPCION_CUENTA_ACTIVO);
    await t
            .click(Selector('#txtBancos_Tipo div'))
            ;
    await seleccionarOpcion(t, OPCION_TIPO_AHORROS);
    await t
            .click('#txtBancos_NroCuenta .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBancos_NroCuenta .dx-texteditor-input', NUMERO_CUENTA)
            .click(Selector('#txtMaestroBancos_EntidadFin .dx-lookup-field'));
    
        await filtrarPor(t, FILTRO_ENTIDAD_FIN);
            await seleccionarOpcion(t, OPCION_BANCOLOMBIA);
    await t
            .click(Selector('#txtMaestroBancos_Tercero .dx-lookup-field'));
    
        await filtrarPor(t, FILTRO_GENERAL);
            await seleccionarOpcion(t, OPCION_GENERAL);
    await t
            .click(Selector('#txtBancos_Formato .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_FORMATO_BANCOLOMBIA);
    await t
            .click(Selector('#txtMaestroBancos_CCosto .dx-lookup-field'));
    
        await filtrarPor(t, FILTRO_CCOSTO);
        await t.wait(2000);
    
        await filtrarPor(t, FILTRO_GENERAL);
            await seleccionarOpcion(t, OPCION_GENERAL);
    await t
            .click(Selector('#txtBancos_Red .dx-radiobutton-icon').nth(1))
            .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridBancos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Banco - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Banco CRUD hgi360 test - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Banco - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Banco CRUD hgi360 - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
