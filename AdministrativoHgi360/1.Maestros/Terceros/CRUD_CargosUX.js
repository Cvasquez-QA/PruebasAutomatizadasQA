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

const CODIGO = 'MiCargos';
const NOMBRE = 'NombreCargo';
const FUNCIONES = 'FUNCIONESCARGO';
const PERFIL = 'PerfilCargo';
const NOMBRE_EDIT = 'Cargo Pérez';

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/

async function ejecutarPruebaCargos1(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Cargos', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridCargos', CODIGO);
        await t
            .click(Selector('#gridCargos .dx-icon.dx-icon-add'))
        //Se comienza con la inserción de datos para la creación del Cargo
            .typeText('#Cargos_StrIdCargo', CODIGO)
            .typeText('#txtCargos_StrNombre .dx-texteditor-input', NOMBRE)
            .typeText('#txtCargos_TxtFunciones .dx-texteditor-input', FUNCIONES)
            .typeText('#txtCargos_TxtPerfil .dx-texteditor-input', PERFIL)
            .click(Selector('#BtnGuardarCargos div').withText('Guardar'))
        //Se valida su creación
            .wait(3000)
            .expect(Selector('#gridCargos td').withText(CODIGO).exists).ok()
        //Se edita el Cargo
            .click(Selector('#gridCargos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtCargos_StrNombre .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#txtCargos_StrNombre .dx-texteditor-input', NOMBRE_EDIT)
            .click(Selector('#BtnGuardarCargos span').withText('Guardar'))
        //Se elimina el Cargo
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCargos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaCargos2(t, config) {
    await ingresarAplicacion(t, config);
        await abrirMaestros360(t, 'Cargos', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridCargos', CODIGO);
        await t
            .click(Selector('#gridCargos .dx-icon.dx-icon-add'))
        //Se comienza con la inserción de datos para la creación del Cargo
            .typeText('#Cargos_StrIdCargo', CODIGO)
            .typeText('#txtCargos_StrNombre .dx-texteditor-input', NOMBRE)
            .typeText('#txtCargos_TxtFunciones .dx-texteditor-input', FUNCIONES)
            .typeText('#txtCargos_TxtPerfil .dx-texteditor-input', PERFIL)
            .click(Selector('#BtnGuardarCargos div').withText('Guardar'))
            //El sistema permite guardar un Cargo sin ReporteA
        //Se valida su creación
            .wait(3000)
            .expect(Selector('#gridCargos td').withText(CODIGO).exists).ok()
        //Se edita el Cargo
            .click(Selector('#gridCargos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtCargos_StrNombre .dx-texteditor-input')
            .pressKey('backspace')
            .pressKey('ctrl+a')
            .typeText('#txtCargos_StrNombre .dx-texteditor-input', NOMBRE_EDIT)
            .click(Selector('#BtnGuardarCargos span').withText('Guardar'))
        //Se elimina el Cargo
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCargos');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_CargosUX - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Cargo testerp - Test Hgi360', async t => {
    await ejecutarPruebaCargos1(t, testAdminConfig);
});

test('Prueba CRUD Cargo mierp - Test Hgi360', async t => {
    await ejecutarPruebaCargos2(t, testAdminConfig);
});

fixture `CRUD_CargosUX - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Cargo Hgi360 Admin - Hgi360 Admin', async t => {
    await ejecutarPruebaCargos1(t, hgiAdminConfig);
});

test('Prueba CRUD Cargo mierp - Hgi360 Admin', async t => {
    await ejecutarPruebaCargos2(t, hgiAdminConfig);
});
