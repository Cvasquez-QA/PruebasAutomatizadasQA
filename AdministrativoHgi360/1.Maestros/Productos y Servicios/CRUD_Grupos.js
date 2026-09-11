import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    seleccionarOpcion,
    filtrarPor
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'MiGrupo123';
const DESCRIPCION = 'MiDescripciónGrupo';
const DESCRIPCION_EDIT = 'MiNuevaDescripciónGrupo';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Grupos', 'productos');
        await eliminarRegistroSiExiste(t, '#gridGrupos', CODIGO);
        await t
            .click('#gridGrupos .dx-icon.dx-icon-add')
            .typeText('#txtStrIdGrupo', CODIGO)
            .typeText('#txtGrupo_Descripcion .dx-texteditor-input', DESCRIPCION)        
.click('#txtGrupo_Producto .dx-lookup-field')
await t
await filtrarPor(t, 'GENERAL')
await seleccionarOpcion(t, 'GENERAL')
await t
    .click('#txtGrupo_TipoGrupo .dx-texteditor-input')
await t
    .pressKey('backspace')
    .pressKey('ctrl+a')
    .typeText('#txtGrupo_TipoGrupo .dx-texteditor-input', '2')
await t
    .click('#txtGrupo_StrConcepto .dx-lookup-field')
await filtrarPor(t, 'GENERAL')
await seleccionarOpcion(t, 'GENERAL')
await t
    .click('#txtGrupo_IntPrioridad .dx-texteditor-input')
    .pressKey('ctrl+a')
    .pressKey('backspace')  
await t
    .typeText('#txtGrupo_IntPrioridad .dx-texteditor-input', '10')
    .click(Selector('#BtnGuardarGrupos span').withText('Guardar'))
            .wait(2000)
           
            .expect(Selector('td').withText(CODIGO).exists).ok()
            .click(Selector('#gridGrupos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click(Selector('#txtGrupo_Descripcion .dx-texteditor-input'))
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtGrupo_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarGrupos div').withText('Guardar'))
            .wait(3000);
        await eliminarRegistroDesdeGrid(t, '#gridGrupos');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Grupos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Grupos Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Grupos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Grupos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});