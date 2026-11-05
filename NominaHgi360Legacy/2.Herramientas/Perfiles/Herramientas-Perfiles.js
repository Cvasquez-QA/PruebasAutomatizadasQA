import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    ingresarAplicacion,
    
} from '../../../Funciones/HelpersHgi360Legacy.js';

const PERFIL_CODIGO = '0001';
const PERFIL_DESCRIPCION = 'MiDescPerfilQA';
const PERFIL_DESCRIPCION_ACTUALIZADA = 'MiNuevaDescPerfilQA2';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'PERFILES');
    await t
        .wait(2000)
        //Se crea el perfil
        .click('#gridPerfiles .dx-icon.dx-icon-add')
        .wait(2000)
        .typeText('#txtIdPerfilesfocus', PERFIL_CODIGO)
        .typeText('#txtDescripcion .dx-texteditor-input', PERFIL_DESCRIPCION)
        .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'))
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'PERFILES');
    await t
    //Se CONSULTA
        .wait(10000)
        .typeText('#gridPerfiles .dx-texteditor-input', PERFIL_CODIGO)
        .wait(3000)
        .expect(Selector('#gridPerfiles td').withText(PERFIL_CODIGO).exists).ok()
    //Se edita
        .wait(2000)
        //Se edita el perfil
        .click('#gridPerfiles [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(2000)
        .click('#txtDescripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDescripcion .dx-texteditor-input', PERFIL_DESCRIPCION_ACTUALIZADA)
        .click(Selector('#BtnGuardarPerfiles span').withText('Guardar'));
    await cerrarPestana360(t);
        /*
    //Se elimina
        await abrirHerramientas(t, 'PERFILES');
        await t
        .wait(2000)
        .typeText('#gridPerfiles .dx-texteditor-input', '0001')
        .wait(3000);
    await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
        */
    await cerrarSesion360(t);
}

fixture('Prueba Perfiles Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Perfil CRUD', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture('Prueba Perfiles Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Perfil CRUD', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
