import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Grupos', 'productos');
        await eliminarRegistroSiExiste(t, '#gridGrupos', CODIGO);
            //Se procede a crear el Grupo
            await t
            .click('#gridGrupos .dx-icon.dx-icon-add')
            .typeText('#txtStrIdGrupo', CODIGO)
            //El sistema permite cualquier caracter para el còdigo del grupo
            .typeText('#txtGrupo_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarGrupos div').withText('Guardar'))
        //Se valida la creación del Grupo
            .wait(2000)
            .expect(Selector('td').withText(CODIGO).exists).ok()
        //Se edita el Grupo Creado
            .click(Selector('#gridGrupos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click(Selector('#txtGrupo_Descripcion .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtGrupo_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarGrupos div').withText('Guardar'))
        //Se elimina el grupo 
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridGrupos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Grupos testERP POS - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Grupos mierp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Grupos testERP POS - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba CRUD Grupos mierp', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
