import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MiCentroCosto';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Centro de Costo', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridCentrosCostos', CODIGO);
        await t
            .click('#gridCentrosCostos .dx-icon.dx-icon-add')
            .typeText('#txtCentroCosto_Codigofocus', CODIGO)
            .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click('#txtCentroCosto_Estado .dx-checkbox-icon')
            .click(Selector('#BtnActualizarCentroCosto span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridCentrosCostos td').withText(CODIGO).exists).ok()
            .click(Selector('#gridCentrosCostos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtCentroCosto_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCentroCosto_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarCentroCosto div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCentrosCostos');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba CENTROS DE COSTO - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CENTROS DE COSTO Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba CENTROS DE COSTO - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CENTROS DE COSTO CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
