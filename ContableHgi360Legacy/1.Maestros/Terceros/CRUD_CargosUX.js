import { Selector } from 'testcafe';
import { ingresarAplicacion, abrirMaestros360, eliminarRegistroSiExiste, cerrarSesion360, cerrarPestana360, eliminarRegistroDesdeGrid, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 

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


async function ejecutarPruebaCargos1(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Cargos');
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

async function ejecutarPruebaCargos2(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Cargos');
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

fixture `CRUD_CargosUX - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba CRUD Cargo Test Contable - Mi ERP', async t => {
    await ejecutarPruebaCargos1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba CRUD Cargo Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaCargos2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `CRUD_CargosUX - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba CRUD Cargo Test Contable - Test Contable', async t => {
    await ejecutarPruebaCargos1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba CRUD Cargo Mi Contable - Test Contable', async t => {
    await ejecutarPruebaCargos2(t, testContableConfig, ingresarAplicacion);
});
