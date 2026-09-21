import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const CODIGO = '28';
const DESCRIPCION = 'BancoPrY';
const CONSECUTIVO = '1';
const FILTRO_CUENTA_NIIF = '1325';
const OPCION_CUENTA_NIIF = '1325 - CUENTAS POR COBRAR A SOCIOS Y ACCIONISTAS';
const FILTRO_ENTIDAD_FIN = '42';
const OPCION_ENTIDAD_FIN = '42 - BANCO COLPATRIA';
const OPCION_TIPO = '1 - Corriente';
const FILTRO_TERCERO = '901193980';
const OPCION_TERCERO = '901193980';
const FILTRO_CUENTA_PCGA = '132510';
const OPCION_CUENTA_PCGA = '132510 - A ACCIONISTAS';
const FILTRO_FORMATO = 'Bogotá';
const OPCION_FORMATO = '2 - Bogotá';
const FILTRO_CCOSTO = '05';
const OPCION_CCOSTO = '05 - CONSTRUCCION';

const config = {
    ...testAdminConfig,
    usuario: 'ymonsalve',
    clave: 'Calidad2026*'
};

fixture `INC_01 Grabacion Banco`
    .page(testAdminConfig.pagina);

test('Crear banco con helpers Hgi360', async t => {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Bancos', 'impuestos');
    await eliminarRegistroSiExiste(t, '#gridBancos', CODIGO);

    await t
        .click('#gridBancos .dx-icon.dx-icon-add')
        .typeText('#txtBancos_Codigofoco', CODIGO)
        .typeText('#txtBancos_Descripcion .dx-texteditor-input', DESCRIPCION)
        .click('#txtMaestroBancos_CuentaNIIF .dx-lookup-field-wrapper');
    await filtrarPor(t, FILTRO_CUENTA_NIIF);
    await seleccionarOpcion(t, OPCION_CUENTA_NIIF);

    await t.click('#txtMaestroBancos_EntidadFin .dx-lookup-field');
    await filtrarPor(t, FILTRO_ENTIDAD_FIN);
    await seleccionarOpcion(t, OPCION_ENTIDAD_FIN);

    await t.click('#txtBancos_Tipo .dx-lookup-field');
    await seleccionarOpcion(t, OPCION_TIPO);

    await t.click('#txtMaestroBancos_Tercero .dx-lookup-field');
    await filtrarPor(t, FILTRO_TERCERO);
    await seleccionarOpcion(t, OPCION_TERCERO);

    await t.click('#txtMaestroBancos_CuentaPCGA .dx-lookup-field');
    await filtrarPor(t, FILTRO_CUENTA_PCGA);
    await seleccionarOpcion(t, OPCION_CUENTA_PCGA);

    await t.click('#txtBancos_Formato .dx-lookup-field');
    await filtrarPor(t, FILTRO_FORMATO);
    await seleccionarOpcion(t, OPCION_FORMATO);

    await t
        .click('#txtBancos_Consecutivo .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtBancos_Consecutivo .dx-texteditor-input', CONSECUTIVO)
        .click('#txtMaestroBancos_CCosto .dx-lookup-field');
    await filtrarPor(t, FILTRO_CCOSTO);
    await seleccionarOpcion(t, OPCION_CCOSTO);

    await t
        .click(Selector('#BtnActualizarBanco span').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#gridBancos td').withText(CODIGO).exists).ok('No se guardó el banco');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
