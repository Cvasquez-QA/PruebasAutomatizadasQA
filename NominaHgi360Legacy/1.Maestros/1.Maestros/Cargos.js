import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const CODIGO_CARGO = 'MiCargo';
const NOMBRE_CARGO = 'CargoNombre';
const FUNCIONES_CARGO = 'FuncionesCargo';
const PERFIL_CARGO = 'PerfilCargo';
const FUNCIONES_ACTUALIZADAS = 'MINUEVADESCRIPCION';
const GRID_CARGOS = '#gridCargos';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Cargos');
        await eliminarRegistroSiExiste(t, GRID_CARGOS, CODIGO_CARGO);

        await t
            .click(`${GRID_CARGOS} .dx-icon.dx-icon-add`)
            .typeText('#Cargos_StrIdCargo', CODIGO_CARGO)
            .typeText('#txtCargos_StrNombre .dx-texteditor-input', NOMBRE_CARGO)
            .typeText('#txtCargos_TxtFunciones .dx-texteditor-input', FUNCIONES_CARGO)
            .typeText('#txtCargos_TxtPerfil .dx-texteditor-input', PERFIL_CARGO)
            .click(Selector('#BtnGuardarCargos span').withText('Guardar'))
            .wait(3000)
            .expect(Selector(`${GRID_CARGOS} td`).withText(CODIGO_CARGO).exists).ok()
            .click(Selector(`${GRID_CARGOS} [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]`).nth(1))
            .click('#txtCargos_TxtFunciones .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCargos_TxtFunciones .dx-texteditor-input', FUNCIONES_ACTUALIZADAS)
            .click(Selector('#BtnGuardarCargos div').withText('Guardar'))
            .wait(4000);

        await eliminarRegistroSiExiste(t, GRID_CARGOS, CODIGO_CARGO);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Cargos Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Cargos testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Cargos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Cargos testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
