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

const CODIGO = 'MIBARRIO';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Barrios', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridBarrios', CODIGO);
        await t
            .click('#gridBarrios .dx-icon.dx-icon-add')
            .typeText('#txtBarrio_Codigofocus', CODIGO)
            .typeText('#txtBarrio_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnActualizarBarrio span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridBarrios td').withText(CODIGO).exists).ok()
            .click(Selector('#gridBarrios [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtBarrio_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtBarrio_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnActualizarBarrio div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridBarrios');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba BARRIOS - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba BARRIOS Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba BARRIOS - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba BARRIOS CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
