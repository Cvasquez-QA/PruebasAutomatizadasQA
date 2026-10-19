import { Selector } from 'testcafe';
import {
    filtrarPor,
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'MICODIGO123VENDEDOR';
const NOMBRE = 'VENDEDORCITO';
const NOMBRE_EDIT = 'Vendedor Pérez';
const FILTRO_GENERAL = 'General';
const TIPO_GENERAL = '0 - GENERAL';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Vendedores', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridVendedores', CODIGO);
        await t
            .click(Selector('#gridVendedores .dx-icon.dx-icon-add'))
        //Se comienza con la inserción de datos para la creación del VENDEDOR
            .typeText('#txtVendedor_Codigo', CODIGO)
            .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE)
            .click('#txtVendedores_ReporteA .dx-lookup-field');

            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TIPO_GENERAL);
    await t
            .click('#txtVendedores_Sucursal .dx-lookup-field');

            await filtrarPor(t, FILTRO_GENERAL);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TIPO_GENERAL);
    await t
            .click('#txtVendedores_Activo .dx-checkbox-icon')
            .click(Selector('#BtnGuardarVendedor div').withText('Guardar'))
            //El sistema permite guardar un VENDEDOR sin ReporteA
        //Se valida su creación
            .wait(3000)
            .expect(Selector('#gridVendedores td').withText(CODIGO).exists).ok()
        //Se edita el vendedor
            .click(Selector('#gridVendedores [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtVendedores_Nombre .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#txtVendedores_Nombre .dx-texteditor-input', NOMBRE_EDIT)
            .click(Selector('#BtnGuardarVendedor span').withText('Guardar'))
        //Se elimina el vendedor
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridVendedores');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Vendedores testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Vendedor testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Vendedores testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Vendedor testerp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
