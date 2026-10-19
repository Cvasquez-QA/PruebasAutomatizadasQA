import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'MiSubCC';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'SubCentro de Costo', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridSubCentrosCostos', CODIGO);
        await t
            .click('#gridSubCentrosCostos .dx-icon.dx-icon-add')
            .typeText('#txtSubCentroCosto_Codigofocus', CODIGO)
            .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtSubCentroCosto_Estado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarSubCentroCosto span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridSubCentrosCostos td').withText(CODIGO).exists).ok()
            .click(Selector('#gridSubCentrosCostos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtSubCentroCosto_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtSubCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarSubCentroCosto div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridSubCentrosCostos');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba SUBCENTROS DE COSTO - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba SUBCENTROS DE COSTO Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba SUBCENTROS DE COSTO - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba SUBCENTROS DE COSTO CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
