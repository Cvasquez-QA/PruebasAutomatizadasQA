import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO_PERFIL = '0001';
const DESCRIPCION = 'MiDescPerfilQA';
const DESCRIPCION_EDIT = 'MiNuevaDescPerfilQA2';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Perfiles');
                await eliminarRegistroSiExiste(t, '#gridPerfiles', CODIGO_PERFIL)
        await t
            .wait(2000)
            .click('#gridPerfiles .dx-icon.dx-icon-add')
            .wait(2000)
            .typeText('#txtIdPerfilesfocus', CODIGO_PERFIL)
            .typeText('#txtDescripcionPerfil .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'));

        await cerrarPestana360(t);
        //Se edita el perfil
        await abrirHerramientas360(t, 'Perfiles');
        await t
            .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
            .wait(3000)
            .expect(Selector('#gridPerfiles td').withText(CODIGO_PERFIL).exists).ok()
            .wait(2000)
            .click(Selector('[class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .wait(2000)
            .click('#txtDescripcionPerfil .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDescripcionPerfil .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'))
            
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Perfiles');
        await t
            .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Herramientas Perfiles - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Herramientas - CRUD Perfiles - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Herramientas Perfiles - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Herramientas - CRUD Perfiles - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
