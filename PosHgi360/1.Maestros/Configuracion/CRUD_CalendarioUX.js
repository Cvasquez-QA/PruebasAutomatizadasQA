import { Selector } from 'testcafe';
import {
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { abrirMaestroPos360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = '81';
const FESTIVOS = '4';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    //Se ingresa al maestro de Calendario
        await abrirMaestros360(t, 'Calendario');
        await eliminarRegistroSiExiste(t, '#gridCalendario', CODIGO, 1);
        await t
            .click('#gridCalendario .dx-icon.dx-icon-add')
            .typeText('#txtIdCalendario', CODIGO)
            .wait(2000)
            .click('#txtCalendario_FechaInicial .dx-texteditor-input')
            .pressKey('2')
            .pressKey('0')
            .pressKey('2')
            .pressKey('6')
            .pressKey('0')
            .pressKey('2')
            .pressKey('0')
            .pressKey('3')
            //.typeText('#txtCalendario_FechaInicial .dx-dropdowneditor-icon','2024-09-01')
            //.typeText('#txtCalendario_FechaFinal .dx-dropdowneditor-icon','2024-09-01')
            .doubleClick('#txtCalendario_FechaFinal .dx-texteditor-input')
            .pressKey('2')
            .pressKey('0')
            .pressKey('2')
            .pressKey('6')
            .pressKey('0')
            .pressKey('2')
            .pressKey('0')
            .pressKey('3')
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
            .wait(2000)
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
        //Se valida la creación
            .wait(4000)
            .expect(Selector('#gridCalendario td').withText(CODIGO).visible).ok()
        //Se edita
            .click(Selector('#gridCalendario [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .typeText('#txtCalendario_Festivos .dx-texteditor-input', FESTIVOS)
            .click(Selector('#BtnGuardarCalendario div').withText('Guardar'))
           // .click(Selector('button').withText('Aceptar').nth(1))
            .wait(4000)
        //Se elimina el Calendario
            await eliminarRegistroSiExiste(t, '#gridCalendario', CODIGO, 1);
       await cerrarPestana360(t);
       await cerrarSesion360(t);
}

fixture `Prueba Calendario Admin TestERP - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Calendario mierp CRUD ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Calendario Admin TestERP - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Calendario mierp CRUD ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
