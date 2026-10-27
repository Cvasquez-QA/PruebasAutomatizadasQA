import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, filtrarPor, seleccionarOpcion, aceptarValidacionesSiExisten } from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/TestErpAdmin8902.js';

const CODIGO = '20';
const CODIGO_NUEVO = '30';
const DESCRIPCION = 'BANCO CAJA SOCIAL';
const FILTRO_CUENTA_PCGA = '11101001';
const OPCION_CUENTA_PCGA = '11101001 - PANAMA BANCOLOMBIA';
const FILTRO_CUENTA_NIIF = 'panama';
const OPCION_CUENTA_NIIF = '11101001 - BANCOLOMBIA PANAMA';
const OPCION_TIPO_AHORROS = '2 - Ahorros';
const FILTRO_TERCERO = 'general';
const OPCION_TERCERO = '0 - GENERAL GENERAL - General';
const FILTRO_ENTIDAD_FIN = '12';
const OPCION_ENTIDAD_FIN = '12 - BANCO SUDAMERIS';

fixture `INC0001 Maestro Bancos`
    .page(testAdminConfig.pagina);

test('INC0001 Crear banco Caja Social', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros360(t, 'Bancos', 'impuestos');

    await t
        .click('#gridBancos .dx-icon.dx-icon-add')
        .typeText('#txtBancos_Codigofoco', CODIGO)
        .pressKey('enter')
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION)
        .pressKey('enter')
        .click('#txtMaestroBancos_CuentaPCGA .dx-lookup-field');
    await filtrarPor(t, FILTRO_CUENTA_PCGA);
    await seleccionarOpcion(t, OPCION_CUENTA_PCGA);

    await t.click('#txtMaestroBancos_CuentaNIIF .dx-lookup-field');
    await filtrarPor(t, FILTRO_CUENTA_NIIF);
    await seleccionarOpcion(t, OPCION_CUENTA_NIIF);

    await t.click('#txtBancos_Tipo .dx-lookup-field');
    await seleccionarOpcion(t, OPCION_TIPO_AHORROS);

    await t.click('#txtMaestroBancos_Tercero .dx-lookup-field');
    await filtrarPor(t, FILTRO_TERCERO);
    await seleccionarOpcion(t, OPCION_TERCERO);

    await t.click('#txtMaestroBancos_EntidadFin .dx-lookup-field');
    await filtrarPor(t, FILTRO_ENTIDAD_FIN);
    await seleccionarOpcion(t, OPCION_ENTIDAD_FIN);

    await t
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        .wait(2000);
    await aceptarValidacionesSiExisten(t);

    await t
        .click('#txtBancos_Codigofoco')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtBancos_Codigofoco', CODIGO_NUEVO)
        .pressKey('enter')
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        .wait(2000);
});
