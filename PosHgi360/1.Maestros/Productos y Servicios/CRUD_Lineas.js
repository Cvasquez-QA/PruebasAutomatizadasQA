import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Lineas', 'productos');
        await eliminarRegistroSiExiste(t, '#gridLineas', CODIGO);
                //Se procede a crear la línea
            await t
            .click('#gridLineas .dx-icon.dx-icon-add')
            .typeText('#txtStrIdLinea', CODIGO)
            //El sistema permite cualquier caracter para el còdigo de la lìnea
            .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION)
            .typeText('#txtLineas_Descuento .dx-texteditor-input', DESCUENTO)
            .typeText('#txtLineas_DescuentoMax .dx-texteditor-input', DESCUENTO_MAX)
            .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
    //'Consulta y valida la creación de la Linea'
            .wait(3000)
            .expect(Selector('td').withText(CODIGO).exists).ok()
    //'Editar Linea'
            .click(Selector('#gridLineas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtLineas_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtLineas_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarLinea div').withText('Guardar'))
    //'Eliminar Linea'
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridLineas');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Lineas testERP Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Líneas miErp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Lineas testERP Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Líneas miErp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
