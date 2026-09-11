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

const CODIGO = '123456';
const DESCRIPCION = 'MiDescripciónLinea';
const DESCRIPCION_EDIT = 'MiNuevaDescripciónLinea';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Lineas', 'productos');
        await eliminarRegistroSiExiste(t, '#gridLineas', CODIGO);
        await t
            .click('#gridLineas .dx-icon.dx-icon-add')
            .typeText('#txtStrIdLinea', CODIGO)
            .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
            .wait(3000)
            .expect(Selector('td').withText(CODIGO).exists).ok()
            .click(Selector('#gridLineas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtLineas_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridLineas');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Lineas - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Líneas Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Lineas - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Líneas - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
