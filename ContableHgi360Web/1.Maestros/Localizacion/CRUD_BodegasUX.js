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
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'mibodega123';
const DESCRIPCION = 'descripcionmibodega';
const DIRECCION = 'direcciónmibidega123';
const TELEFONO = '1623456as';
const RESPONSABLE = 'no sé';
const DESCRIPCION_EDIT = 'nueva descripcion bodega';
const RESPONSABLE_EDIT = 'nuevoresponsablebodega';
const OPCION_PRECIO_1 = 'Precio 1';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Bodegas', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridBodegas', CODIGO);
        await t
            .click('#gridBodegas .dx-icon.dx-icon-add')
            .typeText('#txtIdBodegafocus', CODIGO)
            .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtBodega_Direccion .dx-texteditor-input', DIRECCION)
            .typeText('#txtBodega_Telefono .dx-texteditor-input', TELEFONO)
            .click('#txtBodega_Responsable .dx-texteditor-input')
            .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE)
            .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
            .click(Selector('#txtBodega_Estado .dx-radiobutton-icon').nth(2))
            .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
            .wait(4000)
            .expect(Selector('#gridBodegas td').withText(CODIGO).exists).ok()
            .click(Selector('#gridBodegas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtBodega_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBodega_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click('#txtBodega_Responsable .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBodega_Responsable .dx-texteditor-input', RESPONSABLE_EDIT)
            .click(Selector('#txtBodega_ListaPrecios .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, OPCION_PRECIO_1);
    await t
            .click('#txtBodega_Estado .dx-radiobutton-icon')
            .click(Selector('#BtnActualizarBodega span').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridBodegas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Bodegas - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Bodegas Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Bodegas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Bodegas CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
