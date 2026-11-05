import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarSesion360, ingresarAplicacion, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO_PERFIL = '0001';
const DESCRIPCION = 'MiDescPerfilQA';
const DESCRIPCION_EDIT = 'MiNuevaDescPerfilQA2';


async function ejecutarPruebaHerramientasPerfiles(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas(t, 'PERFILES');
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
        await abrirHerramientas(t, 'PERFILES');
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
        await abrirHerramientas(t, 'PERFILES');
        await t
            .typeText('#gridPerfiles .dx-texteditor-input', CODIGO_PERFIL)
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridPerfiles');
            */
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Herramientas-Perfiles - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Herramientas - CRUD Perfiles - Mi ERP', async t => {
    await ejecutarPruebaHerramientasPerfiles(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `Herramientas-Perfiles - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Herramientas - CRUD Perfiles - Test Contable', async t => {
    await ejecutarPruebaHerramientasPerfiles(t, testContableConfig, ingresarAplicacion);
});
