import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = 'MiGrupo123';
const DESCRIPCION = 'MiDescripciónGrupo';
const DESCRIPCION_EDIT = 'MiNuevaDescripciónGrupo';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/


async function ejecutarPruebaGrupos(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Grupos');
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

fixture `CRUD_Grupos - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Grupos Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaGrupos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_Grupos - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Grupos Mi Contable - Test Contable', async t => {
    await ejecutarPruebaGrupos(t, testContableConfig, ingresarAplicacion);
});
