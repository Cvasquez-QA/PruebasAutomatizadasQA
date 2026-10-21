import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'miCaja123';
const DESCRIPCION = 'descCajaPos';
const TOPE_RETIRO = '5000000';
const TOPE_VALOR = '5000000';
const PLACA = 'miPlacaCaja123';
const UBICACION = 'miUbicacion123';
const TIPO = 'miTipo1';
const USUARIO = 'cvasquez';
const VENDEDOR_FILTRO = 'GENERAL';
const VENDEDOR = '0 - GENERAL';
const DESCRIPCION_EDIT = 'nuevaDesc';
const TOPE_RETIRO_EDIT = '8000000';
const TOPE_VALOR_EDIT = '4000000';
const VALOR_GRID_CREAR = '5.000.000';
const VALOR_GRID_EDIT = '4.000.000';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Cajas', 'productos');
    await eliminarRegistroSiExiste(t, '#gridCajas', CODIGO);
    await t
        .click('#gridCajas .dx-icon.dx-icon-add')
        .wait(3000)
        .typeText('#txtCajas_StrIdCaja', CODIGO)
        .typeText('#txtCajas_StrDescripcion .dx-texteditor-input', DESCRIPCION)
        .typeText('#txtCajas_IntTopeRetiro .dx-texteditor-input', TOPE_RETIRO)
        .typeText('#txtCajas_IntValorTope .dx-texteditor-input', TOPE_VALOR)
        .doubleClick('#txtCajas_IntEstado .dx-switch-handle')
        .typeText('#txtCajas_StrPlacaCaja .dx-texteditor-input', PLACA)
        .typeText('#txtCajas_StrUbicacionCaja .dx-texteditor-input', UBICACION)
        .typeText('#txtCajas_StrTipoCaja .dx-texteditor-input', TIPO)
        .click(Selector('#BtnGuardarCajas span').withText('Guardar'))
        .click('#gridUsuariosCaja .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('#gridUsuariosCaja .dx-dropdowneditor-icon').nth(1))
        .typeText(Selector('#gridUsuariosCaja .dx-texteditor-input').nth(1), USUARIO)
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(USUARIO).nth(8))
        .click('#gridUsuariosCaja .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .click('#tabs_Cajas_Vendedores')
        .click('#gridVendedoresCaja .dx-icon.dx-icon-edit-button-addrow')
        .typeText(Selector('#gridVendedoresCaja .dx-texteditor-input').nth(1), VENDEDOR_FILTRO)
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(VENDEDOR).nth(8))
        .click('#gridVendedoresCaja .dx-link.dx-link-save.dx-icon-save.dx-link-icon')
        .click(Selector('#BtnGuardarCajas div').withText('Guardar'))
        .wait(3000)
        .expect(Selector('#gridCajas td').withText(VALOR_GRID_CREAR).exists).ok('No se creó el registro')
        .wait(2000)
        .click(Selector('#gridCajas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#Cajas_StrDescripcion')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#Cajas_StrDescripcion', DESCRIPCION_EDIT)
        .click('#txtCajas_IntTopeRetiro .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCajas_IntTopeRetiro .dx-texteditor-input', TOPE_RETIRO_EDIT)
        .click('#txtCajas_IntValorTope .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCajas_IntValorTope .dx-texteditor-input', TOPE_VALOR_EDIT)
        .wait(10000)
        .click('#gridUsuariosCaja .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .wait(2000)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'))
        .wait(3000)
        .click('#tabs_Cajas_Vendedores')
        .click('#gridVendedoresCaja .dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .wait(1500)
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-button-content'))
        .wait(3000)
        .click(Selector('#BtnGuardarCajas span').withText('Guardar'))
        .wait(2000)
        .expect(Selector('#gridCajas td').withText(VALOR_GRID_EDIT).exists).ok('No se ACTUALIZO el registro');
    await eliminarRegistroDesdeGrid(t, '#gridCajas');;
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Cajas testERP Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Cajas TestErp - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Cajas testERP Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Cajas TestErp - Hgi360 Pos', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
