import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirHerramientas360
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas360(t, 'Parámetros');
    await t
        .click(Selector('#PanelParametrosGenerales a').withText('Parámetros'))
        .click(Selector('#BtnEditar div').withText('Editar'))
        .wait(1000)
        .click('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtParametrosGenerales_Params_StrProductoParametro1 .dx-texteditor-input', 'Parametro1');
    await t
        .click('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtParametrosGenerales_Params_StrProductoParametro2 .dx-texteditor-input', 'Parametro2');
    await t
        .click('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtParametrosGenerales_Params_StrProductoParametro3 .dx-texteditor-input', 'Parametro3');
    await t
        .click('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtParametrosGenerales_Params_StrProductoParametro4 .dx-texteditor-input', 'Parametro4');
    await t
        .click('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtParametrosGenerales_Params_StrProductoParametro5 .dx-texteditor-input', 'Parametro5');
    await t
        .click('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#TxtParametrosGenerales_Params_StrProductoParametro6 .dx-texteditor-input', 'Parametro6');
    await t
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'));
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba ParametroProd1 - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Config Parametros Productos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba ParametroProd1 - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Config Parametros Productos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
