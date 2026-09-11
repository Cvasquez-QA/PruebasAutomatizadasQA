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

const CODIGO = 'MICODIGO123VENDEDOR';
const NOMBRE = 'VENDEDORCITO';
const NOMBRE_EDIT = 'Vendedor Pérez';
const FILTRO_GENERAL = 'General';
const OPCION_GENERAL = '0 - GENERAL';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Vendedores', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridVendedores', CODIGO);
        await t
            .click(Selector('#gridVendedores .dx-icon.dx-icon-add'))
            .typeText('#txtVendedor_Codigo', CODIGO)
            .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE)
            .click('#txtVendedores_ReporteA .dx-lookup-field');
    
        await filtrarPor(t, FILTRO_GENERAL);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, OPCION_GENERAL);
    await t
            .click('#txtVendedores_Sucursal .dx-lookup-field');
    
        await filtrarPor(t, FILTRO_GENERAL);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, OPCION_GENERAL);
    await t
            .click('#txtVendedores_Activo .dx-checkbox-icon')
            .click(Selector('#BtnGuardarVendedor div').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridVendedores td').withText(CODIGO).exists).ok()
            .click(Selector('#gridVendedores [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtVendedores_Nombre .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE_EDIT)
            .click(Selector('#BtnGuardarVendedor span').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridVendedores');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Vendedores - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Vendedor Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Vendedores - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Vendedor - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
