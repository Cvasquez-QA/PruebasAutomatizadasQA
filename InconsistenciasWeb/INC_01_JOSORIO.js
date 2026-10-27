import { Selector } from 'testcafe';
import { filtrarPor, seleccionarOpcion, ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarPestana360, cerrarSesion360 } from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/TestErpAdmin8902.js';

const CODIGO = '14';
const DESCRIPCION = 'BANCO AUTO';
const FILTRO_CUENTA_PCGA = '11101001';
const OPCION_CUENTA_PCGA = '11101001 - PANAMA BANCOLOMBIA';
const FILTRO_CUENTA_NIIF = '1110';
const OPCION_CUENTA_NIIF = '11100502 - BANCO CAJA SOCIAL CTE 2694';
const FILTRO_ENTIDAD_FIN = '42';
const OPCION_ENTIDAD_FIN = '42 - BANCO COLPATRIA';

fixture `INC_01 Crear Banco - Test Hgi360`
    .page(testAdminConfig.pagina);

test('INC_01 Crear banco con cuentas y entidad financiera', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros360(t, 'Bancos', 'impuestos');
    await eliminarRegistroSiExiste(t, '#gridBancos', CODIGO);

    await t
        .click('#gridBancos .dx-icon.dx-icon-add')
        .typeText('#txtBancos_Codigofoco', CODIGO)
        .pressKey('enter')
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION)
        .click('#txtMaestroBancos_CuentaPCGA .dx-lookup-field');

    await filtrarPor(t, FILTRO_CUENTA_PCGA);
    await seleccionarOpcion(t, OPCION_CUENTA_PCGA);

    await t.click('#txtMaestroBancos_CuentaNIIF .dx-lookup-field');
    await filtrarPor(t, FILTRO_CUENTA_NIIF);
    await seleccionarOpcion(t, OPCION_CUENTA_NIIF);

    await t.click('#txtMaestroBancos_EntidadFin .dx-lookup-field');
    await filtrarPor(t, FILTRO_ENTIDAD_FIN);
    await seleccionarOpcion(t, OPCION_ENTIDAD_FIN);

    await t
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#gridBancos td').withText(CODIGO).exists).ok();

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
