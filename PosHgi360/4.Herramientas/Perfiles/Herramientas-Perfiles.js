import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_PERFIL = '0001';
const DESCRIPCION = 'MiDescPerfilQA';
const DESCRIPCION_EDIT = 'MiNuevaDescPerfilQA2';

fixture `Prueba Herramientas Perfiles Happgi Pos - Test Hgi360`
    .page (testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - CRUD Perfiles - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .wait(2000)
        //Se crea el perfil
        .click('#gridPerfiles .dx-icon.dx-icon-add')
        .wait(2000)
        .typeText('#txtIdPerfilesfocus', CODIGO_PERFIL)
        .typeText('#txtDescripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'));
    //Se CONSULTA

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
        .wait(3000)
        .expect(Selector('#gridPerfiles td').withText(CODIGO_PERFIL).exists).ok()
    //Se edita
        .wait(2000)
        //Se edita el perfil
        .click('#gridPerfiles [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(2000)
        .click('#txtDescripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
        .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'));
        /*
    //Se elimina

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
        .wait(3000);
    await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
        */
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba Herramientas Perfiles Happgi Pos - Hgi360 Pos`
    .page (hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Herramientas - CRUD Perfiles - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .wait(2000)
        //Se crea el perfil
        .click('#gridPerfiles .dx-icon.dx-icon-add')
        .wait(2000)
        .typeText('#txtIdPerfilesfocus', CODIGO_PERFIL)
        .typeText('#txtDescripcion .dx-texteditor-input', DESCRIPCION)
        .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'));
    //Se CONSULTA

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
        .wait(3000)
        .expect(Selector('#gridPerfiles td').withText(CODIGO_PERFIL).exists).ok()
    //Se edita
        .wait(2000)
        //Se edita el perfil
        .click('#gridPerfiles [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(2000)
        .click('#txtDescripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDescripcion .dx-texteditor-input', DESCRIPCION_EDIT)
        .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'));
        /*
    //Se elimina

    await cerrarPestana360(t);
    await abrirHerramientas360(t, 'Perfiles');
    await t
        .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
        .wait(3000);
    await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
        */
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
